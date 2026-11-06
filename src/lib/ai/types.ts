
export interface ParsedIntent {
    tool: string;
    target: string | null;
    scanType: string;
    flags: string[];
    confidence: number;
    explanation: string;
    command?: string;
}
