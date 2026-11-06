import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/cases/[id]
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const id = params.id;

        const caseItem = await prisma.case.findUnique({
            where: { id },
            include: {
                company: true,
                assessment: true,
                department: true,
                assignments: {
                    where: { isActive: true },
                    include: {
                        employee: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                email: true,
                                role: true
                            }
                        }
                    }
                },
                comments: {
                    orderBy: { createdAt: 'asc' },
                    include: {
                        employee: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                role: true
                            }
                        }
                    }
                },
                scanResult: {
                    include: {
                        target: true
                    }
                }
            }
        });

        if (!caseItem) {
            return NextResponse.json(
                { success: false, error: 'Case not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: caseItem
        });

    } catch (error: any) {
        console.error('Error fetching case:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error', details: error.message },
            { status: 500 }
        );
    }
}

// PATCH /api/cases/[id] - Update status, priority, etc.
export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const id = params.id;
        const body = await request.json();
        const { status, priority, title, description } = body;

        const data: any = {};
        if (status) {
            data.status = status;
            if (status === 'resolved' || status === 'closed') {
                data.resolvedAt = new Date();
            }
        }
        if (priority) data.priority = priority;
        if (title) data.title = title;
        if (description) data.description = description;

        const updatedCase = await prisma.case.update({
            where: { id },
            data
        });

        return NextResponse.json({
            success: true,
            data: updatedCase,
            message: 'Case updated successfully'
        });

    } catch (error: any) {
        console.error('Error updating case:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error', details: error.message },
            { status: 500 }
        );
    }
}
