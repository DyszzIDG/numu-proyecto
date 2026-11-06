import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/portal/cases - Get cases for current employee
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const employeeId = searchParams.get('employeeId');
        const status = searchParams.get('status');

        if (!employeeId) {
            return NextResponse.json(
                { success: false, error: 'Employee ID required' },
                { status: 400 }
            );
        }

        const where: any = {
            assignments: {
                some: {
                    employeeId
                }
            }
        };

        if (status && status !== 'all') {
            where.status = status;
        }

        const cases = await prisma.case.findMany({
            where,
            include: {
                company: {
                    select: {
                        name: true,
                        industry: true
                    }
                },
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
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json({
            success: true,
            cases
        });
    } catch (error) {
        console.error('Error fetching cases:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch cases' },
            { status: 500 }
        );
    }
}

// POST /api/portal/cases - Create new case
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { companyId, title, description, priority, type, assignedTo } = body;

        if (!companyId || !title || !description) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const newCase = await prisma.case.create({
            data: {
                companyId,
                title,
                description,
                priority: priority || 'medium',
                type: type || 'general',
                status: 'open',
                assignments: assignedTo ? {
                    create: assignedTo.map((empId: string) => ({
                        employeeId: empId,
                        assignedAt: new Date()
                    }))
                } : undefined
            },
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
            case: newCase
        });
    } catch (error) {
        console.error('Error creating case:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create case' },
            { status: 500 }
        );
    }
}
