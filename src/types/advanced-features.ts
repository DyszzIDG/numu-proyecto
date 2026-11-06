import { Prisma } from '@prisma/client';

export interface ScanTag {
    id: string;
    name: string;
    color: string;
    description?: string;
}

export interface ScanAnnotation {
    id: string;
    scanId: string;
    findingId?: string;
    userId: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface WorkflowStep {
    id: string;
    tool: string;
    condition?: string;
    parameters?: Record<string, any>;
    order: number;
}

export interface Workflow {
    id: string;
    name: string;
    description: string;
    steps: WorkflowStep[];
    createdBy: string;
    isPublic: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface ShareLink {
    id: string;
    scanId: string;
    token: string;
    expiresAt: Date;
    viewCount: number;
    maxViews?: number;
    createdAt: Date;
}

export interface ThreatIntelData {
    source: 'shodan' | 'virustotal' | 'abuseipdb';
    data: any;
    fetchedAt: Date;
    confidence: number;
}

export interface ScanJob {
    id: string;
    targets: string[];
    tool: string;
    parameters: Record<string, any>;
    status: 'pending' | 'running' | 'completed' | 'failed';
    progress: number;
    results: any[];
    createdAt: Date;
    startedAt?: Date;
    completedAt?: Date;
    error?: string;
}
