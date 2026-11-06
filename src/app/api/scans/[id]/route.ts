
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const scan = await prisma.scanResult.findUnique({
            where: { id: params.id },
            include: {
                target: true,
                findings: true,
                cases: true
            }
        });

        if (!scan) {
            return NextResponse.json({ error: 'Scan not found' }, { status: 404 });
        }

        return NextResponse.json(scan);

    } catch (error) {
        console.error('Error fetching scan details:', error);
        return NextResponse.json({ error: 'Failed to fetch scan details' }, { status: 500 });
    }
}
