
import { Injectable, Logger } from '@nestjs/common';
import { LeadsService } from '../leads/leads.service';
import { CampaignsService } from '../campaigns/campaigns.service';
import { InboxesService } from '../inboxes/inboxes.service';
import { TrackingService } from '../tracking/tracking.service';
import { NotificationsService } from '../notifications/notifications.service';
import { LeadStatus, BounceType, CampaignStatus, NotificationType, Severity } from '@shared/types';

export interface BounceEvent {
  logId: string;
  type: 'hard' | 'soft' | 'spam';
  rawReason: string;
}

@Injectable()
export class BouncesService {
  private readonly logger = new Logger(BouncesService.name);

  // Stats for auto-pausing (In production, use Redis)
  private campaignStats = new Map<string, { sent: number; bounces: number }>();

  constructor(
    private readonly leadsService: LeadsService,
    private readonly campaignsService: CampaignsService,
    private readonly inboxesService: InboxesService,
    private readonly trackingService: TrackingService,
    private readonly notificationsService: NotificationsService,
  ) { }

  /**
   * Main entry point for processing a detected bounce or complaint
   */
  async processBounceEvent(event: BounceEvent) {
    this.logger.warn(`Processing ${event.type} bounce for log: ${event.logId}`);

    // 1. Get Log Context (Find Lead/Campaign/Inbox)
    // FIX: Added await to the async call to fetch sending log context from TrackingService
    const log = await this.trackingService.getSendingLog(event.logId);
    if (!log) {
      this.logger.error(`Could not find sending log for ID: ${event.logId}`);
      return;
    }

    const { leadId, campaignId, workspaceId, inboxId } = log;

    // 2. Classify and Update Lead
    if (event.type === 'hard') {
      await this.leadsService.updateStatus(workspaceId, leadId, LeadStatus.BOUNCED);
    } else if (event.type === 'spam') {
      await this.leadsService.updateStatus(workspaceId, leadId, LeadStatus.SPAM_COMPLAINT);

      // Notify workspace of spam complaint
      await this.notificationsService.createAlert({
        workspaceId,
        type: NotificationType.SPAM_COMPLAINT,
        severity: Severity.CRITICAL,
        title: 'Spam Complaint Detected',
        message: `Lead ${leadId} marked an email from inbox ${inboxId} as spam. Inbox has been paused for safety.`,
        metadata: { leadId, inboxId, campaignId }
      });

      // High severity: pause inbox immediately
      await this.protectInbox(workspaceId, inboxId, 'Spam complaint detected');
    }

    // 3. Update Statistics & Protection
    await this.updateReputationStats(workspaceId, campaignId, event);
  }

  private async updateReputationStats(workspaceId: string, campaignId: string, event: BounceEvent) {
    const stats = this.campaignStats.get(campaignId) || { sent: 0, bounces: 0 };

    // Logic: In production, we'd use a rolling window of the last X sent emails
    stats.sent += 1;
    stats.bounces += (event.type === 'hard' || event.type === 'spam') ? 1 : 0;
    this.campaignStats.set(campaignId, stats);

    // Get Campaign Settings
    const campaign = await this.campaignsService.findOne(workspaceId, campaignId);
    const bounceThreshold = campaign.settings.autoPauseOnBounceRate || 5;

    // Check if threshold reached
    if (stats.sent > 20) {
      const rate = (stats.bounces / stats.sent) * 100;
      if (rate >= bounceThreshold) {
        this.logger.error(`Bounce rate for campaign ${campaignId} reached ${rate}%. Pausing for safety.`);

        await this.campaignsService.update(workspaceId, campaignId, { status: CampaignStatus.PAUSED });

        // Create system alert
        await this.notificationsService.createAlert({
          workspaceId,
          type: NotificationType.BOUNCE_SPIKE,
          severity: Severity.CRITICAL,
          title: 'Campaign Auto-Paused: High Bounce Rate',
          message: `Campaign "${campaign.name}" has been paused because its bounce rate hit ${rate.toFixed(1)}%, exceeding your safety threshold of ${bounceThreshold}%.`,
          metadata: { campaignId, rate, threshold: bounceThreshold }
        });
      }
    }
  }

  private async protectInbox(workspaceId: string, inboxId: string, reason: string) {
    this.logger.error(`Protecting inbox ${inboxId}: ${reason}`);
    await this.inboxesService.updateSettings(workspaceId, inboxId, { status: 'paused' } as any);

    await this.notificationsService.createAlert({
      workspaceId,
      type: NotificationType.INBOX_DISCONNECTED,
      severity: Severity.WARNING,
      title: 'Inbox Protection Triggered',
      message: `Inbox ${inboxId} was automatically paused: ${reason}. Please review your settings.`,
    });
  }
}
