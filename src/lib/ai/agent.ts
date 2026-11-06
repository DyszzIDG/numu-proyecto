/**
 * AI Agent for Security Tool Command Generation and Analysis
 * Handles natural language to command conversion and result analysis
 */

export interface AICommandRequest {
    tool: 'nmap' | 'nikto' | 'zenmap' | 'fofa';
    userPrompt: string;
    target?: string;
}

export interface AICommandResponse {
    command: string;
    explanation: string;
    estimatedDuration: string;
    options: any;
}

export interface AIAnalysisRequest {
    tool: string;
    target: string;
    rawOutput: string;
    jsonResult?: any;
}

export interface AIAnalysisResponse {
    summary: string;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    vulnerabilities: Array<{
        title: string;
        severity: 'info' | 'low' | 'medium' | 'high' | 'critical';
        description: string;
        recommendation: string;
        cvss?: number;
    }>;
    recommendations: string[];
    insights: string[];
}

export class AIAgent {
    private static apiKey: string = process.env.OPENAI_API_KEY || '';
    private static model: string = 'gpt-4o-mini';
    private static baseUrl: string = 'https://api.openai.com/v1/chat/completions';

    /**
     * Generate security tool command from natural language
     */
    static async generateCommand(request: AICommandRequest): Promise<AICommandResponse> {
        const prompt = this.buildCommandPrompt(request);

        try {
            const response = await fetch(this.baseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`,
                },
                body: JSON.stringify({
                    model: this.model,
                    messages: [
                        {
                            role: 'system',
                            content: 'You are a cybersecurity expert that helps users generate safe and effective security scanning commands. Always prioritize safety and explain what the command does.',
                        },
                        {
                            role: 'user',
                            content: prompt,
                        },
                    ],
                    temperature: 0.3,
                    response_format: { type: 'json_object' },
                }),
            });

            if (!response.ok) {
                throw new Error(`OpenAI API error: ${response.statusText}`);
            }

            const data = await response.json();
            const result = JSON.parse(data.choices[0].message.content);

            return {
                command: result.command,
                explanation: result.explanation,
                estimatedDuration: result.estimatedDuration || 'Unknown',
                options: result.options || {},
            };
        } catch (error: any) {
            console.error('AI command generation error:', error);
            // Fallback to basic command generation
            return this.fallbackCommandGeneration(request);
        }
    }

    /**
     * Analyze security tool results with AI
     */
    static async analyzeResults(request: AIAnalysisRequest): Promise<AIAnalysisResponse> {
        const prompt = this.buildAnalysisPrompt(request);

        try {
            const response = await fetch(this.baseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`,
                },
                body: JSON.stringify({
                    model: this.model,
                    messages: [
                        {
                            role: 'system',
                            content: 'You are a senior cybersecurity analyst. Analyze security scan results and provide actionable insights, vulnerability assessments, and remediation recommendations.',
                        },
                        {
                            role: 'user',
                            content: prompt,
                        },
                    ],
                    temperature: 0.4,
                    response_format: { type: 'json_object' },
                }),
            });

            if (!response.ok) {
                throw new Error(`OpenAI API error: ${response.statusText}`);
            }

            const data = await response.json();
            const result = JSON.parse(data.choices[0].message.content);

