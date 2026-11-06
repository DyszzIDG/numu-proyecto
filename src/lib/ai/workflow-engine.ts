import { Workflow, WorkflowStep } from '@/types/advanced-features';

interface ScanResult {
    tool: string;
    target: string;
    status: string;
    findings?: any[];
    services?: string[];
    openPorts?: number[];
}

export class WorkflowEngine {

    /**
     * Analyze scan result and recommend next scans
     */
    static recommendNextScans(scanResult: ScanResult): Array<{
        tool: string;
        reason: string;
        priority: 'high' | 'medium' | 'low';
        autoExecute: boolean;
    }> {
        const recommendations = [];

        // WordPress detected
        if (scanResult.services?.some(s => s.toLowerCase().includes('wordpress'))) {
            recommendations.push({
                tool: 'wpscan',
                reason: 'WordPress CMS detected - scan for plugin/theme vulnerabilities',
                priority: 'high' as const,
                autoExecute: false
            });
        }

        // MySQL port open
        if (scanResult.openPorts?.includes(3306)) {
            recommendations.push({
                tool: 'mysql-enum',
                reason: 'MySQL port 3306 open - enumerate databases',
                priority: 'medium' as const,
                autoExecute: false
            });
        }

        // SSH port open
        if (scanResult.openPorts?.includes(22)) {
            recommendations.push({
                tool: 'ssh-audit',
                reason: 'SSH port 22 open - audit SSH configuration',
                priority: 'medium' as const,
                autoExecute: false
            });
        }

        // Web server detected
        if (scanResult.openPorts?.some(p => [80, 443, 8080, 8443].includes(p))) {
            recommendations.push({
                tool: 'nikto',
                reason: 'Web server detected - scan for web vulnerabilities',
                priority: 'high' as const,
                autoExecute: false
            });

            recommendations.push({
                tool: 'testssl',
                reason: 'HTTPS detected - analyze SSL/TLS configuration',
                priority: 'medium' as const,
                autoExecute: false
            });
        }

        // FTP port open
        if (scanResult.openPorts?.includes(21)) {
            recommendations.push({
                tool: 'ftp-enum',
                reason: 'FTP port 21 open - check for anonymous access',
                priority: 'high' as const,
                autoExecute: false
            });
        }

        // SMB ports open
        if (scanResult.openPorts?.some(p => [139, 445].includes(p))) {
            recommendations.push({
                tool: 'enum4linux',
                reason: 'SMB ports detected - enumerate shares and users',
                priority: 'high' as const,
                autoExecute: false
            });
        }

        return recommendations;
    }

    /**
     * Execute workflow steps in sequence
     */
    static async executeWorkflow(
        workflow: Workflow,
        initialTarget: string,
        onProgress?: (step: number, total: number, status: string) => void
    ): Promise<any[]> {
        const results = [];

        for (let i = 0; i < workflow.steps.length; i++) {
            const step = workflow.steps[i];

            onProgress?.(i + 1, workflow.steps.length, `Executing ${step.tool}...`);

            try {
                // Check condition if exists
                if (step.condition && !this.evaluateCondition(step.condition, results)) {
                    onProgress?.(i + 1, workflow.steps.length, `Skipped ${step.tool} (condition not met)`);
                    continue;
                }

                // Execute scan
                const result = await this.executeScan(step.tool, initialTarget, step.parameters);
                results.push(result);

                onProgress?.(i + 1, workflow.steps.length, `Completed ${step.tool}`);
            } catch (error) {
                console.error(`Error executing ${step.tool}:`, error);
                results.push({
                    tool: step.tool,
                    status: 'failed',
                    error: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        }

        return results;
    }

    /**
     * Evaluate workflow condition
     */
    private static evaluateCondition(condition: string, previousResults: any[]): boolean {
        // Simple condition evaluation
        // Format: "previous.tool === 'nmap' && previous.openPorts.includes(80)"

        if (!previousResults.length) return false;

        const previous = previousResults[previousResults.length - 1];

        try {
            // Create safe evaluation context
            const context = { previous };
            const func = new Function('context', `with(context) { return ${condition}; }`);
            return func(context);
        } catch {
            return false;
        }
    }

    /**
     * Execute individual scan
     */
    private static async executeScan(
        tool: string,
        target: string,
        parameters?: Record<string, any>
    ): Promise<any> {
        const response = await fetch('/api/tools/execute', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                tool,
                target,
                options: parameters || {},
                generatedBy: 'workflow'
            })
        });

        if (!response.ok) {
            throw new Error(`Failed to execute ${tool}`);
        }

        return response.json();
    }

    /**
     * Create workflow from template
     */
    static createWorkflowTemplate(type: 'web-full' | 'network-full' | 'quick-recon'): Workflow {
        const templates = {
            'web-full': {
                name: 'Full Web Application Scan',
                description: 'Comprehensive web application security assessment',
                steps: [
                    { id: '1', tool: 'nmap', parameters: { scanType: 'quick', ports: '80,443,8080,8443' }, order: 1 },
                    { id: '2', tool: 'nikto', parameters: {}, order: 2 },
                    { id: '3', tool: 'testssl', condition: "previous.openPorts?.includes(443)", parameters: {}, order: 3 },
                    { id: '4', tool: 'feroxbuster', parameters: {}, order: 4 },
                    { id: '5', tool: 'whatweb', parameters: {}, order: 5 }
                ]
            },
            'network-full': {
                name: 'Full Network Scan',
                description: 'Complete network reconnaissance and enumeration',
                steps: [
                    { id: '1', tool: 'nmap', parameters: { scanType: 'full' }, order: 1 },
                    { id: '2', tool: 'enum4linux', condition: "previous.openPorts?.some(p => [139, 445].includes(p))", parameters: {}, order: 2 }
                ]
            },
            'quick-recon': {
                name: 'Quick Reconnaissance',
                description: 'Fast initial reconnaissance',
                steps: [
                    { id: '1', tool: 'nmap', parameters: { scanType: 'quick' }, order: 1 },
                    { id: '2', tool: 'theharvester', parameters: {}, order: 2 },
                    { id: '3', tool: 'subfinder', parameters: {}, order: 3 }
                ]
            }
        };

        const template = templates[type];

        return {
            id: '',
            name: template.name,
            description: template.description,
            steps: template.steps,
            createdBy: '',
            isPublic: false,
            createdAt: new Date(),
            updatedAt: new Date()
        };
    }
}
