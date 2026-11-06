import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth/unified';
import { PrismaClient } from '@prisma/client';
import { DockerRunner } from '@/lib/docker/DockerRunner';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();
const AI_AGENT_URL = process.env.AI_AGENT_URL || 'http://localhost:8000';

export async function POST(req: NextRequest) {
    try {
        const { tool, userPrompt, target } = await req.json();

        if (!tool || !userPrompt) {
            return NextResponse.json(
                { error: 'Tool and prompt are required' },
                { status: 400 }
            );
        }

        console.log(`🤖 AI Scan requested: ${tool} - "${userPrompt}"`);

        const user = await getAuthenticatedUser();
        const executionId = uuidv4();

        // Step 1: Call Python AI service to analyze prompt
        let aiConfig;
        try {
            const analyzeResponse = await fetch(`${AI_AGENT_URL}/analyze`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: userPrompt,
                    tool: tool,
                    target: target || null
                })
            });

            if (!analyzeResponse.ok) {
                const error = await analyzeResponse.json();
                throw new Error(error.detail || 'AI analysis failed');
            }

            aiConfig = await analyzeResponse.json();
            console.log('✅ AI Config:', aiConfig);

        } catch (error: any) {
            console.error('❌ AI Service Error:', error);
            return NextResponse.json(
                { error: `AI service unavailable: ${error.message}` },
                { status: 503 }
            );
        }

        // Step 2: Create execution record
        await prisma.toolExecution.create({
            data: {
                id: executionId,
                toolName: tool,
                target: aiConfig.target,
                status: 'running',
                parameters: JSON.stringify({
                    userPrompt,
                    aiConfig: aiConfig.parameters,
                    customParams: aiConfig.customParams
                }),
                command: aiConfig.command,
                userId: user?.id,
                startedAt: new Date(),
            }
        });

        // Step 3: Execute the scan in background
        executeInBackground(executionId, tool, aiConfig);

        // Return immediately
        return NextResponse.json({
            success: true,
            executionId,
            tool,
            target: aiConfig.target,
            command: aiConfig.command,
            status: 'pending',
            message: 'AI scan started in background'
        });

    } catch (error: any) {
        console.error('❌ AI Execute API error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}

async function executeInBackground(executionId: string, tool: string, aiConfig: any) {
    try {
        let output = '';

        // Execute the scan
        switch (tool.toLowerCase()) {
            case 'nmap':
                output = await DockerRunner.runNmap(aiConfig.target, aiConfig.customParams);
                break;
            case 'nikto':
                output = await DockerRunner.runNikto(aiConfig.target);
                break;
            case 'nuclei':
                output = await DockerRunner.runNuclei(aiConfig.target);
                break;
            case 'feroxbuster':
                output = await DockerRunner.runFeroxbuster(aiConfig.target);
                break;
            case 'theharvester':
                output = await DockerRunner.runTheHarvester(aiConfig.target);
                break;
            case 'testssl':
                output = await DockerRunner.runTestSSL(aiConfig.target);
                break;
            default:
                throw new Error(`Unsupported tool: ${tool}`);
        }

        // Get AI analysis of results
        let aiAnalysis;
        try {
            const analysisResponse = await fetch(`${process.env.AI_AGENT_URL || 'http://localhost:8000'}/analyze-results`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tool: tool,
                    target: aiConfig.target,
                    rawOutput: output
                })
            });

            if (analysisResponse.ok) {
                aiAnalysis = await analysisResponse.json();
            }
        } catch (error) {
            console.error('AI analysis failed:', error);
        }

        // Update execution record
        await prisma.toolExecution.update({
            where: { id: executionId },
            data: {
                status: 'completed',
                completedAt: new Date(),
                rawOutput: output,
                aiAnalysis: aiAnalysis ? JSON.stringify(aiAnalysis) : null
            }
        });

    } catch (error: any) {
        console.error(`❌ Error executing ${tool}:`, error);

        await prisma.toolExecution.update({
            where: { id: executionId },
            data: {
                status: 'failed',
                completedAt: new Date(),
                error: error.message
            }
        });
    }
}
