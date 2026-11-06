'use client';

/**
 * AI Insights Component
 * Displays AI-generated analysis and recommendations
 */

import { Shield, AlertTriangle, CheckCircle, Info, TrendingUp, Lightbulb } from 'lucide-react';

interface Vulnerability {
    title: string;
    severity: 'info' | 'low' | 'medium' | 'high' | 'critical';
    description: string;
    recommendation: string;
    cvss?: number;
}

interface AIInsightsProps {
    analysis: {
        summary: string;
        riskLevel: 'low' | 'medium' | 'high' | 'critical';
        vulnerabilities: Vulnerability[];
        recommendations: string[];
        insights: string[];
    };
}

export default function AIInsights({ analysis }: AIInsightsProps) {
    const getRiskColor = (level: string) => {
        const colors: Record<string, { bg: string; border: string; text: string }> = {
            low: { bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-400' },
            medium: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', text: 'text-yellow-400' },
            high: { bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-400' },
            critical: { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400' },
        };
        return colors[level] || colors.medium;
    };

    const getSeverityIcon = (severity: string) => {
        switch (severity) {
            case 'critical':
            case 'high':
                return <AlertTriangle className="w-5 h-5" />;
            case 'medium':
                return <Info className="w-5 h-5" />;
            case 'low':
            case 'info':
                return <CheckCircle className="w-5 h-5" />;
            default:
                return <Info className="w-5 h-5" />;
        }
    };

    const riskColors = getRiskColor(analysis.riskLevel);

    return (
        <div className="space-y-6">
            {/* AI Analysis Header */}
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                    <Shield className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-white">AI Security Analysis</h2>
                    <p className="text-sm text-gray-400">Powered by advanced AI threat detection</p>
                </div>
            </div>

            {/* Executive Summary */}
            <div className={`p-6 rounded-xl border ${riskColors.bg} ${riskColors.border}`}>
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-2">Executive Summary</h3>
                        <p className="text-gray-300 leading-relaxed">{analysis.summary}</p>
                    </div>
                    <div className={`px-4 py-2 rounded-lg ${riskColors.bg} border ${riskColors.border}`}>
                        <div className="text-xs text-gray-400 mb-1">Risk Level</div>
                        <div className={`text-xl font-bold ${riskColors.text} uppercase`}>
                            {analysis.riskLevel}
                        </div>
                    </div>
                </div>
            </div>

            {/* Vulnerabilities */}
            {analysis.vulnerabilities.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-orange-400" />
                        Vulnerabilities Found ({analysis.vulnerabilities.length})
                    </h3>
                    <div className="space-y-3">
                        {analysis.vulnerabilities.map((vuln, idx) => {
                            const severityColors = getRiskColor(vuln.severity);
                            return (
                                <div
                                    key={idx}
                                    className={`p-4 rounded-lg border ${severityColors.bg} ${severityColors.border}`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={severityColors.text}>
                                            {getSeverityIcon(vuln.severity)}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="font-semibold text-white">{vuln.title}</h4>
                                                <div className="flex items-center gap-2">
                                                    {vuln.cvss && (
                                                        <span className="text-xs px-2 py-1 bg-white/10 rounded text-gray-300">
                                                            CVSS: {vuln.cvss}
                                                        </span>
                                                    )}
                                                    <span
                                                        className={`text-xs px-2 py-1 rounded font-semibold uppercase ${severityColors.text}`}
                                                    >
                                                        {vuln.severity}
                                                    </span>
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-300 mb-3">{vuln.description}</p>
                                            <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                                                <p className="text-xs text-gray-400 mb-1 font-semibold">
                                                    💡 Recommendation:
                                                </p>
                                                <p className="text-sm text-gray-300">{vuln.recommendation}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Recommendations */}
            {analysis.recommendations.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-yellow-400" />
                        Recommendations
                    </h3>
                    <div className="space-y-2">
                        {analysis.recommendations.map((rec, idx) => (
                            <div
                                key={idx}
                                className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg flex items-start gap-3"
                            >
                                <div className="text-blue-400 font-bold text-lg">{idx + 1}.</div>
                                <p className="text-gray-300 flex-1">{rec}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Insights */}
            {analysis.insights.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-purple-400" />
                        Key Insights
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {analysis.insights.map((insight, idx) => (
                            <div
                                key={idx}
                                className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg"
                            >
                                <p className="text-sm text-gray-300">{insight}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* No Issues Found */}
            {analysis.vulnerabilities.length === 0 && (
                <div className="p-6 bg-green-500/10 border border-green-500/30 rounded-lg text-center">
                    <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-white mb-2">No Critical Issues Found</h3>
                    <p className="text-gray-300">
                        The scan completed successfully with no major vulnerabilities detected.
                    </p>
                </div>
            )}
        </div>
    );
}
