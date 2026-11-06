import { NextResponse } from 'next/server';
import { DockerRunner } from '@/lib/docker/DockerRunner';
import { ScanProcessor } from '@/lib/services/scan-processor';
import { PrismaClient } from '@prisma/client';
import { getAuthenticatedUser } from "@/lib/auth/unified";
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const { tool, target, customParams } = await req.json();

        if (!tool || !target) {
            return NextResponse.json(
                { message: 'Tool and target are required' },
                { status: 400 }
            );
        }

        console.log(`🔧 Manual scan requested: ${tool} on ${target}`);

        const user = await getAuthenticatedUser();
        const executionId = uuidv4();

        // Create ToolExecution record
        await prisma.toolExecution.create({
            data: {
                id: executionId,
                toolName: tool,
                target: target,
                status: 'running',
                parameters: JSON.stringify({ customParams }),
                command: `docker run ${tool} ${target} ${customParams || ''}`,
                userId: user?.id,
                startedAt: new Date(),
            }
        });

        let output = '';

        // Execute the tool directly without AI
        try {
            switch (tool.toLowerCase()) {
                case 'nmap':
                    output = await DockerRunner.runNmap(target, customParams);
                    break;
                case 'nikto':
                    output = await DockerRunner.runNikto(target);
                    break;
                case 'nuclei':
                    output = await DockerRunner.runNuclei(target);
                    break;
                case 'feroxbuster':
                    output = await DockerRunner.runFeroxbuster(target);
                    break;
                case 'theharvester':
                    output = await DockerRunner.runTheHarvester(target);
                    break;
                case 'testssl':
                    output = await DockerRunner.runTestSSL(target);
                    break;
                case 'whatweb':
                    output = await DockerRunner.runWhatWeb(target);
                    break;
                default:
                    throw new Error(`Unsupported tool: ${tool}`);
            }

            // Update execution with success
            await prisma.toolExecution.update({
                where: { id: executionId },
                data: {
                    status: 'completed',
                    completedAt: new Date(),
                    rawOutput: output,
                }
            });

            // Process and save the scan result
            await ScanProcessor.processScan({
                executionId,
                toolName: tool,
                target,
                rawOutput: output,
                aiAnalysis: {
                    summary: `Manual scan executed without AI analysis. Tool: ${tool}`,
                },
            });

            return NextResponse.json({
                success: true,
                output,
                tool,
                target,
                executionId,
                message: 'Scan completed successfully',
            });
        } catch (error: any) {
            console.error(`❌ Error executing ${tool}:`, error);

            // Update execution with failure
            await prisma.toolExecution.update({
                where: { id: executionId },
                data: {
                    status: 'failed',
                    completedAt: new Date(),
                    error: error.message
                }
            });

            // Save failed scan result as well for record
            await ScanProcessor.processScan({
                executionId,
                toolName: tool,
                target,
                rawOutput: `Error: ${error.message}`,
                aiAnalysis: {
                    summary: `Manual scan failed: ${error.message}`,
                },
            });

            return NextResponse.json({
                success: false,
                error: error.message || 'Scan execution failed',
                tool,
                target,
            });
        }
    } catch (error: any) {
        console.error('❌ Manual scan API error:', error);
        return NextResponse.json(
            { message: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