            return {
                summary: result.summary,
                riskLevel: result.riskLevel || 'medium',
                vulnerabilities: result.vulnerabilities || [],
                recommendations: result.recommendations || [],
                insights: result.insights || [],
            };
        } catch (error: any) {
            console.error('AI analysis error:', error);
            // Fallback to basic analysis
            return this.fallbackAnalysis(request);
        }
    }

    /**
     * Build prompt for command generation
     */
    private static buildCommandPrompt(request: AICommandRequest): string {
        const { tool, userPrompt, target } = request;

        return `Generate a ${tool} command based on this user request: "${userPrompt}"
${target ? `Target: ${target}` : ''}

Tool: ${tool}
Available options for ${tool}:
${this.getToolOptions(tool)}

Return a JSON object with:
{
  "command": "the actual command to run (without 'docker exec' prefix)",
  "explanation": "clear explanation of what this command does",
  "estimatedDuration": "estimated time (e.g., '2-5 minutes')",
  "options": {
    // structured options object for the tool
  }
}

IMPORTANT:
- Only generate safe, non-destructive commands
- For nmap: use appropriate timing (-T4 for normal, -T2 for stealth)
- For nikto: include -h for host, -Tuning for specific tests
- For fofa: use proper query syntax
- Do NOT include dangerous flags like -sU (UDP) without user explicitly requesting it
- Always explain the scan type and what it detects`;
    }

    /**
     * Build prompt for result analysis
     */
    private static buildAnalysisPrompt(request: AIAnalysisRequest): string {
        const { tool, target, rawOutput, jsonResult } = request;

        return `Analyze these ${tool} scan results for target: ${target}

Raw Output:
${rawOutput.substring(0, 5000)} ${rawOutput.length > 5000 ? '...(truncated)' : ''}

${jsonResult ? `Parsed Data:\n${JSON.stringify(jsonResult, null, 2).substring(0, 3000)}` : ''}

Provide a comprehensive security analysis in JSON format:
{
  "summary": "executive summary of findings (2-3 sentences)",
  "riskLevel": "low|medium|high|critical",
  "vulnerabilities": [
    {
      "title": "vulnerability name",
      "severity": "info|low|medium|high|critical",
      "description": "detailed description",
      "recommendation": "how to fix",
      "cvss": 7.5 (optional, if applicable)
    }
  ],
  "recommendations": ["prioritized list of actions to take"],
  "insights": ["interesting findings or patterns"]
}

Focus on:
- Open ports and their security implications
- Outdated software versions
- Known vulnerabilities (CVEs)
- Misconfigurations
- Best practices violations
- Immediate action items`;
    }

    /**
     * Get tool-specific options documentation
     */
    private static getToolOptions(tool: string): string {
        const options: Record<string, string> = {
            nmap: `
- scanType: quick, full, vuln, stealth, custom
- ports: specific ports (e.g., "80,443,8080")
- timing: 0-5 (0=paranoid, 5=insane)
- osDetection: true/false
- serviceVersion: true/false
- scriptScan: true/false`,
            nikto: `
- ssl: true/false (use HTTPS)
- port: target port (default 80/443)
- tuning: test categories (1-9)
- evasion: evasion techniques
- plugins: specific plugins to run`,
            zenmap: `
- profile: Intense, Quick, Regular, Stealth
- target: IP or domain
- customOptions: additional nmap flags`,
            fofa: `
- query: FOFA search query
- size: number of results (max 100)
- fields: data fields to return`,
        };

        return options[tool] || 'No specific options available';
    }

    /**
     * Fallback command generation (when AI fails)
     */
    private static fallbackCommandGeneration(request: AICommandRequest): AICommandResponse {
        const { tool, target } = request;
        let command = '';
        let explanation = '';

        switch (tool) {
            case 'nmap':
                command = `nmap -T4 -F ${target || 'TARGET'}`;
                explanation = 'Quick scan of top 100 ports with normal timing';
                break;
            case 'nikto':
                command = `nikto -h ${target || 'TARGET'}`;
                explanation = 'Basic web server vulnerability scan';
                break;
            case 'fofa':
                command = `fofa search "${target || 'QUERY'}"`;
                explanation = 'Basic FOFA search query';
                break;
            default:
                command = `${tool} ${target || 'TARGET'}`;
                explanation = 'Basic scan with default options';
        }

        return {
            command,
            explanation,
            estimatedDuration: '2-5 minutes',
            options: {},
        };
    }

    /**
     * Fallback analysis (when AI fails)
     */
    private static fallbackAnalysis(request: AIAnalysisRequest): AIAnalysisResponse {
        const { tool, target, rawOutput } = request;

        // Basic pattern matching for common findings
        const openPorts = (rawOutput.match(/open/gi) || []).length;
        const hasVulnerabilities = /vuln|vulnerable|CVE-/i.test(rawOutput);

        return {
            summary: `Scan completed for ${target}. Found ${openPorts} open ports. ${hasVulnerabilities ? 'Potential vulnerabilities detected.' : 'No obvious vulnerabilities found.'}`,
            riskLevel: hasVulnerabilities ? 'high' : openPorts > 10 ? 'medium' : 'low',
            vulnerabilities: [],
            recommendations: [
                'Review all open ports and close unnecessary services',
                'Ensure all software is up to date',
                'Implement proper firewall rules',
            ],
            insights: [
                `Tool used: ${tool}`,
                `Scan target: ${target}`,
                `Output size: ${rawOutput.length} characters`,
            ],
        };
    }

    /**
     * Generate recommendations based on vulnerabilities
     */
    static generateRecommendations(vulnerabilities: any[]): string[] {
        const recommendations: string[] = [];

        const criticalCount = vulnerabilities.filter(v => v.severity === 'critical').length;
        const highCount = vulnerabilities.filter(v => v.severity === 'high').length;

        if (criticalCount > 0) {
            recommendations.push(`🚨 URGENT: Address ${criticalCount} critical vulnerabilities immediately`);
        }

        if (highCount > 0) {
            recommendations.push(`⚠️ HIGH PRIORITY: Remediate ${highCount} high-severity issues within 24-48 hours`);
        }

        recommendations.push('📋 Conduct regular security scans (weekly recommended)');
        recommendations.push('🔒 Implement a vulnerability management program');
        recommendations.push('📊 Track remediation progress in a centralized dashboard');

        return recommendations;
    }
}
