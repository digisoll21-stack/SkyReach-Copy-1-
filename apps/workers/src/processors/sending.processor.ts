
import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { Worker, Job } from 'bullmq';
import { ConfigService } from '@nestjs/config';
import { RedisLockService } from '@api/common/locks/redis-lock.service';
import { InboxesService } from '@api/modules/inboxes/inboxes.service';
import { PrismaService } from '@api/modules/prisma/prisma.service';
import { SmtpAdapter } from '@api/modules/inboxes/adapters/smtp.adapter';
import { LeadStatus } from '@shared/types';

@Injectable()
export class SendingProcessor implements OnModuleInit {
  private readonly logger = new Logger(SendingProcessor.name);
  private worker: Worker;

  constructor(
    private readonly configService: ConfigService,
    private readonly lockService: RedisLockService,
    private readonly inboxesService: InboxesService,
    private readonly prisma: PrismaService,
    private readonly smtpAdapter: SmtpAdapter,
  ) { }

  onModuleInit() {
    const redisUrl = this.configService.get<string>('REDIS_URL') || 'redis://localhost:6379';

    this.worker = new Worker(
      'email_sending_queue',
      async (job: Job) => this.process(job),
      {
        connection: { url: redisUrl },
        concurrency: 50,
      }
    );
  }

  async process(job: Job) {
    const { logId, inboxId, leadId, email } = job.data;

    const hasLock = await this.lockService.acquireLock(inboxId, 30);
    if (!hasLock) throw new Error('Inbox locked by another worker');

    try {
      const inbox = await (this.prisma as any).inbox.findUnique({ where: { id: inboxId } });
      if (!inbox || inbox.status !== 'active') {
        this.logger.warn(`Inbox ${inboxId} is not active. Skipping job ${job.id}`);
        return;
      }

      // CRITICAL: Check if lead is unsubscribed before sending
      const lead = await (this.prisma as any).lead.findUnique({ where: { id: leadId } });
      if (!lead || lead.status === LeadStatus.UNSUBSCRIBED) {
        this.logger.warn(`Lead ${leadId} is unsubscribed or not found. Skipping job ${job.id}`);
        await (this.prisma as any).sendingLog.update({
          where: { id: logId },
          data: { status: 'skipped', errorMessage: 'Lead unsubscribed' }
        });
        return;
      }

      const creds = await this.inboxesService.getDecryptedCredentials(inboxId);

      // Execute Sending
      const result = await this.smtpAdapter.sendEmail(creds, {
        to: email.to,
        subject: email.subject,
        body: email.body,
      });

      // Update Database
      await (this.prisma as any).sendingLog.update({
        where: { id: logId },
        data: {
          status: 'sent',
          sentAt: new Date(),
        }
      });

      await (this.prisma as any).lead.update({
        where: { id: leadId },
        data: { status: LeadStatus.SENT }
      });

      this.logger.log(`[Job ${job.id}] Successfully sent email to ${email.to}`);

    } catch (err) {
      this.logger.error(`[Job ${job.id}] Failed: ${err.message}`);

      await (this.prisma as any).sendingLog.update({
        where: { id: logId },
        data: {
          status: 'failed',
          errorMessage: err.message
        }
      });

      throw err; // Re-queue if transient
    } finally {
      await this.lockService.releaseLock(inboxId);
    }
  }
}
