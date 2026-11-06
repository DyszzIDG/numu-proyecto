import { PrismaClient, Case } from '@prisma/client';

const prisma = new PrismaClient();

export class IncidentService {
    /**
     * Get all incidents with optional filtering
     */
    static async findAll(filters: any = {}) {
        const { status, priority, type, limit = 50 } = filters;

        const where: any = {};
        if (status) where.status = status;
        if (priority) where.priority = priority;
        if (type) where.type = type;

        return prisma.case.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: Number(limit),
            include: {
                scanResult: {
                    select: {
                        target: true
                    }
                }
            }
        });
    }

    /**
     * Get incident statistics
     */
    static async getStats() {
        const [total, active, critical, high] = await Promise.all([
            prisma.case.count(),
            prisma.case.count({ where: { status: { in: ['open', 'in_progress'] } } }),
            prisma.case.count({ where: { priority: 'critical', status: { in: ['open', 'in_progress'] } } }),
            prisma.case.count({ where: { priority: 'high', status: { in: ['open', 'in_progress'] } } })
        ]);

        return {
            total,
            active,
            critical,
            high
        };
    }

    /**
     * Create a new incident
     */
    static async create(data: {
        title: string;
        description: string;
        priority: string;
        type: string;
        scanResultId?: string;
    }) {
        return prisma.case.create({
            data: {
                ...data,
                status: 'open'
            }
        });
    }

    /**
     * Update an incident
     */
    static async update(id: string, data: Partial<Case>) {
        return prisma.case.update({
            where: { id },
            data
        });
    }
}
