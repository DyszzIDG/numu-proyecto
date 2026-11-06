/**
 * Universal Tool Command Generator
 * Centralized command generation for the specific set of security tools
 */

import { NmapGenerator } from './nmap-generator';
import { NiktoGenerator } from './nikto-generator';
import { HarvesterGenerator } from './harvester-generator';
import { generateNucleiCommand } from './nuclei-generator';
import { generateFeroxbusterCommand } from './feroxbuster-generator';
import { generateWhatWebCommand } from './whatweb-generator';
import { generateTestSSLCommand } from './testssl-generator';

export interface CommandGenerationRequest {
    toolId: string;
    userPrompt: string;
    target?: string;
    options?: Record<string, any>;
}

export interface CommandGenerationResult {
    command: string;
    explanation: string;
    estimatedDuration: string;
    requiresApiKey: boolean;
    requiresDocker: boolean;
}

export interface GeneratorResult {
    success: boolean;
    command?: string;
    error?: string;
    description?: string;
}

export class UniversalToolGenerator {
    /**
     * Generate command for any tool
     */
    static generate(request: CommandGenerationRequest): CommandGenerationResult {
        const { toolId, userPrompt, target, options } = request;

        let command: string;
        let explanation: string;
        let estimatedDuration: string;
        let requiresApiKey = false;
        let requiresDocker = true;

        switch (toolId) {
            // ============================================
            // NMAP
            // ============================================
            case 'nmap':
                command = NmapGenerator.fromNaturalLanguage(userPrompt, target || '');
                explanation = 'Network scan using Nmap to discover ports and services';
                estimatedDuration = '1-5 minutes';
                break;

            // ============================================
            // NIKTO
            // ============================================
            case 'nikto':
                // NiktoGenerator modified to accept target
                command = NiktoGenerator.fromNaturalLanguage(userPrompt, target || '');
                explanation = 'Web vulnerability scan using Nikto';
                estimatedDuration = '5-15 minutes';
                break;

            // ============================================
            // THEHARVESTER
            // ============================================
            case 'theharvester':
                command = HarvesterGenerator.fromNaturalLanguage(userPrompt, target || '');
                explanation = 'OSINT gathering for emails, subdomains, and people';
                estimatedDuration = '2-10 minutes';
                break;

            // ============================================
            // RECON-NG
            // ============================================
            case 'recon-ng':
                const workspace = target || 'default';
                const module = 'recon/domains-hosts/hackertarget'; // Default useful module
                // Generates a one-liner for recon-cli (requires container support)
                command = `recon-cli -w ${workspace} -m ${module} -x "source set ${target || 'example.com'}; run; exit"`;
                explanation = 'Reconnaissance framework for OSINT';
                estimatedDuration = '2-10 minutes';
                break;

            // ============================================
            // OWASP ZAP
            // ============================================
            case 'owasp-zap':
                const zapTarget = target || 'http://example.com';
                const isFull = userPrompt.toLowerCase().includes('full');
                if (isFull) {
                    command = `zap-full-scan.py -t ${zapTarget}`;
                    explanation = 'OWASP ZAP Full Scan';
                    estimatedDuration = '10-30 minutes';
                } else {
                    command = `zap-baseline.py -t ${zapTarget}`;
                    explanation = 'OWASP ZAP Baseline Scan';
                    estimatedDuration = '2-5 minutes';
                }
                break;

            // ============================================
            // BURP SUITE
            // ============================================
            case 'burp-suite':
                command = 'burpsuite';
                explanation = 'Launch Burp Suite GUI';
                estimatedDuration = 'Interactive';
                requiresDocker = false; // GUI tool on host usually, or X11 forwarding
                break;

            // ============================================
            // NUCLEI
            // ============================================
            case 'nuclei':
                command = `docker exec csirt-nuclei nuclei -u ${target || 'https://example.com'} -json`;
                // Ideally use the async generator if the invocation context allows, 
                // but for this synchronous 'generate' method we construct the string directly
                // matching the logic in the generator files.
                explanation = 'Vulnerability scan using Nuclei templates';
                estimatedDuration = '2-10 minutes';
                break;

            // ============================================
            // FEROXBUSTER
            // ============================================
            case 'feroxbuster':
                command = `docker exec csirt-feroxbuster feroxbuster -u ${target || 'https://example.com'} --json --time-limit 5m`;
                explanation = 'Fast content discovery with Feroxbuster';
                estimatedDuration = '5-30 minutes';
                break;

            // ============================================
            // WHATWEB
            // ============================================
            case 'whatweb':
                // Using the specific whatweb command from our custom generator logic
                command = `docker exec csirt-whatweb ./whatweb ${target || 'https://example.com'} --log-json=-`;
                explanation = 'Web technology identification with WhatWeb';
                estimatedDuration = '1 minute';
                break;

            // ============================================
            // TESTSSL.SH
            // ============================================
            case 'testssl':
                command = `docker exec csirt-testssl testssl.sh --jsonfile /dev/stdout ${target || 'example.com'}`;
                explanation = 'Deep SSL/TLS configuration analysis';
                estimatedDuration = '2-5 minutes';
                break;

            default:
                command = `# Tool '${toolId}' configuration not found`;
                explanation = `Command generation for ${toolId} is not supported.`;
                estimatedDuration = 'Unknown';
        }

        return {
            command,
            explanation,
            estimatedDuration,
            requiresApiKey,
            requiresDocker,
        };
    }

    /**
     * Get tool-specific help
     */
    static getHelp(toolId: string): string {
        const helpTexts: Record<string, string> = {
            nmap: 'Nmap is a network scanner for port discovery and service detection. Use it to find open ports and identify running services.',
            theharvester: 'theHarvester gathers emails, subdomains, IPs, and URLs using multiple public sources. Great for OSINT and reconnaissance.',
            nikto: 'Nikto scans web servers for vulnerabilities, outdated software, and dangerous files. Essential for web application security testing.',
            'recon-ng': 'Recon-ng is a full-featured Web Reconnaissance framework with independent modules.',
            'owasp-zap': 'OWASP ZAP is a dedicated web application security scanner. It can find vulnerabilities like SQLi, XSS, and more.',
            'burp-suite': 'Burp Suite is a leading platform for web security testing. It includes a proxy, scanner, and other tools.',
            nuclei: 'Nuclei is a fast, template-based vulnerability scanner focusing on configurability and extensibility.',
            feroxbuster: 'Feroxbuster is a fast, recursive content discovery tool written in Rust.',
            whatweb: 'WhatWeb identifies websites, detecting content management systems (CMS), blogging platforms, statistic/analytics packages, etc.',
            testssl: 'testssl.sh is a free command line tool which checks a server\'s service on any port for the support of TLS/SSL ciphers, protocols as well as recent cryptographic flaws.',
        };

        return helpTexts[toolId] || 'No help available for this tool yet.';
    }
}
