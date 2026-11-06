import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
        // Get all scan findings that are vulnerabilities or high/critical severity
        const findings = await prisma.scanFinding.findMany({
            where: {
                OR: [
                    { category: 'vulnerability' },
                    { severity: 'critical' },
                    { severity: 'high' }
                ]
            },
            include: {
                scan: {
                    include: {
                        target: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Transform findings into vulnerability format
        const vulnerabilities = findings.map((finding) => ({
            id: finding.id,
            title: finding.title,
            description: finding.description,
            severity: finding.severity.toUpperCase(),
            category: finding.category,
            target: finding.scan.target.target,
            scanType: finding.scan.scanType,
            scanId: finding.scan.id,
            detectedAt: finding.createdAt,
            rawData: finding.rawData
        }));

        return NextResponse.json({
            success: true,
            vulnerabilities
        });

    } catch (error: any) {
        console.error('Error fetching vulnerabilities:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch vulnerabilities' },
            { status: 500 }
        );
    }
}
