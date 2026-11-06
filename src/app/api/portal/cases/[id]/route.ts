import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/portal/cases/[id] - Get specific case
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const caseId = params.id;

        const caseData = await prisma.case.findUnique({
            where: { id: caseId },
            include: {
                company: true,
                assignments: {
                    include: {
                        employee: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                email: true,
                                department: true
                            }
                        }
                    }
                },
                comments: {
                    include: {
                        employee: {
                            select: {
                                firstName: true,
                                lastName: true
                            }
                        }
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                },
                attachments: {
                    orderBy: {
                        uploadedAt: 'desc'
                    }
                }
            }
        });

        if (!caseData) {
            return NextResponse.json(
                { success: false, error: 'Case not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            case: caseData
        });
    } catch (error) {
        console.error('Error fetching case:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch case' },
            { status: 500 }
        );
    }
}

// PUT /api/portal/cases/[id] - Update case
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const caseId = params.id;
        const body = await request.json();
        const { status, priority, resolution } = body;

        const updateData: any = {};
        if (status) updateData.status = status;
        if (priority) updateData.priority = priority;
        if (resolution) updateData.resolution = resolution;
        if (status === 'resolved' || status === 'closed') {
            updateData.resolvedAt = new Date();
        }

        const updatedCase = await prisma.case.update({
            where: { id: caseId },
            data: updateData,
            include: {
                company: true,
                assignments: {
                    include: {
                        employee: {
                            select: {
                                firstName: true,
                                lastName: true,
                                email: true
                            }
                        }
                    }
                }
            }
        });

        return NextResponse.json({
            success: true,
            case: updatedCase
        });
    } catch (error) {
        console.error('Error updating case:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update case' },
            { status: 500 }
        );
    }
}

// DELETE /api/portal/cases/[id] - Delete case
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const caseId = params.id;

        // Delete related records first
        await prisma.caseComment.deleteMany({
            where: { caseId }
        });

        await prisma.caseAssignment.deleteMany({
            where: { caseId }
        });

        await prisma.case.delete({
            where: { id: caseId }
        });

        return NextResponse.json({
            success: true,
            message: 'Case deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting case:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to delete case' },
            { status: 500 }
        );
    }
}
