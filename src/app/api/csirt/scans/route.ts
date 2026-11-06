import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Validate CSIRT API Key
function validateApiKey(request: NextRequest): boolean {
  const apiKey = request.headers.get('X-CSIRT-API-KEY');
  const validKey = process.env.CSIRT_API_KEY || 'csirt-dev-key-2024';
  return apiKey === validKey;
}

// POST /api/csirt/scans - Submit new scan result
export async function POST(request: NextRequest) {
  try {
    // Validate API key
    if (!validateApiKey(request)) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid API Key' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { target, targetType, scanType, status, startedAt, completedAt, duration, metadata, findings } = body;

    // Validate required fields
    if (!target || !scanType || !status || !startedAt) {
      return NextResponse.json(
        { error: 'Missing required fields: target, scanType, status, startedAt' },
        { status: 400 }
      );
    }

    // Create or get target
    let scanTarget = await prisma.scanTarget.findUnique({
      where: { target },
    });

    if (!scanTarget) {
      scanTarget = await prisma.scanTarget.create({
        data: {
          target,
          type: targetType || 'domain',
        },
      });
    }

    // Create scan result
    const scanResult = await prisma.scanResult.create({
      data: {
        targetId: scanTarget.id,
        scanType,
        status,
        startedAt: new Date(startedAt),
        completedAt: completedAt ? new Date(completedAt) : null,
        duration,
        metadata: metadata ? JSON.stringify(metadata) : null,
        findings: {
          create: findings?.map((finding: any) => ({
            category: finding.category,
            severity: finding.severity || 'info',
            title: finding.title,
            description: finding.description,
            rawData: finding.rawData,
          })) || [],
        },
      },
      include: {
        findings: true,
        target: true,
      },
    });

    return NextResponse.json({
      success: true,
      scanId: scanResult.id,
      message: 'Scan result saved successfully',
      data: scanResult,
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error saving scan result:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// GET /api/csirt/scans - List all scans with pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const scanType = searchParams.get('scanType');
    const targetFilter = searchParams.get('target');
    const status = searchParams.get('status');

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    if (scanType) where.scanType = scanType;
    if (status) where.status = status;
    if (targetFilter) {
      where.target = {
        target: {
          contains: targetFilter,
        },
      };
    }

    // Get total count
    const total = await prisma.scanResult.count({ where });

    // Get scans
    const scans = await prisma.scanResult.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        startedAt: 'desc',
      },
      include: {
        target: true,
        findings: {
          select: {
            id: true,
            severity: true,
            category: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: scans,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });

  } catch (error: any) {
    console.error('Error fetching scans:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
