
import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { TenantContextService } from '../../common/context/tenant-context.service';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  public client: any;

  constructor(private readonly tenantContext: TenantContextService) {
    const rawClient = new PrismaClient({
      datasources: {
        db: { url: process.env.DATABASE_URL },
      },
      log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
    });

    // AUTO-INJECT MULTI-TENANCY & PERFORMANCE FILTER
    this.client = rawClient.$extends({
      query: {
        $allModels: {
          async $allOperations({ model, operation, args, query }) {
            const workspaceId = tenantContext.getWorkspaceId();

            // CRITICAL FIX: Only inject workspaceId into models that actually have the field
            const modelsWithWorkspace = ['Inbox', 'Domain', 'Lead', 'Campaign', 'SendingLog', 'ReplyLog', 'Member'];
            const bypassModels = ['User', 'Workspace'];

            if (bypassModels.includes(model) || !modelsWithWorkspace.includes(model) || !workspaceId) {
              return query(args);
            }

            // Enforce workspace isolation for all supported operations
            const anyArgs = args as any || {};
            anyArgs.where = anyArgs.where || {};

            if (['findFirst', 'findMany', 'findUnique', 'count', 'update', 'delete', 'updateMany', 'deleteMany'].includes(operation)) {
              anyArgs.where = { ...anyArgs.where, workspaceId };
            }

            if (operation === 'upsert') {
              anyArgs.create = { ...anyArgs.create, workspaceId };
              anyArgs.update = { ...anyArgs.update, workspaceId };
              anyArgs.where = { ...anyArgs.where, workspaceId };
            }

            if (['create', 'createMany'].includes(operation)) {
              if (Array.isArray(anyArgs.data)) {
                anyArgs.data = anyArgs.data.map((item: any) => ({ ...item, workspaceId }));
              } else {
                anyArgs.data = { ...anyArgs.data, workspaceId };
              }
            }

            return query(args);
          },
        },
      },
    });
  }

  get user() { return (this.client as any).user; }
  get workspace() { return (this.client as any).workspace; }
  get member() { return (this.client as any).member; }
  get lead() { return (this.client as any).lead; }
  get inbox() { return (this.client as any).inbox; }
  get campaign() { return (this.client as any).campaign; }
  get sendingLog() { return (this.client as any).sendingLog; }
  get replyLog() { return (this.client as any).replyLog; }
  get domain() { return (this.client as any).domain; }
  get warmupAccount() { return (this.client as any).warmupAccount; }
  get sequenceStep() { return (this.client as any).sequenceStep; }
  get $queryRaw() { return (this.client as any).$queryRaw; }

  async onModuleInit() {
    let retries = 5;
    while (retries > 0) {
      try {
        await (this.client as any).$connect();
        this.logger.log('SkyReach Persistence Layer: Online');
        break;
      } catch (err) {
        retries--;
        const isPoolerError = err.message.includes('MaxClientsInSessionMode');
        const advice = isPoolerError ? ' PRO-TIP: Add ?connection_limit=2 to your DATABASE_URL in Render.' : '';
        this.logger.error(`DB Connection failed: ${err.message}.${advice} Retrying... (${retries} left)`);
        await new Promise(res => setTimeout(res, 5000));
      }
    }
    if (retries === 0) throw new Error('Database unreachable');
  }

  async onModuleDestroy() {
    await (this.client as any).$disconnect();
  }

  async $transaction(fn: any) {
    return this.client.$transaction(fn);
  }
}
