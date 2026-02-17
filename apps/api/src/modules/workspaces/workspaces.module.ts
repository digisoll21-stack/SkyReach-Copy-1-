
import { Module } from '@nestjs/common';
import { WorkspacesService } from './workspaces.service';
import { WorkspacesController } from './workspaces.controller';
import { SubscriptionService } from './subscription.service';

import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [WorkspacesController],
  providers: [WorkspacesService, SubscriptionService],
  exports: [WorkspacesService, SubscriptionService],
})
export class WorkspacesModule { }
