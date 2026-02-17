
import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { Worker, Job } from 'bullmq';
import { ConfigService } from '@nestjs/config';
import { RedisLockService } from '@api/common/locks/redis-lock.service';

@Injectable()
export class WarmupProcessor implements OnModuleInit {
  private readonly logger = new Logger(WarmupProcessor.name);
  private worker: Worker;

  constructor(
    private readonly configService: ConfigService,
    private readonly lockService: RedisLockService,
  ) { }

  onModuleInit() {
    const redisUrl = this.configService.get<string>('REDIS_URL') || 'redis://localhost:6379';

    this.worker = new Worker(
      'warmup_queue',
      async (job: Job) => this.process(job),
      {
        connection: { url: redisUrl },
        concurrency: 10,
      }
    );
  }

  async process(job: Job) {
    const { senderId, recipientId, subject, body, isInitial } = job.data;

    const hasLock = await this.lockService.acquireLock(senderId, 30);
    if (!hasLock) throw new Error('Lock busy');

    try {
      this.logger.log(`Executing Warmup Job: ${senderId} -> ${recipientId}`);

      // 1. Send via provider (Mocked)
      // await this.providerAdapter.sendEmail(...)

      // 2. If it was an initial email, schedule a randomized reply from recipient
      if (isInitial && Math.random() > 0.3) { // 70% reply rate for warmup
        // This would add a delayed job back to the queue with isInitial=false
        this.logger.debug(`Simulating thread: scheduled reply from ${recipientId}`);
      }

      this.logger.log(`Warmup email successfully processed for ${senderId}`);
    } finally {
      await this.lockService.releaseLock(senderId);
    }
  }
}
