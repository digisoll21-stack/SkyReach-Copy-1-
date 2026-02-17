
import { Injectable, Logger } from '@nestjs/common';
import { AuditLog } from '@shared/types';

@Injectable()
export class AuditLogsService {
  private readonly logger = new Logger(AuditLogsService.name);
  private logs: AuditLog[] = []; // Mock DB

  async findAll(workspaceId: string, filters: { entityType?: string, userId?: string }) {
    let list = this.logs.filter(l => l.workspaceId === workspaceId);
    if (filters.entityType) list = list.filter(l => l.entityType === filters.entityType);
    if (filters.userId) list = list.filter(l => l.userId === filters.userId);
    return list.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  /**
   * Record an action in the audit trail.
   */
  async log(data: {
    workspaceId: string;
    userId: string;
    userEmail: string;
    action: string;
    entityType: string;
    entityId: string;
    changes?: Record<string, any>;
    ipAddress?: string;
  }) {
    const log: AuditLog = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      workspaceId: data.workspaceId,
      userId: data.userId,
      userEmail: data.userEmail,
      action: data.action,
      entityType: data.entityType,
      entityId: data.entityId,
      changes: data.changes,
      ipAddress: data.ipAddress,
      createdAt: new Date(),
    };

    this.logs.push(log);
    this.logger.log(`Audit: ${data.userEmail} ${data.action} on ${data.entityType}:${data.entityId}`);
    return log;
  }
}
