import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';

const execAsync = promisify(exec);
const RESULTS_DIR = path.resolve('./scan-results');

export interface UnifiedFinding {
    tool: string;
    target: string;
    severity: 'INFO' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    category: string;
    finding: string;
    evidence?: string;
    timestamp: string;
}

export type SecurityTool = 'nuclei' | 'zap' | 'feroxbuster' | 'whatweb' | 'testssl' | 'nikto';

export const Orchestrator = {
    async runScan(tool: SecurityTool, target: string): Promise<{ success: boolean; scanId: string; error?: string }> {
        const scanId = `${tool}-${Date.now()}`;
        const resultFile = `${scanId}.json`;
        
        let dockerCommand = '';

        switch (tool) {
            case 'nuclei':
                // projectdiscovery/nuclei
                dockerCommand = `docker exec csirt-nuclei nuclei -u ${target} -json -o /scan-results/${resultFile}`;
                break;
            case 'zap':
                // zaproxy/zap-stable
                // Using baseline scan script
                const targetClean = target.replace(/^https?:\/\//, '');
                dockerCommand = `docker exec csirt-zap zap-baseline.py -t ${target} -J /scan-results/${resultFile}`;
                break;
            case 'feroxbuster':
                // epi052/feroxbuster
                // --json output
                dockerCommand = `docker exec csirt-feroxbuster feroxbuster -u ${target} --json -o /scan-results/${resultFile} --time-limit 5m`;
                break;
            case 'whatweb':
                // urbanadventurer/whatweb
                // --log-json
                dockerCommand = `docker exec csirt-whatweb whatweb ${target} --log-json=/scan-results/${resultFile}`;
                break;
            case 'testssl':
                // drwetter/testssl.sh
                // --jsonfile
                dockerCommand = `docker exec csirt-testssl testssl.sh --jsonfile /scan-results/${resultFile} ${target}`;
                break;
             case 'nikto':
                // sullo/nikto
                // -Format json -o
                dockerCommand = `docker exec csirt-nikto nikto.pl -h ${target} -Format json -o /scan-results/${resultFile}`;
                break;
            default:
                return { success: false, scanId, error: 'Unknown tool' };
        }

        try {
            await execAsync(dockerCommand);
            return { success: true, scanId };
        } catch (error: any) {
            console.error(`Scan failed for ${tool}:`, error);
            return { success: false, scanId, error: error.message };
        }
    },

    async getResults(scanId: string): Promise<UnifiedFinding[]> {
        const resultPath = path.join(RESULTS_DIR, `${scanId}.json`);
        const tool = scanId.split('-')[0];
        
        try {
            const data = await fs.readFile(resultPath, 'utf-8');
            return this.normalize(data, tool as SecurityTool);
        } catch (error) {
            console.error(`Failed to read results for ${scanId}:`, error);
            return [];
        }
    },

    normalize(rawData: string, tool: SecurityTool): UnifiedFinding[] {
       const findings: UnifiedFinding[] = [];
       const timestamp = new Date().toISOString();

       if (!rawData.trim()) return [];

       try {
           switch (tool) {
               case 'nuclei':
                   // Nuclei emits one JSON object per line
                   const lines = rawData.split('\n').filter(l => l.trim());
                   lines.forEach(line => {
                       try {
                           const j = JSON.parse(line);
                           findings.push({
                               tool: 'nuclei',
                               target: j.host || '',
                               severity: (j.info?.severity || 'INFO').toUpperCase(),
                               category: j.info?.tags?.join(', ') || 'General',
                               finding: j.info?.name || j.templateId,
                               evidence: j.matched_at,
                               timestamp
                           });
                       } catch (e) {}
                   });
                   break;
                case 'zap':
                   // ZAP baseline JSON structure
                   const zapData = JSON.parse(rawData);
                   zapData.site?.forEach((site: any) => {
                       site.alerts?.forEach((alert: any) => {
                           const riskMap: Record<string, string> = { '0': 'INFO', '1': 'LOW', '2': 'MEDIUM', '3': 'HIGH' };
                           findings.push({
                               tool: 'zap',
                               target: site['@name'],
                               severity: (riskMap[alert.riskcode] || 'INFO').toUpperCase() as any,
                               category: 'OWASP Top 10',
                               finding: alert.name,
                               evidence: alert.instances?.map((i: any) => i.uri).join(', '),
                               timestamp
                           });
                       });
                   });
                   break;
                case 'feroxbuster':
                    // Feroxbuster emits JSON lines, mostly just discovered URLs
                     rawData.split('\n').filter(l => l.trim()).forEach(line => {
                        try {
                            const j = JSON.parse(line);
                            if (j.type === 'response') {
                                findings.push({
                                    tool: 'feroxbuster',
                                    target: j.url,
                                    severity: 'INFO',
                                    category: 'Content Discovery',
                                    finding: `Discovered: ${j.path}`,
                                    evidence: `Status: ${j.status}, Size: ${j.content_length}`,
                                    timestamp
                                });
                            }
                        } catch (e) {}
                     });
                     break;
                case 'whatweb':
                     // WhatWeb JSON array
                     const wwData = JSON.parse(rawData);
                     wwData.forEach((target: any) => {
                         const plugins = target.plugins;
                         for (const [pluginName, details] of Object.entries(plugins)) {
                             findings.push({
                                 tool: 'whatweb',
                                 target: target.target,
                                 severity: 'INFO',
                                 category: 'Fingerprinting',
                                 finding: `Technology: ${pluginName}`,
                                 evidence: JSON.stringify(details),
                                 timestamp
                             });
                         }
                     });
                     break;
                // Add handlers for testssl and nikto specifically
                // For brevity, defaulting to raw parse for now if schema allows
                default:
                    findings.push({
                        tool,
                        target: 'Unknown',
                        severity: 'INFO',
                        category: 'Raw Output',
                        finding: 'Parsing not fully implemented for this tool',
                        evidence: rawData.substring(0, 100) + '...',
                        timestamp
                    });
            }
       } catch (error) {
           console.error(`Normalization failed for ${tool}:`, error);
       }
       return findings;
    }
};
