/**
 * AI Client for Next.js
 * Wrapper for calling the Python AI agent service
 */

export interface AIAnalyzeRequest {
    prompt: string;
    tool: string;
    target?: string;
}

export interface AIAnalyzeResponse {
    success: boolean;
    tool: string;
    target: string;
    parameters: Record<string, any>;
    command: string;
    reasoning: string;
    customParams: string;
    error?: string;
}

export interface AIAnalyzeResultsRequest {
    tool: string;
    target: string;
    rawOutput: string;
}

export interface AIAnalyzeResultsResponse {
    success: boolean;
    summary: string;
    severity: string;
    findings: string[];
    recommendations: string[];
    error?: string;
}

const AI_AGENT_URL = process.env.AI_AGENT_URL || 'http://localhost:8000';

export class AIClient {
    static async analyze(request: AIAnalyzeRequest): Promise<AIAnalyzeResponse> {
        try {
            const response = await fetch(`${AI_AGENT_URL}/analyze`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(request)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || 'AI analysis failed');
            }

            return await response.json();
        } catch (error: any) {
            console.error('AI Client Error:', error);
            throw new Error(`AI service unavailable: ${error.message}`);
        }
    }

    static async analyzeResults(request: AIAnalyzeResultsRequest): Promise<AIAnalyzeResultsResponse> {
        try {
            const response = await fetch(`${AI_AGENT_URL}/analyze-results`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(request)
            });

            if (!response.ok) {
                // Return graceful fallback if AI analysis fails
                return {
                    success: false,
                    summary: 'AI analysis unavailable',
                    severity: 'info',
                    findings: [],
                    recommendations: [],
                    error: 'AI service unavailable'
                };
            }

            return await response.json();
        } catch (error: any) {
            console.error('AI Results Analysis Error:', error);
            return {
                success: false,
                summary: 'Scan completed successfully',
                severity: 'info',
                findings: [],
                recommendations: [],
                error: error.message
            };
        }
    }

    static async healthCheck(): Promise<{ status: string; ai_enabled: boolean }> {
        try {
            const response = await fetch(`${AI_AGENT_URL}/health`);
            return await response.json();
        } catch (error) {
            return { status: 'unavailable', ai_enabled: false };
        }
    }
}
