import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
        // Get all scan targets with scan count
        const targets = await prisma.scanTarget.findMany({
            include: {
                _count: {
                    select: { scans: true }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json({
            success: true,
            targets
        });

    } catch (error: any) {
        console.error('Error fetching scan targets:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch scan targets' },
            { status: 500 }
        );
    }
}
