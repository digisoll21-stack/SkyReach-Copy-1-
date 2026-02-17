
import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
    constructor(private readonly analyticsService: AnalyticsService) { }

    @Get('pulse')
    async getPulse(@Request() req: any) {
        return this.analyticsService.getGlobalPulse(req.user.workspaceId);
    }
}
