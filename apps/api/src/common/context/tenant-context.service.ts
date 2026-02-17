
import { Injectable, Scope } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';

export interface TenantContext {
  workspaceId: string | null;
  userId: string | null;
}

@Injectable() // Singleton scope
export class TenantContextService {
  private static readonly storage = new AsyncLocalStorage<TenantContext>();

  runWithContext<T>(context: TenantContext, fn: () => T): T {
    return TenantContextService.storage.run(context, fn);
  }

  setWorkspaceId(id: string) {
    const context = TenantContextService.storage.getStore() || { workspaceId: null, userId: null };
    context.workspaceId = id;
  }

  getWorkspaceId(): string | null {
    return TenantContextService.storage.getStore()?.workspaceId || null;
  }

  setUserId(id: string) {
    const context = TenantContextService.storage.getStore() || { workspaceId: null, userId: null };
    context.userId = id;
  }

  getUserId(): string | null {
    return TenantContextService.storage.getStore()?.userId || null;
  }
}