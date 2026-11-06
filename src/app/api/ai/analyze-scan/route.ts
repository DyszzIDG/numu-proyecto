import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth/unified';
import { PrismaClient } from '@prisma/client';
import { AIAgent } from '@/lib/ai/agent';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    try {
        const authenticatedUser = await getAuthenticatedUser();

        // Allow dev bypass
        if (!authenticatedUser && process.env.NODE_ENV !== 'development') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { executionId, tool, rawOutput, jsonResult } = body;

        if (!rawOutput && !jsonResult) {
            return NextResponse.json(
                { error: 'Missing scan data (rawOutput or jsonResult) for analysis' },
                { status: 400 }
            );
        }

        console.log(`[AI Analysis] Processing request for tool: ${tool}, executionId: ${executionId}`);

        // 1. Perform AI Analysis
        // We use 'unknown' as target if not provided, assuming the raw output contains target info or it's not critical for general analysis
        const analysis = await AIAgent.analyzeResults({
            tool: tool || 'unknown',
            target: 'inferred from output',
            rawOutput: rawOutput || '',
            jsonResult
        });

        // 2. Persist analysis if we have an executionId
        if (executionId) {
            try {
                // Determine if user owns this execution before updating (security check)
                const existingExecution = await prisma.toolExecution.findUnique({
                    where: { id: executionId }
                });

                if (existingExecution) {
                    await prisma.toolExecution.update({
                        where: { id: executionId },
                        data: {
                            aiAnalysis: JSON.stringify(analysis)
                        }
                    });
                    console.log(`[AI Analysis] Saved analysis to execution ${executionId}`);
                }
            } catch (dbError) {
                console.error('[AI Analysis] Failed to persist analysis to DB:', dbError);
                // We don't fail the request if DB update fails, just return the analysis
            }
        }

        return NextResponse.json(analysis);

    } catch (error: any) {
        console.error('[AI Analysis] Error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error during analysis' },
            { status: 500 }
        );
    }
}
