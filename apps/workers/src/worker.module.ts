
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SendingProcessor } from './processors/sending.processor';
import { WarmupProcessor } from './processors/warmup.processor';
import { InboxesModule } from '@api/modules/inboxes/inboxes.module';
import { RedisLockService } from '@api/common/locks/redis-lock.service';
import { SmtpAdapter } from '@api/modules/inboxes/adapters/smtp.adapter';
import { PrismaModule } from '@api/modules/prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    InboxesModule,
  ],
  providers: [
    SendingProcessor,
    WarmupProcessor,
    RedisLockService,
    SmtpAdapter,
  ],
})
export class WorkerModule { }
