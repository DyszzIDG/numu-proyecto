import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/csirt/scans/:id - Get detailed scan result
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;

        const scan = await prisma.scanResult.findUnique({
            where: { id },
            include: {
                target: true,
                findings: {
                    orderBy: {
                        severity: 'desc',
                    },
                },
            },
        });

        if (!scan) {
            return NextResponse.json(
                { error: 'Scan not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: scan,
        });

    } catch (error: any) {
        console.error('Error fetching scan:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: error.message },
            { status: 500 }
        );
    }
}
