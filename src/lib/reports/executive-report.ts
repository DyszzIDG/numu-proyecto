interface ScanResult {
    id: string;
    target: string;
    tool: string;
    scanType: string;
    status: string;
    findings: Array<{
        severity: string;
        title: string;
        description: string;
        cvss?: number;
    }>;
    duration: number;
    timestamp: Date;
}

interface ExecutiveReport {
    summary: string;
    riskLevel: 'critical' | 'high' | 'medium' | 'low';
    riskScore: number;
    keyFindings: string[];
    recommendations: string[];
    technicalSummary: string;
    businessImpact: string;
}

export class ExecutiveReportGenerator {

    /**
     * Generate executive summary from scan results
     */
    static generateExecutiveReport(scans: ScanResult[]): ExecutiveReport {
        const allFindings = scans.flatMap(s => s.findings);
        const criticalCount = allFindings.filter(f => f.severity === 'critical').length;
        const highCount = allFindings.filter(f => f.severity === 'high').length;
        const mediumCount = allFindings.filter(f => f.severity === 'medium').length;

        // Calculate risk score
        const riskScore = this.calculateRiskScore(allFindings);
        const riskLevel = this.determineRiskLevel(riskScore);

        // Generate summary
        const summary = this.generateSummary(scans, allFindings, riskLevel);

        // Extract key findings
        const keyFindings = this.extractKeyFindings(allFindings);

        // Generate recommendations
        const recommendations = this.generateRecommendations(allFindings, riskLevel);

        // Technical summary
        const technicalSummary = this.generateTechnicalSummary(scans, allFindings);

        // Business impact
        const businessImpact = this.generateBusinessImpact(riskLevel, criticalCount, highCount);

        return {
            summary,
            riskLevel,
            riskScore,
            keyFindings,
            recommendations,
            technicalSummary,
            businessImpact
        };
    }

    private static calculateRiskScore(findings: any[]): number {
        const weights = { critical: 10, high: 7, medium: 4, low: 2, info: 1 };
        let score = 0;

        for (const finding of findings) {
            const weight = weights[finding.severity as keyof typeof weights] || 1;
            score += weight;
        }

        return Math.min(100, Math.round((score / findings.length) * 10));
    }

    private static determineRiskLevel(score: number): 'critical' | 'high' | 'medium' | 'low' {
        if (score >= 80) return 'critical';
        if (score >= 60) return 'high';
        if (score >= 40) return 'medium';
        return 'low';
    }

    private static generateSummary(scans: ScanResult[], findings: any[], riskLevel: string): string {
        const targetCount = new Set(scans.map(s => s.target)).size;
        const findingCount = findings.length;
        const criticalCount = findings.filter(f => f.severity === 'critical').length;

        if (riskLevel === 'critical') {
            return `A comprehensive security assessment was conducted across ${targetCount} target(s), revealing ${findingCount} security findings, including ${criticalCount} critical vulnerabilities that require immediate attention. The organization's security posture presents significant risks that could lead to data breaches, service disruptions, or compliance violations.`;
        } else if (riskLevel === 'high') {
            return `Security scans of ${targetCount} target(s) identified ${findingCount} findings, with several high-priority issues requiring prompt remediation. While no critical vulnerabilities were found, the current security posture needs improvement to prevent potential exploitation.`;
        } else if (riskLevel === 'medium') {
            return `The security assessment of ${targetCount} target(s) uncovered ${findingCount} findings of moderate concern. The overall security posture is acceptable but would benefit from addressing the identified issues to strengthen defenses.`;
        } else {
            return `Security scans across ${targetCount} target(s) revealed ${findingCount} minor findings. The organization demonstrates a strong security posture with minimal immediate risks. Continued monitoring and maintenance are recommended.`;
        }
    }

    private static extractKeyFindings(findings: any[]): string[] {
        const keyFindings: string[] = [];

        // Group by severity and take top findings
        const critical = findings.filter(f => f.severity === 'critical').slice(0, 3);
        const high = findings.filter(f => f.severity === 'high').slice(0, 3);

        for (const finding of critical) {
            keyFindings.push(`🔴 CRITICAL: ${finding.title} - Immediate action required to prevent potential security breach`);
        }

        for (const finding of high) {
            keyFindings.push(`🟠 HIGH: ${finding.title} - Should be addressed within the next 30 days`);
        }

        if (keyFindings.length === 0) {
            keyFindings.push('✅ No critical or high-severity vulnerabilities detected');
        }

        return keyFindings;
    }

