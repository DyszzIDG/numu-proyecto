import { PrismaClient, ForensicEvidence } from '@prisma/client';

const prisma = new PrismaClient();

export class ForensicsService {
    /**
     * Create new forensic evidence
     */
    static async createEvidence(data: any): Promise<ForensicEvidence> {
        return prisma.forensicEvidence.create({
            data: {
                description: data.description,
                type: data.type,
                status: 'acquired',
                acquiredBy: data.acquiredBy || 'System',
                custodian: data.custodian || 'Evidence Locker',
                location: data.location || 'Secure Storage',
                caseId: data.caseId || null,
                metadata: data.metadata ? JSON.stringify(data.metadata) : null
            }
        });
    }

    /**
     * List all evidence
     */
    static async findAll(filters: any = {}): Promise<ForensicEvidence[]> {
        return prisma.forensicEvidence.findMany({
            where: filters,
            orderBy: { createdAt: 'desc' },
            include: { case: true }
        });
    }

    /**
     * Update evidence status
     */
    static async updateStatus(id: string, status: string, custodian?: string): Promise<ForensicEvidence> {
        return prisma.forensicEvidence.update({
            where: { id },
            data: {
                status,
                custodian: custodian || undefined,
                updatedAt: new Date()
            }
        });
    }
}
