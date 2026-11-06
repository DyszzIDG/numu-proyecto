/**
 * AI Prompt Templates for Security Tools
 * Structured prompts for consistent AI responses
 */

export class AIPrompts {
    /**
     * System prompts for different AI roles
     */
    static readonly SYSTEM_PROMPTS = {
        commandGenerator: `You are an expert cybersecurity professional specializing in security scanning tools.
Your role is to help users generate safe, effective, and properly configured security scanning commands.

Guidelines:
- Always prioritize safety and non-destructive scans
- Explain what each command does in simple terms
- Suggest appropriate scan types based on user goals
- Warn about scans that might be detected or take long time
- Never generate commands that could harm systems
- Follow industry best practices (OWASP, NIST, CIS)`,

        securityAnalyst: `You are a senior cybersecurity analyst with 10+ years of experience in penetration testing and vulnerability assessment.
Your role is to analyze security scan results and provide actionable insights.

Guidelines:
- Provide clear, executive-level summaries
- Prioritize findings by risk level
- Offer specific, actionable remediation steps
- Reference CVEs and CVSS scores when applicable
- Consider business impact, not just technical severity
- Use clear, professional language suitable for both technical and non-technical audiences`,

        incidentResponder: `You are a CSIRT (Computer Security Incident Response Team) specialist.
Your role is to help identify, analyze, and respond to security incidents.

Guidelines:
- Focus on immediate threats and containment
- Provide step-by-step incident response procedures
- Identify indicators of compromise (IOCs)
- Suggest forensic preservation steps
- Recommend communication protocols
- Follow NIST Incident Response Framework`,
    };

    /**
     * Tool-specific command generation prompts
     */
    static getNmapCommandPrompt(userRequest: string, target?: string): string {
        return `Generate an Nmap command for this request: "${userRequest}"
${target ? `Target: ${target}` : ''}

Available Nmap scan types:
1. Quick Scan (-T4 -F): Fast scan of top 100 ports (1-2 min)
2. Full Scan (-p- -T4): All 65535 ports (10-30 min)
3. Vulnerability Scan (-sV --script vuln): Detect known vulnerabilities (5-15 min)
4. Stealth Scan (-sS -T2): Avoid detection, slower (5-20 min)
5. Service Detection (-sV): Identify service versions (2-5 min)
6. OS Detection (-O): Identify operating system (2-5 min)

Return JSON:
{
  "command": "nmap command without 'docker exec' prefix",
  "explanation": "what this scan does and why",
  "estimatedDuration": "time estimate",
  "scanType": "quick|full|vuln|stealth|custom",
  "options": {
    "ports": "port specification if custom",
    "timing": "0-5",
    "flags": ["list", "of", "flags"]
  },
  "warnings": ["any warnings about scan duration, detection, etc."]
}`;
    }

    static getNiktoCommandPrompt(userRequest: string, target?: string): string {
        return `Generate a Nikto command for this request: "${userRequest}"
${target ? `Target: ${target}` : ''}

Nikto is a web server scanner that tests for:
- Outdated server software
- Dangerous files/programs
- Server misconfigurations
- Default files and programs
- Insecure files and programs

Common options:
- -h: Target host
- -ssl: Force SSL mode
- -port: Specify port (default 80/443)
- -Tuning: Test categories (1=Interesting, 2=Misconfiguration, 3=Information, 4=Injection, 6=Denial of Service, 9=SQL Injection)
- -evasion: Evasion techniques

Return JSON:
{
  "command": "nikto command",
  "explanation": "what this scan tests for",
  "estimatedDuration": "time estimate",
  "options": {
    "ssl": true/false,
    "port": 80,
    "tuning": "1,2,3",
    "plugins": []
  },
  "warnings": ["scan may be logged by target server", "etc."]
}`;
    }

    static getFofaCommandPrompt(userRequest: string, query?: string): string {
        return `Generate a FOFA search query for this request: "${userRequest}"
${query ? `Initial query: ${query}` : ''}

FOFA is a cyberspace search engine that can find:
- Exposed services and devices
- Web applications
- Vulnerable systems
- Specific technologies

Query syntax examples:
- domain="example.com"
- ip="1.2.3.4"
- port="80"
- protocol="https"
- country="US"
- title="login"
- body="powered by"

Return JSON:
{
  "query": "FOFA search query",
  "explanation": "what this query searches for",
  "estimatedResults": "approximate number of results",
  "options": {
    "size": 100,
    "fields": ["ip", "port", "host", "title"]
  },
  "warnings": ["requires FOFA API key", "etc."]
}`;
    }

