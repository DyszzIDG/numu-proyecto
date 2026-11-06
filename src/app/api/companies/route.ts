import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST /api/companies - Register new company
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            name,
            industry,
            size,
            country,
            contactEmail,
            contactName,
            contactPhone,
            website
        } = body;

        // Validation
        if (!name || !industry || !size || !country || !contactEmail || !contactName) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Check if company already exists
        const existing = await prisma.company.findUnique({
            where: { contactEmail }
        });

        if (existing) {
            return NextResponse.json(
                { success: false, error: 'Company with this email already registered' },
                { status: 409 }
            );
        }

        // Create company
        const company = await prisma.company.create({
            data: {
                name,
                industry,
                size,
                country,
                contactEmail,
                contactName,
                contactPhone,
                website
            }
        });

        return NextResponse.json({
            success: true,
            company,
            message: 'Company registered successfully'
        }, { status: 201 });

    } catch (error: any) {
        console.error('Error creating company:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error', details: error.message },
            { status: 500 }
        );
    }
}

// GET /api/companies - List all companies (admin)
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const industry = searchParams.get('industry');
        const size = searchParams.get('size');

        const where: any = {};
        if (industry) where.industry = industry;
        if (size) where.size = size;

        const companies = await prisma.company.findMany({
            where,
            include: {
                assessments: {
                    select: {
                        id: true,
                        status: true,
                        score: true,
                        maturityLevel: true,
                        completedAt: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({
            success: true,
            data: companies,
            count: companies.length
        });

    } catch (error: any) {
        console.error('Error fetching companies:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error', details: error.message },
            { status: 500 }
        );
    }
}
