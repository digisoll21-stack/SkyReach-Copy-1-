
import { Injectable, Logger } from '@nestjs/common';
import { InboxesService } from '../inboxes/inboxes.service';
import { QueuesService } from '../queues/queues.service';
import { WarmupAccount } from '@shared/types';
import { GoogleGenAI } from "@google/genai";

@Injectable()
export class WarmupService {
  private readonly logger = new Logger(WarmupService.name);
  private warmupAccounts: WarmupAccount[] = []; // Mock DB
  private ai: GoogleGenAI;

  constructor(
    private readonly inboxesService: InboxesService,
    private readonly queuesService: QueuesService,
  ) {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async getPoolStats(workspaceId: string) {
    return this.warmupAccounts.filter(a => a.workspaceId === workspaceId);
  }

  async toggleWarmup(workspaceId: string, inboxId: string, enabled: boolean) {
    let account = this.warmupAccounts.find(a => a.inboxId === inboxId && a.workspaceId === workspaceId);

    if (!account && enabled) {
      account = {
        id: `wa_${Date.now()}`,
        inboxId,
        workspaceId,
        status: 'active',
        dailyLimit: 50,
        currentDailyCount: 0,
        rampUpPerDay: 5,
        startDate: new Date(),
        totalSent: 0,
        totalReceived: 0,
        reputationScore: 100
      };
      this.warmupAccounts.push(account);
    } else if (account) {
      account.status = enabled ? 'active' : 'paused';
    }

    return account;
  }

  /**
   * Calculates how many warmup emails an account should send today
   * based on its ramp-up curve.
   */
  calculateDailyTarget(account: WarmupAccount): number {
    const daysActive = Math.floor((Date.now() - account.startDate.getTime()) / (1000 * 60 * 60 * 24));
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
    this.logger.log('Starting Warmup Cycle...');
    const activeAccounts = this.warmupAccounts.filter(a => a.status === 'active');

    for (const sender of activeAccounts) {
      const target = this.calculateDailyTarget(sender);
      if (sender.currentDailyCount >= target) continue;

      // Find a random recipient from the GLOBAL warmup pool (other accounts)
      const recipient = this.findRandomRecipient(sender.id);
      if (!recipient) continue;

      const content = await this.generateWarmupContent();

      await this.queuesService.addWarmupJob({
        senderId: sender.inboxId,
        recipientId: recipient.inboxId,
        subject: content.subject,
        body: content.body,
        isInitial: true
      });

      sender.currentDailyCount++;
      sender.totalSent++;
    }
  }

  private findRandomRecipient(excludeId: string): WarmupAccount | null {
    const pool = this.warmupAccounts.filter(a => a.id !== excludeId);
    if (pool.length === 0) return null;
    return pool[Math.floor(Math.random() * pool.length)];
  }
}
