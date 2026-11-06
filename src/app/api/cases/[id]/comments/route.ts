import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST /api/cases/[id]/comments
export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const caseId = params.id;
        const body = await request.json();
        const { employeeId, comment } = body;

        if (!employeeId || !comment) {
            return NextResponse.json(
                { success: false, error: 'Employee ID and comment are required' },
                { status: 400 }
            );
        }

        const newComment = await prisma.caseComment.create({
            data: {
                caseId,
                employeeId,
                comment,
                createdAt: new Date()
            },
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
        });

        return NextResponse.json({
            success: true,
            comment: newComment,
            message: 'Comment added successfully'
        });

    } catch (error: any) {
        console.error('Error adding comment:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error', details: error.message },
            { status: 500 }
        );
    }
}
