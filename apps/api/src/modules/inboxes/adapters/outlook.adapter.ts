
import { Injectable, Logger } from '@nestjs/common';
import { EmailProviderAdapter, ProviderHealth } from './provider.adapter';

@Injectable()
export class OutlookAdapter implements EmailProviderAdapter {
  private readonly logger = new Logger(OutlookAdapter.name);

  async validateCredentials(credentials: any): Promise<boolean> {
    this.logger.debug('Validating Microsoft Graph tokens...');
    return !!credentials.accessToken;
  }

  async sendEmail(credentials: any, payload: any): Promise<{ messageId: string }> {
    this.logger.debug(`Sending Outlook mail from ${payload.from}`);
    return { messageId: `o_${Date.now()}` };
  }

  async fetchReplies(credentials: any, lastCheck: Date): Promise<any[]> {
    return [];
  }

  async healthCheck(credentials: any): Promise<ProviderHealth> {
    return { status: 'active', score: 95 };
  }
}
