
/**
 * SENDING ENGINE
 * 
 * Responsibility:
 * - Calculate next step in a campaign sequence.
 * - Apply spintax and personalization variables.
 * - Enforcement of Rate Limits (Daily/Hourly).
 * - Scheduling jobs in BullMQ `email_sending_queue`.
 */

export class SendingService {
  async processCampaign(campaignId: string) { /* determine next batch of leads */ }
  async scheduleEmail(leadId: string, stepId: string) { /* push to BullMQ */ }
}
