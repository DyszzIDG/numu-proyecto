import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const [active, critical, high, total] = await Promise.all([
            prisma.incident.count({ where: { status: { not: 'Cerrado' } } }),
            prisma.incident.count({ where: { severity: 'Crítico', status: { not: 'Cerrado' } } }),
            prisma.incident.count({ where: { severity: 'Alto', status: { not: 'Cerrado' } } }),
            prisma.incident.count()
        ]);

        return NextResponse.json({
            active,
            critical,
            high,
            total
        });
    } catch (error) {
        console.error('Error fetching incident stats:', error);
        return NextResponse.json({ error: 'Failed to fetch incident stats' }, { status: 500 });
    }
}
