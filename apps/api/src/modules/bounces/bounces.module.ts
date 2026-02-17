
import { Module } from '@nestjs/common';
import { BouncesService } from './bounces.service';
import { BouncesController } from './bounces.controller';
import { LeadsModule } from '../leads/leads.module';
import { CampaignsModule } from '../campaigns/campaigns.module';
import { InboxesModule } from '../inboxes/inboxes.module';
import { TrackingModule } from '../tracking/tracking.module';

@Module({
  imports: [LeadsModule, CampaignsModule, InboxesModule, TrackingModule],
  controllers: [BouncesController],
  providers: [BouncesService],
  exports: [BouncesService],
})
export class BouncesModule {}
