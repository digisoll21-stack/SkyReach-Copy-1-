import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SecurityService } from '../security/security.service';
import { CreateInboxDto, UpdateInboxSettingsDto, InboxProvider } from './dto/inbox.dto';
import { SmtpAdapter } from './adapters/smtp.adapter';

@Injectable()
export class InboxesService {
  private readonly logger = new Logger(InboxesService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly security: SecurityService,
    private readonly smtpAdapter: SmtpAdapter,
  ) { }

  async create(workspaceId: string, dto: CreateInboxDto) {
    this.logger.log(`Initiating protocol check for node: ${dto.email}`);

    // 0. Pre-check: Ensure email doesn't already exist in the system
    const existing = await (this.prisma as any).inbox.findUnique({
      where: { email: dto.email }
    });

    if (existing) {
      throw new BadRequestException(`Email account ${dto.email} is already connected to a workspace. Duplicate entries are not permitted.`);
    }

    // 1. Live Validation: Verify SMTP handshake before saving
    // Automated Host Injection for known providers
    if (dto.provider === InboxProvider.GOOGLE && (!dto.credentials.smtpHost || dto.credentials.smtpHost === '')) {
      dto.credentials.smtpHost = 'smtp.gmail.com';
      dto.credentials.smtpPort = 465;
      dto.credentials.imapHost = 'imap.gmail.com';
      dto.credentials.imapPort = 993;
    } else if (dto.provider === InboxProvider.OUTLOOK && (!dto.credentials.smtpHost || dto.credentials.smtpHost === '')) {
      dto.credentials.smtpHost = 'smtp.office365.com';
      dto.credentials.smtpPort = 587;
      dto.credentials.imapHost = 'outlook.office365.com';
      dto.credentials.imapPort = 993;
    }

    // Skip validation if we already have an accessToken (fulfilling from OAuth flow)
    const isValid = dto.credentials.accessToken
      ? true
      : await this.smtpAdapter.validateCredentials(dto.credentials);

    if (!isValid) {
      throw new BadRequestException(`Protocol Check Failed: Authentication rejected by ${dto.provider}. Verify App Password and Host configuration.`);
    }

    // 2. Automated Domain Mapping
    const domainName = dto.email.split('@')[1];
    let domain = await (this.prisma as any).domain.findFirst({
      where: { domainName, workspaceId }
    });

    if (!domain) {
      domain = await (this.prisma as any).domain.create({
        data: {
          workspaceId,
          domainName,
          isVerified: false,
          spfValid: false,
          dkimValid: false,
          dmarcValid: false
        }
      });
    }

    // 3. Encrypt Protocol Credentials (AES-256-GCM)
    const encryptedCreds = this.security.encrypt(JSON.stringify(dto.credentials));

    return (this.prisma as any).inbox.create({
      data: {
        workspaceId,
        domainId: domain.id,
        email: dto.email,
        fromName: dto.fromName || dto.email.split('@')[0],
        provider: dto.provider,
        credentials: encryptedCreds,
        status: 'active',
        dailyLimit: dto.provider === InboxProvider.GOOGLE ? 50 : 100,
        hourlyLimit: 15,
        minDelaySeconds: 60,
        maxDelaySeconds: 300
      }
    });
  }

  async findAll(workspaceId: string, page: number = 1, limit: number = 10, search?: string) {
    const skip = (page - 1) * limit;
    const where: any = { workspaceId };

    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { fromName: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [data, total] = await Promise.all([
      (this.prisma as any).inbox.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          fromName: true,
          provider: true,
          status: true,
          dailyLimit: true,
          hourlyLimit: true,
          warmupEnabled: true,
          minDelaySeconds: true,
          maxDelaySeconds: true,
          signature: true,
          createdAt: true,
          updatedAt: true,
          domain: true,
          warmupAccount: {
            select: {
              reputationScore: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      (this.prisma as any).inbox.count({ where })
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async findOne(workspaceId: string, id: string) {
    const inbox = await (this.prisma as any).inbox.findFirst({
      where: { id, workspaceId },
      include: { domain: true }
    });
    if (!inbox) throw new NotFoundException('Inbox node not found in current sector');
    return inbox;
  }

  async updateSettings(workspaceId: string, id: string, dto: UpdateInboxSettingsDto) {
    const inbox = await this.findOne(workspaceId, id);
    return (this.prisma as any).inbox.update({
      where: { id: inbox.id },
      data: { ...dto }
    });
  }

  async bulkUpdate(workspaceId: string, dto: any) {
    const { inboxIds, ...settings } = dto;

    // Validate all inboxes belong to the workspace
    const inboxes = await (this.prisma as any).inbox.findMany({
      where: {
        id: { in: inboxIds },
        workspaceId
      }
    });

    if (inboxes.length !== inboxIds.length) {
      throw new BadRequestException('Some inbox nodes were not found in current sector');
    }

    // Filter out undefined values from settings to avoid overwriting with nulls if that's not intended
    const updateData = Object.fromEntries(
      Object.entries(settings).filter(([_, v]) => v !== undefined && v !== '')
    );

    if (Object.keys(updateData).length === 0) {
      return { count: 0, message: 'No updates performed as all fields were empty.' };
    }

    return (this.prisma as any).inbox.updateMany({
      where: {
        id: { in: inboxIds },
        workspaceId
      },
      data: updateData
    });
  }

  async checkHealth(workspaceId: string, id: string) {
    const inbox = await this.findOne(workspaceId, id);
    const creds = await this.getDecryptedCredentials(id);
    const health = await this.smtpAdapter.healthCheck(creds);

    return (this.prisma as any).inbox.update({
      where: { id },
      data: { status: health.status }
    });
  }

  async remove(workspaceId: string, id: string) {
    const inbox = await this.findOne(workspaceId, id);
    return (this.prisma as any).inbox.delete({ where: { id: inbox.id } });
  }

  async getDecryptedCredentials(id: string) {
    const inbox = await (this.prisma as any).inbox.findUnique({ where: { id } });
    if (!inbox) throw new NotFoundException();
    const decrypted = this.security.decrypt(inbox.credentials);
    return JSON.parse(decrypted);
  }

  async sendTestEmail(workspaceId: string, id: string, to: string, subject: string, body: string) {
    const inbox = await this.findOne(workspaceId, id);
    const creds = await this.getDecryptedCredentials(id);

    await this.smtpAdapter.sendEmail(creds, {
      fromName: inbox.fromName,
      to,
      subject: `[TEST] ${subject}`,
      body,
      logId: `test-${Date.now()}`,
      leadId: 'test-lead'
    });
    return { success: true };
  }
}