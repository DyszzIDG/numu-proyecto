import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST /api/assessments - Start new assessment
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { companyId } = body;

        if (!companyId) {
            return NextResponse.json(
                { success: false, error: 'Company ID is required' },
                { status: 400 }
            );
        }

        // Verify company exists
        const company = await prisma.company.findUnique({
            where: { id: companyId }
        });

        if (!company) {
            return NextResponse.json(
                { success: false, error: 'Company not found' },
                { status: 404 }
            );
        }

        // Create assessment
        const assessment = await prisma.assessment.create({
            data: {
                companyId,
                status: 'in_progress'
            },
            include: {
                company: true
            }
        });

        return NextResponse.json({
            success: true,
            assessment,
            message: 'Assessment started successfully'
        }, { status: 201 });

    } catch (error: any) {
        console.error('Error creating assessment:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error', details: error.message },
            { status: 500 }
        );
    }
}

// GET /api/assessments - List assessments
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const companyId = searchParams.get('companyId');
        const status = searchParams.get('status');

        const where: any = {};
        if (companyId) where.companyId = companyId;
        if (status) where.status = status;

        const assessments = await prisma.assessment.findMany({
            where,
            include: {
                company: true,
                answers: {
                    include: {
                        question: {
                            include: {
                                category: true
                            }
                        }
                    }
                }
            },
            orderBy: { startedAt: 'desc' }
        });

        return NextResponse.json({
            success: true,
            data: assessments,
            count: assessments.length
        });

    } catch (error: any) {
        console.error('Error fetching assessments:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error', details: error.message },
            { status: 500 }
        );
    }
}
