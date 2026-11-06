'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { Shield, TrendingUp, Clock, AlertTriangle } from 'lucide-react';

interface ExecutiveSummaryProps {
    scanData: any;
}

export function ExecutiveSummary({ scanData }: ExecutiveSummaryProps) {
    // Calculate security score (0-100)
    const calculateSecurityScore = () => {
        const findings = scanData.findings || [];
        const critical = findings.filter((f: any) => f.severity === 'critical').length;
        const high = findings.filter((f: any) => f.severity === 'high').length;
        const medium = findings.filter((f: any) => f.severity === 'medium').length;

        const penalty = (critical * 20) + (high * 10) + (medium * 5);
        return Math.max(0, 100 - penalty);
    };

    const securityScore = calculateSecurityScore();
    const findings = scanData.findings || [];

    // Severity distribution
    const severityData = [
        { name: 'Críticas', value: findings.filter((f: any) => f.severity === 'critical').length, color: '#EF4444' },
        { name: 'Altas', value: findings.filter((f: any) => f.severity === 'high').length, color: '#F97316' },
        { name: 'Medias', value: findings.filter((f: any) => f.severity === 'medium').length, color: '#F59E0B' },
        { name: 'Bajas', value: findings.filter((f: any) => f.severity === 'low').length, color: '#3B82F6' }
    ].filter(d => d.value > 0);

    // Top 3 critical findings
    const topFindings = findings
        .filter((f: any) => f.severity === 'critical' || f.severity === 'high')
        .slice(0, 3);

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-400 bg-green-500/20';
        if (score >= 60) return 'text-yellow-400 bg-yellow-500/20';
        return 'text-red-400 bg-red-500/20';
    };

    return (
        <div className="space-y-6">

            {/* AI-Generated Summary */}
            <div className="p-6 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-lg">
                <h3 className="text-lg font-bold mb-3">📋 Resumen Ejecutivo</h3>
                <p className="text-slate-300 leading-relaxed">
                    El análisis de seguridad del objetivo <strong className="text-cyan-400">{scanData.target}</strong> ha identificado{' '}
                    <strong className="text-red-400">{findings.length} hallazgos</strong> de seguridad, incluyendo{' '}
                    <strong className="text-red-400">{severityData.find(d => d.name === 'Críticas')?.value || 0} vulnerabilidades críticas</strong>{' '}
                    que requieren atención inmediata. La postura de seguridad general presenta{' '}
                    {securityScore >= 80 ? 'un nivel aceptable' : securityScore >= 60 ? 'riesgos moderados' : 'riesgos significativos'}{' '}
                    que podrían conducir a brechas de seguridad si no se remedian.
                </p>
            </div>

            {/* Security Score & Chart */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Security Score */}
                <div className={`p-6 rounded-lg border ${getScoreColor(securityScore)}`}>
                    <div className="flex items-center gap-3 mb-4">
                        <Shield className="w-8 h-8" />
                        <div>
                            <div className="text-sm opacity-80">Score de Seguridad</div>
                            <div className="text-4xl font-bold">{securityScore}/100</div>
                        </div>
                    </div>
                    <div className="h-3 bg-black/20 rounded-full overflow-hidden mb-3">
                        <div
                            className={`h-full transition-all duration-500 ${securityScore >= 80 ? 'bg-green-500' :
                                    securityScore >= 60 ? 'bg-yellow-500' :
                                        'bg-red-500'
                                }`}
                            style={{ width: `${securityScore}%` }}
                        />
                    </div>
                    <p className="text-sm opacity-80">
                        {securityScore >= 80 ? '✅ Buena postura de seguridad' :
                            securityScore >= 60 ? '⚠️ Requiere mejoras' :
                                '🚨 Acción inmediata requerida'}
                    </p>
                </div>

                {/* Severity Distribution Chart */}
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-lg">
                    <h4 className="font-bold mb-4">Distribución por Severidad</h4>
                    {severityData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                                <Pie
                                    data={severityData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, value }) => `${name}: ${value}`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {severityData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-[200px] flex items-center justify-center text-slate-500">
                            No se encontraron vulnerabilidades
                        </div>
                    )}
                </div>

            </div>

            {/* Top 3 Critical Findings */}
            {topFindings.length > 0 && (
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-lg">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-red-400" />
                        Top 3 Vulnerabilidades Críticas
                    </h3>
                    <div className="space-y-3">
                        {topFindings.map((finding: any, idx: number) => (
                            <div key={idx} className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                                <div className="flex items-start gap-3">
                                    <div className="text-2xl font-bold text-red-400">#{idx + 1}</div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-red-400 mb-1">{finding.title}</h4>
                                        <p className="text-sm text-slate-300 mb-2">{finding.description}</p>
                                        <div className="flex items-center gap-2 text-xs">
                                            <span className="px-2 py-1 bg-red-500 text-white rounded font-bold uppercase">
                                                {finding.severity}
                                            </span>
                                            {finding.cvss && (
                                                <span className="text-slate-400">CVSS: {finding.cvss}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Remediation Timeline */}
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-lg">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-cyan-400" />
                    Tiempo Estimado de Remediación
                </h3>
                <div className="space-y-3">
                    <div className="flex items-center gap-4">
                        <div className="w-32 text-sm text-slate-400">Críticas:</div>
                        <div className="flex-1 h-8 bg-slate-800 rounded-lg overflow-hidden">
                            <div className="h-full bg-red-500 flex items-center px-3 text-sm font-medium" style={{ width: '100%' }}>
                                Inmediato (0-7 días)
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-32 text-sm text-slate-400">Altas:</div>
                        <div className="flex-1 h-8 bg-slate-800 rounded-lg overflow-hidden">
                            <div className="h-full bg-orange-500 flex items-center px-3 text-sm font-medium" style={{ width: '75%' }}>
                                30 días
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-32 text-sm text-slate-400">Medias:</div>
                        <div className="flex-1 h-8 bg-slate-800 rounded-lg overflow-hidden">
                            <div className="h-full bg-yellow-500 flex items-center px-3 text-sm font-medium" style={{ width: '50%' }}>
                                90 días
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
