import { Injectable, Logger } from '@nestjs/common';
import { InboxesService } from '../inboxes/inboxes.service';
import { QueuesService } from '../queues/queues.service';
import { PrismaService } from '../prisma/prisma.service';
import { GoogleGenAI } from "@google/genai";

@Injectable()
export class WarmupService {
  private readonly logger = new Logger(WarmupService.name);
  private ai: GoogleGenAI;

  constructor(
    private readonly prisma: PrismaService,
    private readonly inboxesService: InboxesService,
    private readonly queuesService: QueuesService,
  ) {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async getPoolStats(workspaceId: string) {
    return (this.prisma as any).warmupAccount.findMany({
      where: { inbox: { workspaceId } },
      include: { inbox: true }
    });
  }

  async toggleWarmup(workspaceId: string, inboxId: string, enabled: boolean) {
    return (this.prisma as any).$transaction(async (tx: any) => {
      // 1. Update Inbox status
      await tx.inbox.update({
        where: { id: inboxId, workspaceId },
        data: { warmupEnabled: enabled }
      });

      // 2. Manage WarmupAccount record
      let account = await tx.warmupAccount.findUnique({ where: { inboxId } });

      if (!account && enabled) {
        account = await tx.warmupAccount.create({
          data: {
            inboxId,
            dailyLimit: 50,
            rampUpPerDay: 5,
            reputationScore: 100
          }
        });
      }

      return account;
    });
  }

  /**
   * Calculates how many warmup emails an account should send today
   * based on its ramp-up curve.
   */
  calculateDailyTarget(account: any): number {
    const startDate = new Date(account.id ? parseInt(account.id.split('_')[1]) || Date.now() : Date.now()); // Fallback if no specific start date field
    // Better: use the 'createdAt' field from DB
    const daysActive = Math.floor((Date.now() - new Date(account.createdAt || Date.now()).getTime()) / (1000 * 60 * 60 * 24));
    const target = (daysActive + 1) * account.rampUpPerDay;
    return Math.min(target, account.dailyLimit);
  }

  /**
   * Generates a realistic human-like email or reply for warmup threads.
   */
  async generateWarmupContent(isReply: boolean = false, context?: string): Promise<{ subject: string; body: string }> {
    try {
      this.logger.debug('Generating AI warmup content...');
      const prompt = isReply
        ? `Generate a brief, positive, human-like professional reply to this email: "${context}". Keep it under 2 sentences.`
        : `Generate a random, human-like professional email subject and body about a general business topic (e.g., productivity, news, tech trends). Keep the body under 3 sentences. Return as JSON: { "subject": "...", "body": "..." }`;

      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });

      const data = JSON.parse(response.text || '{}');
      return {
        subject: data.subject || 'Quick thought on productivity',
        body: data.body || 'I was reading an article today about how async workflows are changing the way teams operate. What are your thoughts?'
      };
    } catch (err) {
      this.logger.error('Failed to generate AI warmup content', err);
      return {
        subject: 'Quick question',
        body: 'Just wanted to reach out and see how things are going on your end.'
      };
    }
  }

  /**
   * Entry point for the warmup scheduler (triggered periodically).
   */
  async triggerWarmupCycle() {
    this.logger.log('Executing Persistent Warmup Cycle...');

    const activeAccounts = await (this.prisma as any).warmupAccount.findMany({
      where: { inbox: { warmupEnabled: true, status: 'active' } },
      include: { inbox: true }
    });

    for (const sender of activeAccounts) {
      const target = this.calculateDailyTarget(sender);
      // Note: currentDailyCount logic should ideally check SendingLogs for today
      // For now, we'll use totalSent as a proxy or add a today's count field if needed
      if (sender.totalSent >= target * 10) continue; // Rough limit for demo

      const recipient = await this.findRandomRecipient(sender.inboxId);
      if (!recipient) continue;

      const content = await this.generateWarmupContent();

      await this.queuesService.addWarmupJob({
        senderId: sender.inboxId,
        recipientId: recipient.inboxId,
        subject: content.subject,
        body: content.body,
        isInitial: true
      });

      // Atomic increment
      await (this.prisma as any).warmupAccount.update({
        where: { id: sender.id },
        data: { totalSent: { increment: 1 } }
      });
    }
  }

  private async findRandomRecipient(excludeInboxId: string): Promise<any> {
    const count = await (this.prisma as any).warmupAccount.count({
      where: { inboxId: { not: excludeInboxId } }
    });

    if (count === 0) return null;

    const skip = Math.floor(Math.random() * count);
    const recipients = await (this.prisma as any).warmupAccount.findMany({
      where: { inboxId: { not: excludeInboxId } },
      skip,
      take: 1,
      include: { inbox: true }
    });

    return recipients[0] || null;
  }
}
