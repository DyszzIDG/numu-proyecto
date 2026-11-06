import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/portal/cases/[id]/comments - Add comment to case
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
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const commentData = await prisma.caseComment.create({
            data: {
                caseId,
                employeeId,
                comment
            },
            include: {
                employee: {
                    select: {
                        firstName: true,
                        lastName: true
                    }
                }
            }
        });

        return NextResponse.json({
            success: true,
            comment: commentData
        });
    } catch (error) {
        console.error('Error creating comment:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create comment' },
            { status: 500 }
        );
    }
}
