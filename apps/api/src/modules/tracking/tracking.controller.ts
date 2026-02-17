
import { Controller, Get, Param, Res, Header, Req, Query, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { TrackingService } from './tracking.service';
import { Buffer } from 'buffer';

@Controller('t')
export class TrackingController {
  constructor(private readonly trackingService: TrackingService) {}

  /**
   * Open Tracking Pixel
   * GET /t/o/:logId
   */
  @Get('o/:logId')
  @Header('Content-Type', 'image/gif')
  @Header('Cache-Control', 'no-cache, no-store, must-revalidate')
  async trackOpen(@Param('logId') logId: string, @Req() req: any, @Res() res: any) {
    const ip = req.ip;
    const userAgent = req.headers['user-agent'];
    await this.trackingService.logOpenEvent(logId, { ip, userAgent });
    
    const pixel = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');
    res.send(pixel);
  }

  /**
   * Click Tracking Proxy
   * GET /t/c/:logId?r={base64Url}
   */
  @Get('c/:logId')
  async trackClick(@Param('logId') logId: string, @Query('r') redirectUrl: string, @Req() req: any, @Res() res: Response) {
    const ip = req.ip;
    const userAgent = req.headers['user-agent'];

    try {
      // 1. Record the click event
      await this.trackingService.logClickEvent(logId, { ip, userAgent });

      // 2. Decode the target URL
      const decodedUrl = Buffer.from(redirectUrl, 'base64url').toString('utf8');

      // 3. Redirect to the original destination
      // Fix: Access redirect with type assertion to resolve Property 'redirect' does not exist error on Response in this environment.
      return (res as any).redirect(HttpStatus.FOUND, decodedUrl);
    } catch (err) {
      // Fallback: if decoding fails, send them to home
      // Fix: Access redirect with type assertion to resolve Property 'redirect' does not exist error on Response in this environment.
      return (res as any).redirect('https://skyreach.ai');
    }
  }
}