    private static generateRecommendations(findings: any[], riskLevel: string): string[] {
        const recommendations: string[] = [];

        if (riskLevel === 'critical' || riskLevel === 'high') {
            recommendations.push('Establish an immediate incident response plan to address critical vulnerabilities');
            recommendations.push('Conduct emergency patching for all systems with critical findings');
            recommendations.push('Implement network segmentation to limit potential breach impact');
            recommendations.push('Enable enhanced monitoring and logging for affected systems');
        }

        recommendations.push('Schedule regular security assessments (quarterly minimum)');
        recommendations.push('Implement a vulnerability management program');
        recommendations.push('Provide security awareness training for all staff');
        recommendations.push('Review and update security policies and procedures');

        if (findings.some(f => f.title.toLowerCase().includes('encryption'))) {
            recommendations.push('Upgrade encryption protocols to current industry standards');
        }

        if (findings.some(f => f.title.toLowerCase().includes('authentication'))) {
            recommendations.push('Implement multi-factor authentication across all systems');
        }

        return recommendations;
    }

    private static generateTechnicalSummary(scans: ScanResult[], findings: any[]): string {
        const tools = new Set(scans.map(s => s.tool));
        const avgDuration = scans.reduce((sum, s) => sum + s.duration, 0) / scans.length;

        const severityCounts = {
            critical: findings.filter(f => f.severity === 'critical').length,
            high: findings.filter(f => f.severity === 'high').length,
            medium: findings.filter(f => f.severity === 'medium').length,
            low: findings.filter(f => f.severity === 'low').length
        };

        return `Assessment utilized ${tools.size} security scanning tool(s) including ${Array.from(tools).join(', ')}. ` +
            `Total scan duration averaged ${Math.round(avgDuration)} seconds per target. ` +
            `Findings breakdown: ${severityCounts.critical} Critical, ${severityCounts.high} High, ` +
            `${severityCounts.medium} Medium, ${severityCounts.low} Low severity issues.`;
    }

    private static generateBusinessImpact(riskLevel: string, criticalCount: number, highCount: number): string {
        if (riskLevel === 'critical') {
            return `The identified vulnerabilities pose an immediate and severe risk to business operations. ` +
                `With ${criticalCount} critical issues, there is a high probability of successful cyberattacks that could result in ` +
                `data breaches, financial losses, regulatory penalties, and reputational damage. Immediate executive action is required.`;
        } else if (riskLevel === 'high') {
            return `Current security gaps present significant business risks. The ${highCount} high-severity findings could be exploited ` +
                `by threat actors, potentially leading to service disruptions, data exposure, or compliance violations. ` +
                `Prompt remediation is essential to protect business assets and maintain stakeholder trust.`;
        } else if (riskLevel === 'medium') {
            return `While no immediate threats were identified, the existing vulnerabilities could be leveraged in targeted attacks. ` +
                `Addressing these issues proactively will strengthen the organization's security posture and reduce potential ` +
                `business disruption risks.`;
        } else {
            return `The organization maintains a strong security posture with minimal business risk. Continue current security practices ` +
                `and maintain regular assessments to ensure ongoing protection of business assets and operations.`;
        }
    }

    /**
     * Format report as Markdown
     */
    static formatAsMarkdown(report: ExecutiveReport, scans: ScanResult[]): string {
        const date = new Date().toLocaleDateString();

        return `# Executive Security Assessment Report
**Date:** ${date}
**Risk Level:** ${report.riskLevel.toUpperCase()}
**Risk Score:** ${report.riskScore}/100

---

## Executive Summary

${report.summary}

---

## Risk Assessment

**Overall Risk Level:** ${report.riskLevel.toUpperCase()}

**Risk Score:** ${report.riskScore}/100

---

## Key Findings

${report.keyFindings.map((f, i) => `${i + 1}. ${f}`).join('\n')}

---

## Business Impact

${report.businessImpact}

---

## Recommendations

${report.recommendations.map((r, i) => `${i + 1}. ${r}`).join('\n')}

---

## Technical Summary

${report.technicalSummary}

**Scans Performed:** ${scans.length}
**Targets Assessed:** ${new Set(scans.map(s => s.target)).size}

---

## Next Steps

1. Review this report with key stakeholders
2. Prioritize remediation based on risk severity
3. Allocate resources for immediate critical fixes
4. Schedule follow-up assessment in 30-60 days

---

*This report was automatically generated by the NUMU AI Cybersecurity Platform*
`;
    }
}
