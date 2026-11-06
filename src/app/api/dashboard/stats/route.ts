import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
        // Get scan statistics
        const totalScans = await prisma.scanResult.count();

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const scansToday = await prisma.scanResult.count({
            where: {
                createdAt: {
                    gte: today
                }
            }
        });

        const last7Days = new Date();
        last7Days.setDate(last7Days.getDate() - 7);

        const scansLast7Days = await prisma.scanResult.count({
            where: {
                createdAt: {
                    gte: last7Days
                }
            }
        });

        // Get findings statistics
        const allFindings = await prisma.scanFinding.findMany({
            select: {
                severity: true,
                category: true
            }
        });

        const findingsBySeverity = {
            critical: allFindings.filter(f => f.severity === 'critical').length,
            high: allFindings.filter(f => f.severity === 'high').length,
            medium: allFindings.filter(f => f.severity === 'medium').length,
            low: allFindings.filter(f => f.severity === 'low').length,
            info: allFindings.filter(f => f.severity === 'info').length,
        };

        const findingsByCategory = allFindings.reduce((acc: Record<string, number>, finding) => {
            acc[finding.category] = (acc[finding.category] || 0) + 1;
            return acc;
        }, {});

        // Get recent scans
        const recentScans = await prisma.scanResult.findMany({
            take: 5,
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                target: true,
                _count: {
                    select: {
                        findings: true
                    }
                }
            }
        });

        // Get targets count
        const targetsCount = await prisma.scanTarget.count();

        return NextResponse.json({
            success: true,
            data: {
                scans: {
                    total: totalScans,
                    today: scansToday,
                    last7Days: scansLast7Days
                },
                findings: {
                    total: allFindings.length,
                    bySeverity: findingsBySeverity,
                    byCategory: findingsByCategory
                },
                targets: {
                    total: targetsCount
                },
                recentScans: recentScans.map(scan => ({
                    id: scan.id,
                    target: scan.target.target,
                    scanType: scan.scanType,
                    status: scan.status,
                    findingsCount: scan._count.findings,
                    createdAt: scan.createdAt,
                    duration: scan.duration
                }))
            }
        });

    } catch (error: any) {
        console.error('Error fetching dashboard stats:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch statistics' },
            { status: 500 }
        );
    }
}
