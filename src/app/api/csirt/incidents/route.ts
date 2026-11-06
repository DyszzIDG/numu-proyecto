import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '10');
        // const status = searchParams.get('status');

        const incidents = await prisma.incident.findMany({
            orderBy: { detectedAt: 'desc' },
            take: limit,
            include: {
                analyst: {
                    select: { firstName: true, lastName: true }
                }
            }
        });

        const formattedIncidents = incidents.map(inc => ({
            ...inc,
            analyst: inc.analyst ? { name: `${inc.analyst.firstName} ${inc.analyst.lastName}` } : null
        }));

        return NextResponse.json(formattedIncidents);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch incidents' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const incident = await prisma.incident.create({
            data: {
                type: body.type,
                severity: body.severity,
                status: 'En Análisis',
                detectedAt: new Date(),
                description: body.description,
                origin: body.origin || 'Unknown',
            }
        });
        return NextResponse.json(incident);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create incident' }, { status: 500 });
    }
}
