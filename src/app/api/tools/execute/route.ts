import { NextResponse } from "next/server";
import { DockerRunner } from "@/lib/docker/DockerRunner";
import { ScanProcessor } from "@/lib/services/scan-processor";
import { PrismaClient } from "@prisma/client";
import { getAuthenticatedUser } from "@/lib/auth/unified";
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

// ... imports remain the same

export async function POST(req: Request) {
    let executionId = "";
    try {
        const { tool, target, options } = await req.json();

        if (!tool || !target) {
            return NextResponse.json({ message: "Tool and Target are required" }, { status: 400 });
        }

        const user = await getAuthenticatedUser();
        executionId = uuidv4();

        // Create ToolExecution record
        await prisma.toolExecution.create({
            data: {
                id: executionId,
                toolName: tool,
                target: target,
                status: 'running',
                parameters: JSON.stringify(options || {}),
                command: `docker run ${tool}`,
                userId: user?.id,
                startedAt: new Date(),
            }
        });

        let rawOutput = "";

        // Execute Tool
        switch (tool) {
            case 'nikto': rawOutput = await DockerRunner.runNikto(target); break;
            case 'nuclei': rawOutput = await DockerRunner.runNuclei(target); break;
            case 'zap': rawOutput = await DockerRunner.runZap(target); break;
            case 'nmap': rawOutput = await DockerRunner.runNmap(target); break;
            case 'sqlmap': rawOutput = await DockerRunner.runSqlMap(target); break;
            case 'yara': rawOutput = await DockerRunner.runYara(target); break;
            case 'theharvester': rawOutput = await DockerRunner.runTheHarvester(target); break;
            case 'gobuster': rawOutput = await DockerRunner.runGobuster(target); break;
            case 'lynis': rawOutput = await DockerRunner.runLynis(); break;
            case 'metasploit': rawOutput = await DockerRunner.runMetasploit(); break;

            // KALI TOOLBOX
            case 'amass': rawOutput = await DockerRunner.runAmass(target); break;
            case 'sublist3r': rawOutput = await DockerRunner.runSublist3r(target); break;
            case 'dnsrecon': rawOutput = await DockerRunner.runDnsRecon(target); break;
            case 'wfuzz': rawOutput = await DockerRunner.runWfuzz(target); break;
            case 'commix': rawOutput = await DockerRunner.runCommix(target); break;
            case 'masscan': rawOutput = await DockerRunner.runMasscan(target); break;
            case 'hping3': rawOutput = await DockerRunner.runHping3(target); break;
            case 'radare2': rawOutput = await DockerRunner.runRadare2(target); break;
            case 'whatweb': rawOutput = await DockerRunner.runWhatWeb(target); break;
            case 'wpscan': rawOutput = await DockerRunner.runWpscan(target); break;
            case 'subfinder': rawOutput = await DockerRunner.runSubfinder(target); break;

            // UNSUPPORTED / PLACEHOLDERS
            default:
                if (['feroxbuster', 'testssl', 'recon-ng', 'burp-suite'].includes(tool)) {
                    // Try to run generically in toolbox if possible, else return helpful msg
                    try {
                        rawOutput = await DockerRunner.runInToolbox(`${tool} -h`);
                    } catch {
                        rawOutput = `Tool '${tool}' is not currently installed in the Docker environment.`;
                    }
                } else {
                    rawOutput = `Tool execution not configured for: ${tool}`;
                }
        }

        // Update execution with success
        await prisma.toolExecution.update({
            where: { id: executionId },
            data: {
                status: 'completed',
                completedAt: new Date(),
                rawOutput: rawOutput,
                duration: 0,
            }
        });

        // Process Results
        const scanId = await ScanProcessor.processScan({
            executionId,
            toolName: tool,
            target,
            rawOutput,
            aiAnalysis: { summary: "Scan executed successfully via Docker." }
        });

        return NextResponse.json({
            message: "Scan completed",
            executionId,
            scanId,
            outputPreview: rawOutput.substring(0, 500)
        });

    } catch (error: any) {
        console.error("Execution failed:", error);
        console.error("Error stack:", error.stack);

        if (executionId) {
            await prisma.toolExecution.update({
                where: { id: executionId },
                data: {
                    status: 'failed',
                    completedAt: new Date(),
                    error: error.message
                }
            });
        }

        // Provide user-friendly error messages
        let userMessage = error.message || "Execution failed";

        // Check if it's a Docker-related error
        if (error.message?.includes('Docker Desktop no está corriendo') ||
            error.message?.includes('contenedor') ||
            error.message?.includes('docker-compose up')) {
            // Pass through the detailed Docker error message
            userMessage = error.message;
        }

        return NextResponse.json({
            message: userMessage,
            executionId,
            error: error.message
        }, { status: 500 });
    }
}
