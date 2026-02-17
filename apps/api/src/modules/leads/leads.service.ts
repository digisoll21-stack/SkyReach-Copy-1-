import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LeadStatus } from '@shared/types';
import { CreateLeadDto, ImportLeadsDto } from './dto/lead.dto';
import { parse } from 'csv-parse';

@Injectable()
export class LeadsService {
  constructor(private readonly prisma: PrismaService) { }

  async findAll(workspaceId: string, filters: { status?: string; search?: string }) {
    const where: any = { workspaceId };
    if (filters.status) where.status = filters.status;
    if (filters.search) {
      where.OR = [
        { email: { contains: filters.search, mode: 'insensitive' } },
        { firstName: { contains: filters.search, mode: 'insensitive' } },
        { company: { contains: filters.search, mode: 'insensitive' } },
      ];
    }
    return (this.prisma as any).lead.findMany({ where, orderBy: { createdAt: 'desc' } });
  }

  async create(workspaceId: string, dto: CreateLeadDto) {
    return (this.prisma as any).lead.create({
      data: {
        workspaceId,
        email: dto.email,
        firstName: dto.firstName,
        lastName: dto.lastName,
        company: dto.company,
        status: LeadStatus.UNASSIGNED,
        tags: dto.tags || [],
        customFields: dto.customFields || {},
      }
    });
  }

  async importLeads(workspaceId: string, dto: ImportLeadsDto) {
    // Lead Mapping Logic: Maps custom CSV columns to Lead entity
    const leadsToCreate = dto.leads.map(leadData => ({
      workspaceId,
      campaignId: dto.campaignId || null,
      email: leadData.email,
      firstName: leadData.firstName || null,
      lastName: leadData.lastName || null,
      company: leadData.company || null,
      status: LeadStatus.UNASSIGNED,
      tags: dto.tags || [],
      customFields: leadData.customFields || {},
    }));

    const result = await (this.prisma as any).lead.createMany({
      data: leadsToCreate,
      skipDuplicates: true,
    });

    return { success: true, count: result.count };
  }

  async parseCsvWithMapping(csvContent: string, mapping: Record<string, string>): Promise<Partial<CreateLeadDto>[]> {
    return new Promise((resolve, reject) => {
      parse(csvContent, { columns: true, skip_empty_lines: true, trim: true }, (err, records) => {
        if (err) return reject(new BadRequestException('Invalid CSV format'));

        const mapped = records.map((r: any) => {
          const lead: any = { customFields: {} };

          // Apply User Mapping
          Object.entries(mapping).forEach(([csvHeader, systemField]) => {
            if (['email', 'firstName', 'lastName', 'company'].includes(systemField)) {
              lead[systemField] = r[csvHeader];
            } else {
              lead.customFields[systemField] = r[csvHeader];
            }
          });

          // Fallback if mapping missing but common headers exist
          lead.email = lead.email || r.email || r.Email || r['Email Address'];

          return lead;
        }).filter((r: any) => !!r.email);

        resolve(mapped);
      });
    });
  }

  async findOne(workspaceId: string, id: string) {
    const lead = await (this.prisma as any).lead.findFirst({ where: { id, workspaceId } });
    if (!lead) throw new NotFoundException('Lead not found');
    return lead;
  }

  // FIX: Added missing getTimeline method to retrieve combined history of outbound sends and inbound replies for a lead
  async getTimeline(workspaceId: string, id: string) {
    await this.findOne(workspaceId, id);

    const [sendingLogs, replyLogs] = await Promise.all([
      (this.prisma as any).sendingLog.findMany({
        where: { leadId: id, workspaceId },
        orderBy: { createdAt: 'desc' },
      }),
      (this.prisma as any).replyLog.findMany({
        where: { leadId: id, workspaceId },
        orderBy: { receivedAt: 'desc' },
      }),
    ]);

    const events = [
      ...sendingLogs.map((log: any) => ({
        id: log.id,
        type: 'outbound',
        status: log.status,
        createdAt: log.sentAt || log.createdAt,
        metadata: { campaignId: log.campaignId, stepId: log.stepId },
      })),
      ...replyLogs.map((log: any) => ({
        id: log.id,
        type: 'inbound',
        status: 'replied',
        createdAt: log.receivedAt,
        metadata: { classification: log.classification, subject: log.subject },
      })),
    ];

    return events.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async updateStatus(workspaceId: string, id: string, status: LeadStatus) {
    return (this.prisma as any).lead.update({
      where: { id },
      data: { status, lastEventAt: new Date() }
    });
  }

  async bulkUpdateStatus(workspaceId: string, ids: string[], status: LeadStatus) {
    return (this.prisma as any).lead.updateMany({
      where: { id: { in: ids }, workspaceId },
      data: { status, lastEventAt: new Date() }
    });
  }

  async remove(workspaceId: string, id: string) {
    return (this.prisma as any).lead.delete({ where: { id, workspaceId } });
  }

  async bulkRemove(workspaceId: string, ids: string[]) {
    return (this.prisma as any).lead.deleteMany({
      where: { id: { in: ids }, workspaceId }
    });
  }
}