import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class TenantContextService {
  private workspaceId: string | null = null;
  private userId: string | null = null;

  setWorkspaceId(id: string) {
    this.workspaceId = id;
  }

  getWorkspaceId(): string | null {
    return this.workspaceId;
  }

  setUserId(id: string) {
    this.userId = id;
  }

  getUserId(): string | null {
    return this.userId;
  }
}