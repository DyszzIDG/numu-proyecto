import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
    try {
        const recentScans = await prisma.scanResult.findMany({
            take: 10,
            orderBy: { completedAt: 'desc' },
            include: {
                target: true,
                findings: {
                    where: {
                        severity: { in: ['critical', 'high'] }
                    }
                }
            }
        });

        return NextResponse.json({ scans: recentScans });
    } catch (error) {
        console.error("Error fetching scans:", error);
        return NextResponse.json({ message: "Error fetching scans" }, { status: 500 });
    }
}
