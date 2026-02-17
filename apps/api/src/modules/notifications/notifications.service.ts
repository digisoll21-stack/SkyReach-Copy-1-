import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { WorkspaceNotification, NotificationType, Severity } from '@shared/types';
import { EventEmitter } from 'events';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private notifications: WorkspaceNotification[] = []; // Mock DB
  private eventBus = new EventEmitter();

  constructor() {
    // Basic event bus listeners for auto-actions
    // Fix: Corrected the listener to call 'createAlert' instead of 'dispatch' which does not exist.
    this.eventBus.on('system_alert', (data) => this.createAlert(data));
  }

  async findAll(workspaceId: string, unreadOnly: boolean = false) {
    let list = this.notifications.filter(n => n.workspaceId === workspaceId);
    if (unreadOnly) list = list.filter(n => !n.isRead);
    return list.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async markAsRead(workspaceId: string, id: string) {
    const notification = this.notifications.find(n => n.id === id && n.workspaceId === workspaceId);
    if (!notification) throw new NotFoundException('Notification not found');
    notification.isRead = true;
    return notification;
  }

  async markAllRead(workspaceId: string) {
    this.notifications
      .filter(n => n.workspaceId === workspaceId)
      .forEach(n => n.isRead = true);
    return { success: true };
  }

  async remove(workspaceId: string, id: string) {
    const index = this.notifications.findIndex(n => n.id === id && n.workspaceId === workspaceId);
    if (index !== -1) {
      this.notifications.splice(index, 1);
    }
    return { success: true };
  }

  /**
   * Internal method to trigger a new workspace alert.
   * Can be called directly or via the internal event bus.
   */
  async createAlert(data: {
    workspaceId: string;
    type: NotificationType;
    severity: Severity;
    title: string;
    message: string;
    metadata?: Record<string, any>;
  }) {
    const notification: WorkspaceNotification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      workspaceId: data.workspaceId,
      type: data.type,
      severity: data.severity,
      title: data.title,
      message: data.message,
      isRead: false,
      metadata: data.metadata,
      createdAt: new Date(),
    };

    this.notifications.push(notification);
    this.logger.log(`Alert Dispatched: [${data.severity.toUpperCase()}] ${data.title} for Workspace ${data.workspaceId}`);

    // In production, this would trigger Email/Slack/Webhook workers via a queue
    return notification;
  }

  /**
   * Public emitter for other services to use.
   */
  emit(event: string, payload: any) {
    this.eventBus.emit(event, payload);
  }
}