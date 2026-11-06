import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const totalIncidents = await prisma.incident.count({
            where: { status: { not: 'Cerrado' } }
        });

        // Calculate risk level based on active critical incidents
        const criticalIncidents = await prisma.incident.count({
            where: { severity: 'Crítico', status: { not: 'Cerrado' } }
        });

        let riskLevel = 'Bajo';
        if (criticalIncidents > 0) riskLevel = 'Crítico';
        else if (totalIncidents > 10) riskLevel = 'Alto';
        else if (totalIncidents > 5) riskLevel = 'Medio';

        // Mock calculations for MTTR/MTTI (replace with real logic later)
        const mttr = { value: '45m', trend: '-5m' };
        const mtti = { value: '12m', trend: '-2m' };

        // Group by Severity
        const severityCounts = {
            Crítico: await prisma.incident.count({ where: { severity: 'Crítico' } }),
            Alto: await prisma.incident.count({ where: { severity: 'Alto' } }),
            Medio: await prisma.incident.count({ where: { severity: 'Medio' } }),
            Bajo: await prisma.incident.count({ where: { severity: 'Bajo' } }),
        };

        // Group by Type (Top 5)
        // Prisma grouping: groupBy is supported
        const typeDistribution = await prisma.incident.groupBy({
            by: ['type'],
            _count: { type: true },
            orderBy: { _count: { type: 'desc' } },
            take: 5
        });

        // Group by Origin
        const originDistribution = await prisma.incident.groupBy({
            by: ['origin'],
            _count: { origin: true },
            orderBy: { _count: { origin: 'desc' } },
            take: 5
        });

        return NextResponse.json({
            metrics: {
                activeIncidents: { count: totalIncidents, trend: '+3' },
                riskLevel: { level: riskLevel, score: '85/100' },
                mttr,
                mtti
            },
            charts: {
                severity: severityCounts,
                types: typeDistribution.map(t => ({ name: t.type, value: t._count.type })),
                origins: originDistribution.map(o => ({ country: o.origin || 'Unknown', count: o._count.origin }))
            }
        });
    } catch (error) {
        console.error('Error fetching dashboard metrics:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
