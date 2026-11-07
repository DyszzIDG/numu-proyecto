'use server';

import { prisma } from '@/lib/prisma';

export interface ThreatHuntingData {
    threats: Array<{
        id: string;
        title: string;
        description: string;
        type: string;
        severity: string;
        source: string;
        confidence: number;
        threatActor?: string | null;
        techniques: string[];
        targetedSectors: string[];
    }>;
    kqlQueries: string[];
    targetEndpoints: string[];
}

export async function getThreatHuntingData(): Promise<ThreatHuntingData> {
    try {
        const threats = await prisma.threatIntelligence.findMany({
            orderBy: { createdAt: 'desc' },
            take: 10
        });

        const defaultKql = [
            'SecurityEvent | where EventID == 4625 | summarize count() by Account, IpAddress | where count_ > 10',
            'DeviceProcessEvents | where ProcessCommandLine has_any ("mimikatz", "powershell -enc", "vssadmin delete shadows")',
            'DeviceNetworkEvents | where RemotePort in (4444, 1337, 8080) and InitiatingProcessFileName !in ("chrome.exe", "edge.exe")'
        ];

        const defaultTargets = [
            'SRV-DC-01 (Domain Controller)',
            'SRV-NAS-FIN01 (File Server)',
            'GW-VPN-CORP (Cisco AnyConnect)',
            'SRV-DB-PROD (PostgreSQL Master)',
            'WKST-EXEC-02 (C-Level Laptop)'
        ];

        return {
            threats: threats.map(t => ({
                id: t.id,
                title: t.title,
                description: t.description,
                type: t.type,
                severity: t.severity,
                source: t.source,
                confidence: t.confidence,
                threatActor: t.threatActor,
                techniques: t.techniques,
                targetedSectors: t.targetedSectors
            })),
            kqlQueries: defaultKql,
            targetEndpoints: defaultTargets
        };
    } catch (error) {
        console.error('Error fetching threat hunting data:', error);
        return {
            threats: [],
            kqlQueries: [
                'SecurityEvent | where EventID == 4625 | summarize count() by Account',
                'DeviceProcessEvents | where ProcessCommandLine has "EncodedCommand"'
            ],
            targetEndpoints: ['Domain Controller 01', 'File Server HR', 'Gateway VPN']
        };
    }
}
