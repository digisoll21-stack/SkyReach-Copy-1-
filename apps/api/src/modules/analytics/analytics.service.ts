
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) { }

  async getCampaignStats(campaignId: string) {
    const logs = await (this.prisma as any).sendingLog.groupBy({
      by: ['status'],
      where: { campaignId },
      _count: true,
    });

    const replies = await (this.prisma as any).replyLog.count({
      where: { campaignId }
    });

    return {
      sent: logs.find(l => l.status === 'sent')?._count || 0,
      failed: logs.find(l => l.status === 'failed')?._count || 0,
      replies,
    };
  }

  async getGlobalPulse(workspaceId: string) {
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);
    last7Days.setHours(0, 0, 0, 0);

    // Aggregate SendingLogs in DB
    const logStats = await (this.prisma as any).sendingLog.groupBy({
      by: ['sentAt'],
      where: {
        workspaceId,
        sentAt: { gte: last7Days },
        status: 'sent'
      },
      _count: true
    });

    // Aggregate ReplyLogs in DB
    const replyStats = await (this.prisma as any).replyLog.groupBy({
      by: ['receivedAt'],
      where: {
        workspaceId,
        receivedAt: { gte: last7Days }
      },
      _count: true
    });

    const stats = new Map<string, { sent: number; replies: number }>();

    // Initialize map
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      stats.set(dateStr, { sent: 0, replies: 0 });
    }

    logStats.forEach((s: any) => {
      if (s.sentAt) {
        const dateStr = new Date(s.sentAt).toISOString().split('T')[0];
        if (stats.has(dateStr)) {
          stats.get(dateStr)!.sent += s._count;
        }
      }
    });

    replyStats.forEach((s: any) => {
      const dateStr = new Date(s.receivedAt).toISOString().split('T')[0];
      if (stats.has(dateStr)) {
        stats.get(dateStr)!.replies += s._count;
      }
    });

    return Array.from(stats.entries()).map(([date, data]) => ({
      name: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
      date,
      ...data
    })).reverse();
  }
}
