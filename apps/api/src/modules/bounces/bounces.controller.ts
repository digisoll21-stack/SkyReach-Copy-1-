
import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { BouncesService } from './bounces.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('bounces')
export class BouncesController {
  constructor(private readonly bouncesService: BouncesService) {}

  /**
   * Ingest a bounce notification (from a provider webhook like SendGrid/Mailgun/SES)
   */
  @Post('webhook')
  async handleProviderWebhook(@Body() payload: any) {
    // In a real app, map provider payload to internal BounceEvent
    return this.bouncesService.processBounceEvent({
      logId: payload.metadata?.logId || payload.logId,
      type: payload.bounceType === 'Permanent' ? 'hard' : 'soft',
      rawReason: payload.reason || payload.diagnosticCode,
    });
  }

  /**
   * Manual bounce check (for debugging)
   */
  @Post('test')
  @UseGuards(JwtAuthGuard)
  async testBounce(@Body() data: { logId: string; type: 'hard' | 'soft' | 'spam' }) {
    return this.bouncesService.processBounceEvent({
      logId: data.logId,
      type: data.type,
      rawReason: 'Manual test bounce',
    });
  }
}