    /**
     * Analysis prompts for different scan types
     */
    static getAnalysisPrompt(tool: string, target: string, data: string): string {
        const basePrompt = `Analyze these ${tool} scan results for ${target}:

${data.substring(0, 8000)}${data.length > 8000 ? '\n...(truncated for length)' : ''}

Provide comprehensive analysis in JSON format:
{
  "summary": "2-3 sentence executive summary",
  "riskLevel": "low|medium|high|critical",
  "score": 0-100 (100 = most secure),
  "vulnerabilities": [
    {
      "id": "unique-id",
      "title": "vulnerability name",
      "severity": "info|low|medium|high|critical",
      "cvss": 7.5,
      "cve": "CVE-2024-XXXX",
      "description": "detailed description",
      "impact": "potential business impact",
      "recommendation": "specific remediation steps",
      "references": ["https://..."]
    }
  ],
  "openPorts": [
    {
      "port": 80,
      "service": "http",
      "version": "Apache 2.4.41",
      "risk": "low|medium|high",
      "reason": "why this port is risky or safe"
    }
  ],
  "recommendations": [
    {
      "priority": "critical|high|medium|low",
      "action": "what to do",
      "rationale": "why it's important"
    }
  ],
  "insights": [
    "interesting findings",
    "patterns detected",
    "security posture observations"
  ],
  "complianceIssues": [
    {
      "framework": "PCI-DSS|HIPAA|GDPR|SOC2",
      "requirement": "specific requirement",
      "status": "compliant|non-compliant|partial",
      "details": "explanation"
    }
  ]
}`;

        return basePrompt;
    }

    /**
     * Prompt for generating executive reports
     */
    static getExecutiveReportPrompt(scanData: any): string {
        return `Create an executive summary report from these security scan results:

${JSON.stringify(scanData, null, 2)}

Generate a professional executive report in JSON format:
{
  "title": "Security Assessment Report",
  "date": "ISO date",
  "target": "scanned target",
  "executiveSummary": "high-level overview for C-level executives",
  "keyFindings": [
    "most important findings (3-5 items)"
  ],
  "riskScore": 0-100,
  "criticalIssues": number,
  "highIssues": number,
  "mediumIssues": number,
  "lowIssues": number,
  "topRecommendations": [
    "prioritized action items (3-5 items)"
  ],
  "complianceStatus": {
    "framework": "applicable framework",
    "status": "compliant|at-risk|non-compliant",
    "gaps": ["identified gaps"]
  },
  "nextSteps": [
    "recommended follow-up actions"
  ]
}`;
    }

    /**
     * Prompt for comparing scan results over time
     */
    static getTrendAnalysisPrompt(currentScan: any, previousScans: any[]): string {
        return `Compare this current scan with previous scans to identify trends:

Current Scan:
${JSON.stringify(currentScan, null, 2).substring(0, 3000)}

Previous Scans (${previousScans.length} scans):
${JSON.stringify(previousScans, null, 2).substring(0, 3000)}

Analyze trends and provide JSON:
{
  "trend": "improving|declining|stable",
  "newVulnerabilities": number,
  "resolvedVulnerabilities": number,
  "persistentIssues": [
    "issues that haven't been fixed"
  ],
  "improvements": [
    "positive changes detected"
  ],
  "concerns": [
    "negative trends or new risks"
  ],
  "recommendations": [
    "based on trend analysis"
  ]
}`;
    }

    /**
     * Prompt for natural language query to tool options
     */
    static getQueryToOptionsPrompt(tool: string, query: string): string {
        return `Convert this natural language request into structured tool options:

Tool: ${tool}
User Query: "${query}"

Return JSON with appropriate options for ${tool}:
{
  "target": "extracted target if mentioned",
  "scanType": "appropriate scan type",
  "options": {
    // tool-specific options
  },
  "reasoning": "why these options were chosen"
}`;
    }
}
