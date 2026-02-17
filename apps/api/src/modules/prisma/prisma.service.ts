
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

            // Bypass models for authentication and global ops
            const bypassModels = ['User', 'Workspace', 'Member'];
            if (bypassModels.includes(model) || !workspaceId) {
              return query(args);
            }

            // Enforce workspace isolation for all other operations
            const anyArgs = args as any;
            if (['findFirst', 'findMany', 'count', 'update', 'delete', 'updateMany', 'deleteMany'].includes(operation)) {
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
        this.logger.error(`DB Connection failed. Retrying... (${retries} left)`);
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
