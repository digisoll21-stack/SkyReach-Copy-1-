
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DomainsService {
  private readonly logger = new Logger(DomainsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findAll(workspaceId: string) {
    return (this.prisma as any).domain.findMany({
      where: { workspaceId },
      include: { 
        inboxes: {
          select: { id: true, email: true, status: true }
        }
      }
    });
  }

  async verifyDNS(workspaceId: string, domainId: string) {
    const domain = await (this.prisma as any).domain.findFirst({
      where: { id: domainId, workspaceId }
    });

    if (!domain) throw new NotFoundException('Domain not found');

    this.logger.log(`Verifying DNS for ${domain.domainName}`);

    // Simulation of DNS check logic
    // In production, use 'dns' module to check TXT records for SPF/DKIM/DMARC
    const mockCheck = {
      spfValid: true,
      dkimValid: Math.random() > 0.1,
      dmarcValid: Math.random() > 0.2,
      lastVerifiedAt: new Date(),
    };

    return (this.prisma as any).domain.update({
      where: { id: domainId },
      data: { 
        ...mockCheck,
        isVerified: mockCheck.spfValid && mockCheck.dkimValid
      }
    });
  }

  async create(workspaceId: string, domainName: string) {
    return (this.prisma as any).domain.create({
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
}
