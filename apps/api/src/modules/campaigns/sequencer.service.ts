import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueuesService } from '../queues/queues.service';
import { LeadStatus } from '@shared/types';

@Injectable()
export class SequencerService {
    private readonly logger = new Logger(SequencerService.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly queuesService: QueuesService,
    ) { }

    /**
     * Main entry point for the campaign sequencing engine.
     * Scans all active campaigns and moves leads to their next steps.
     */
    async processSequences() {
        this.logger.log('Starting Campaign Sequencing Cycle...');

        const activeCampaigns = await (this.prisma as any).campaign.findMany({
            where: { status: 'active' },
            include: {
                steps: { orderBy: { order: 'asc' } },
                workspace: true
            }
        });

        for (const campaign of activeCampaigns) {
            await this.processCampaignLeads(campaign);
        }

        this.logger.log('Campaign Sequencing Cycle Completed.');
    }

    private async processCampaignLeads(campaign: any) {
        // Find leads in this campaign that are not replied or unsubscribed
        const leads = await (this.prisma as any).lead.findMany({
            where: {
                campaignId: campaign.id,
                status: { in: ['pending', 'sent'] }
            },
            include: {
                sendingLogs: {
                    orderBy: { createdAt: 'desc' },
                    take: 1
                }
            }
        });

        for (const lead of leads) {
            try {
                await this.evaluateLeadProgression(lead, campaign);
            } catch (err) {
                this.logger.error(`Failed to process progression for lead ${lead.email}: ${err.message}`);
            }
        }
    }

    private async evaluateLeadProgression(lead: any, campaign: any) {
        const lastLog = lead.sendingLogs[0];

        // 1. Determine Current Step Index
        let nextStepIndex = 0;
        if (lastLog) {
            const currentStep = campaign.steps.find((s: any) => s.id === lastLog.stepId);
            if (currentStep) {
                nextStepIndex = campaign.steps.indexOf(currentStep) + 1;
            }
        }

        // 2. Check if there is a next step
        const nextStep = campaign.steps[nextStepIndex];
        if (!nextStep) {
            // Lead has finished all available steps
            return;
        }

        // 3. Verify "Wait Days" condition
        if (lastLog) {
            const waitDays = nextStep.waitDays || 0;
            const lastSentAt = new Date(lastLog.createdAt);
            const readyAt = new Date(lastSentAt);
            readyAt.setDate(readyAt.getDate() + waitDays);

            if (Date.now() < readyAt.getTime()) {
                // Still in wait period
                return;
            }
        }

        // 4. Select an Inbox for sending (Round-robin or random)
        const inboxes = await (this.prisma as any).inbox.findMany({
            where: { workspaceId: campaign.workspaceId, status: 'active' },
            take: 1 // Simple selection for now, could be improved with rotation logic
        });

        if (inboxes.length === 0) {
            this.logger.warn(`No active inboxes available for workspace ${campaign.workspaceId}`);
            return;
        }

        const inbox = inboxes[0];

        // 5. Queue the job
        this.logger.log(`Sequencing: Moving lead ${lead.email} to Step ${nextStepIndex + 1} (${nextStep.subject})`);

        await this.queuesService.addSendingJob({
            workspaceId: campaign.workspaceId,
            campaignId: campaign.id,
            leadId: lead.id,
            inboxId: inbox.id,
            stepId: nextStep.id,
            subject: nextStep.subject,
            body: nextStep.body
        });
    }
}
