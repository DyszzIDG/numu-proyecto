import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST /api/cases - Create new case
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            title,
            description,
            priority,
            type,
            companyId,
            assessmentId,
            scanResultId,
            departmentId,
            assignToEmployeeId
        } = body;

        // Validation
        if (!title || !description || !priority || !type) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Create case
        const caseData: any = {
            title,
            description,
            priority,
            status: 'open',
            type,
            companyId: companyId || null,
            assessmentId: assessmentId || null,
            scanResultId: scanResultId || null,
            departmentId: departmentId || null
        };

        const newCase = await prisma.case.create({
            data: caseData,
            include: {
                company: true,
                assessment: true,
                department: true
            }
        });

        // If assignToEmployeeId is provided, create assignment
        if (assignToEmployeeId) {
            await prisma.caseAssignment.create({
                data: {
                    caseId: newCase.id,
                    employeeId: assignToEmployeeId,
                    isActive: true
                }
            });
        }

        return NextResponse.json({
            success: true,
            case: newCase,
            message: 'Case created successfully'
        }, { status: 201 });

    } catch (error: any) {
        console.error('Error creating case:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error', details: error.message },
            { status: 500 }
        );
    }
}

// GET /api/cases - List cases
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const priority = searchParams.get('priority');
        const departmentId = searchParams.get('departmentId');
        const employeeId = searchParams.get('employeeId');

        const where: any = {};
        if (status) where.status = status;
        if (priority) where.priority = priority;
        if (departmentId) where.departmentId = departmentId;

        let cases;

        if (employeeId) {
            // Get cases assigned to specific employee
            cases = await prisma.case.findMany({
                where: {
                    ...where,
                    assignments: {
                        some: {
                            employeeId,
                            isActive: true
                        }
                    }
                },
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
                        orderBy: { createdAt: 'desc' },
                        take: 5
                    }
                },
                orderBy: { createdAt: 'desc' }
            });
        } else {
            // Get all cases
            cases = await prisma.case.findMany({
                where,
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
                        orderBy: { createdAt: 'desc' },
                        take: 5
                    }
                },
                orderBy: { createdAt: 'desc' }
            });
        }

        return NextResponse.json({
            success: true,
            data: cases,
            count: cases.length
        });

    } catch (error: any) {
        console.error('Error fetching cases:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error', details: error.message },
            { status: 500 }
        );
    }
}
