import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Find company by contact email (assuming 1-to-1 mapping for this MVP)
        // In a real app, we'd check Employee.companyId
        const company = await prisma.company.findFirst({
            where: {
                OR: [
                    { contactEmail: session.user.email },
                    // Add more lookup logic if needed
                ]
            },
            include: {
                assessments: {
                    orderBy: { startedAt: 'desc' },
                    take: 1
                }
            }
        });

        if (!company) {
            return NextResponse.json({ company: null });
        }

        const latestAssessment = company.assessments[0] || null;

        return NextResponse.json({
            company,
            assessment: latestAssessment
        });

    } catch (error) {
        console.error('Error fetching company data:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { name, industry, size, website } = body;

        // Create new company linked to this user
        const company = await prisma.company.create({
            data: {
                name,
                industry: industry || 'Technology',
                size: size ? String(size) : '1-10', // Force string format
                website: website || null,
                contactEmail: session.user.email,
                contactName: session.user.name || 'Admin', // Required by schema
                country: 'Panama', // Required by schema
            }
        });

        // Auto-create initial assessment
        const assessment = await prisma.assessment.create({
            data: {
                companyId: company.id,
                status: 'in_progress',
                type: 'initial_security_check',
                score: 0
            }
        });

        return NextResponse.json({ company, assessment });

    } catch (error: any) {
        console.error('Error creating company KEY_DEBUG:', error);
        // Return explicit error message for debugging
        return NextResponse.json(
            { error: 'Internal Server Error', details: error.message, meta: error.meta },
            { status: 500 }
        );
    }
}
