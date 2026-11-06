/**
 * AI Analysis API
 * Analyzes existing scan results with AI
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import { AIAgent } from '@/lib/ai/agent';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    try {
        // 1. Authenticate
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // 2. Parse request
        const { executionId } = await request.json();

        if (!executionId) {
            return NextResponse.json(
                { error: 'Missing executionId' },
                { status: 400 }
            );
        }

        // 3. Get execution record
        const execution = await prisma.toolExecution.findUnique({
            where: { id: executionId },
        });

        if (!execution) {
            return NextResponse.json(
                { error: 'Execution not found' },
                { status: 404 }
            );
        }

        // 4. Verify ownership
        if (execution.userId !== user.id && !user.isAdmin) {
            return NextResponse.json(
                { error: 'Unauthorized access to this execution' },
                { status: 403 }
            );
        }

        // 5. Check if already analyzed
        if (execution.aiAnalysis) {
            return NextResponse.json({
                success: true,
                cached: true,
                analysis: JSON.parse(execution.aiAnalysis),
            });
        }

        // 6. Perform AI analysis
        const analysis = await AIAgent.analyzeResults({
            tool: execution.toolName,
            target: execution.target,
            rawOutput: execution.rawOutput || '',
            jsonResult: execution.jsonResult ? JSON.parse(execution.jsonResult) : null,
        });

        // 7. Update execution with analysis
        await prisma.toolExecution.update({
            where: { id: executionId },
            data: {
                aiAnalysis: JSON.stringify(analysis),
            },
        });

        // 8. Create audit log
        await prisma.auditLog.create({
            data: {
                userId: user.id,
                action: 'ai.analyze',
                resource: `execution:${executionId}`,
                details: JSON.stringify({
                    tool: execution.toolName,
                    riskLevel: analysis.riskLevel,
                    vulnerabilityCount: analysis.vulnerabilities.length,
                }),
            },
        });

        return NextResponse.json({
            success: true,
            cached: false,
            analysis,
        });

    } catch (error: any) {
        console.error('AI analysis error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}

/**
 * GET - Retrieve AI analysis for an execution
 */
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const { searchParams } = new URL(request.url);
        const executionId = searchParams.get('executionId');

        if (!executionId) {
            return NextResponse.json(
                { error: 'Missing executionId parameter' },
                { status: 400 }
            );
        }

        const execution = await prisma.toolExecution.findUnique({
            where: { id: executionId },
            select: {
                id: true,
                toolName: true,
                target: true,
                aiAnalysis: true,
                userId: true,
            },
        });

        if (!execution) {
            return NextResponse.json(
                { error: 'Execution not found' },
                { status: 404 }
            );
        }

        if (execution.userId !== user.id && !user.isAdmin) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 403 }
            );
        }

        if (!execution.aiAnalysis) {
            return NextResponse.json(
                { error: 'No AI analysis available for this execution' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            analysis: JSON.parse(execution.aiAnalysis),
        });

    } catch (error: any) {
        console.error('Error fetching AI analysis:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
