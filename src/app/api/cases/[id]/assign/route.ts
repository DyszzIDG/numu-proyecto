import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST /api/cases/[id]/assign
export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const caseId = params.id;
        const body = await request.json();
        const { employeeId } = body;

        if (!employeeId) {
            return NextResponse.json(
                { success: false, error: 'Employee ID is required' },
                { status: 400 }
            );
        }

        // 1. Deactivate current active assignments (optional, if we want only one active assignee)
        // For now, let's keep multiple assignments possible or just mark them as inactive?
        // Let's assume re-assignment marks previous one as inactive for "Owner" logic, 
        // but "Collaborators" might be different. For simplicity, let's just add a new active assignment.

        // Check if already assigned
        const existingAssignment = await prisma.caseAssignment.findFirst({
            where: {
                caseId,
                employeeId,
                isActive: true
            }
        });

        if (existingAssignment) {
            return NextResponse.json({
                success: true,
                message: 'Employee already assigned to this case'
            });
        }

        // 2. Create new assignment
        const assignment = await prisma.caseAssignment.create({
            data: {
                caseId,
                employeeId,
                isActive: true
            },
            include: {
                employee: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true
                    }
                }
            }
        });

        // 3. Update case status if it was "open" to "in_progress" (optional automation)
        const currentCase = await prisma.case.findUnique({ where: { id: caseId } });
        if (currentCase?.status === 'open') {
            await prisma.case.update({
                where: { id: caseId },
                data: { status: 'in_progress' }
            });
        }

        return NextResponse.json({
            success: true,
            assignment,
            message: 'Case assigned successfully'
        });

    } catch (error: any) {
        console.error('Error assigning case:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error', details: error.message },
            { status: 500 }
        );
    }
}
