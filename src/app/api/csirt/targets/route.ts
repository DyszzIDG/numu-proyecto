import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/csirt/targets - List all scan targets
export async function GET(request: NextRequest) {
    try {
        const targets = await prisma.scanTarget.findMany({
            orderBy: {
                updatedAt: 'desc',
            },
            include: {
                scans: {
                    select: {
                        id: true,
                        scanType: true,
                        status: true,
                        startedAt: true,
                    },
                    orderBy: {
                        startedAt: 'desc',
                    },
                    take: 5, // Last 5 scans per target
                },
            },
        });

        return NextResponse.json({
            success: true,
            data: targets,
        });

    } catch (error: any) {
        console.error('Error fetching targets:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: error.message },
            { status: 500 }
        );
    }
}

// POST /api/csirt/targets - Create new target manually
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { target, type, description } = body;

        if (!target || !type) {
            return NextResponse.json(
                { error: 'Missing required fields: target, type' },
                { status: 400 }
            );
        }

        const newTarget = await prisma.scanTarget.create({
            data: {
                target,
                type,
                description,
            },
        });

        return NextResponse.json({
            success: true,
            data: newTarget,
        }, { status: 201 });

    } catch (error: any) {
        console.error('Error creating target:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: error.message },
            { status: 500 }
        );
    }
}
