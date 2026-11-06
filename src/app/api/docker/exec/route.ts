import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST(request: NextRequest) {
    try {
        const { command } = await request.json();

        if (!command || typeof command !== 'string') {
            return NextResponse.json(
                { success: false, error: 'Invalid command' },
                { status: 400 }
            );
        }

        // Security: Block dangerous commands
        const dangerousPatterns = [
            /rm\s+-rf/i,
            /mkfs/i,
            /dd\s+if=/i,
            /:\(\)\{.*\}/,  // Fork bomb
            />\s*\/dev\/sd/i,
        ];

        if (dangerousPatterns.some(pattern => pattern.test(command))) {
            return NextResponse.json(
                { success: false, error: 'Command blocked for security reasons' },
                { status: 403 }
            );
        }

        // Execute command in Docker container
        // Check if user already typed 'docker exec csirt-ubuntu'
        let dockerCommand: string;
        if (command.trim().startsWith('docker exec csirt-ubuntu')) {
            // User already specified the full docker exec command
            dockerCommand = command;
        } else {
            // Wrap the command in docker exec
            dockerCommand = `docker exec csirt-ubuntu bash -c "${command.replace(/"/g, '\\"')}"`;
        }

        const { stdout, stderr } = await execAsync(dockerCommand, {
            timeout: 900000, // 15 minute timeout for long scans (nmap vuln can take 5-10 min)
            maxBuffer: 1024 * 1024 * 10, // 10MB buffer for large scan outputs
        });

        const output = stdout || stderr || 'Command executed successfully (no output)';

        return NextResponse.json({
            success: true,
            output: output.trim(),
        });

    } catch (error: any) {
        console.error('Docker exec error:', error);

        // If command timed out but produced output, still show it
        const partialOutput = error.stdout || error.stderr || '';
        const isTimeout = error.killed || error.signal === 'SIGTERM';

        return NextResponse.json({
            success: false,
            error: isTimeout 
                ? 'Command timed out after 15 minutes. For long scans, use the command line instead.'
                : error.message || 'Failed to execute command',
            output: partialOutput.trim() || 'No output available',
            timeout: isTimeout,
        }, { status: isTimeout ? 408 : 500 });
    }
}
