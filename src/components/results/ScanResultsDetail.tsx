'use client';

import React, { useState } from 'react';
import { FileText, Bug, Code, Lightbulb, TrendingDown, TrendingUp, Shield } from 'lucide-react';
import { ExecutiveSummary } from './ExecutiveSummary';
import { VulnerabilityTable } from './VulnerabilityTable';

interface ScanResultsDetailProps {
    scanId: string;
    scanData: any;
}

export function ScanResultsDetail({ scanId, scanData }: ScanResultsDetailProps) {
    const [activeTab, setActiveTab] = useState<'executive' | 'vulnerabilities' | 'technical' | 'recommendations'>('executive');

    const tabs = [
        { id: 'executive', label: 'Resumen Ejecutivo', icon: FileText },
        { id: 'vulnerabilities', label: 'Vulnerabilidades', icon: Bug },
        { id: 'technical', label: 'Detalles Técnicos', icon: Code },
        { id: 'recommendations', label: 'Recomendaciones IA', icon: Lightbulb }
    ];

    return (
        <div className="space-y-6">

            {/* Tabs */}
            <div className="flex items-center gap-2 p-1 bg-slate-900 border border-slate-800 rounded-lg overflow-x-auto">
                {tabs.map(tab => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition whitespace-nowrap ${activeTab === tab.id
                                    ? 'bg-cyan-600 text-white'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                }`}
                        >
                            <Icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Tab Content */}
            <div className="min-h-[600px]">
                {activeTab === 'executive' && <ExecutiveSummary scanData={scanData} />}
                {activeTab === 'vulnerabilities' && <VulnerabilityTable vulnerabilities={scanData.findings || []} />}
                {activeTab === 'technical' && <TechnicalDetails scanData={scanData} />}
                {activeTab === 'recommendations' && <AIRecommendations scanData={scanData} />}
            </div>

        </div>
    );
}

// Technical Details Component
function TechnicalDetails({ scanData }: { scanData: any }) {
    return (
        <div className="space-y-6">

            {/* Scan Info */}
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-lg">
                <h3 className="text-lg font-bold mb-4">Información del Escaneo</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <span className="text-slate-400">Herramienta:</span>
                        <span className="ml-2 font-mono">{scanData.tool}</span>
                    </div>
                    <div>
                        <span className="text-slate-400">Duración:</span>
                        <span className="ml-2">{scanData.duration}s</span>
                    </div>
                    <div>
                        <span className="text-slate-400">Objetivo:</span>
                        <span className="ml-2 font-mono">{scanData.target}</span>
                    </div>
                    <div>
                        <span className="text-slate-400">Timestamp:</span>
                        <span className="ml-2">{new Date(scanData.timestamp).toLocaleString()}</span>
                    </div>
                </div>
            </div>

            {/* Raw Output */}
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-lg">
                <div className="flex items-center gap-2 mb-4">
                    <Code className="w-5 h-5 text-cyan-400" />
                    <h3 className="text-lg font-bold">Output Crudo</h3>
                </div>
                <div className="p-4 bg-slate-950 border border-slate-700 rounded-lg overflow-x-auto">
                    <pre className="text-xs text-green-400 font-mono whitespace-pre-wrap">
                        {scanData.rawOutput || 'No hay output disponible'}
                    </pre>
                </div>
            </div>

            {/* Commands Executed */}
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-lg">
                <h3 className="text-lg font-bold mb-4">Comandos Ejecutados</h3>
                <div className="space-y-2">
                    {scanData.commands?.map((cmd: string, idx: number) => (
                        <div key={idx} className="p-3 bg-slate-950 border border-slate-700 rounded font-mono text-sm text-cyan-400">
                            $ {cmd}
                        </div>
                    )) || <p className="text-slate-500">No hay comandos registrados</p>}
                </div>
            </div>

        </div>
    );
}

// AI Recommendations Component
function AIRecommendations({ scanData }: { scanData: any }) {
    const recommendations = [
        {
            priority: 'critical',
            title: 'Actualizar Apache a versión 2.4.52+',
            effort: 'Bajo',
            impact: 'Alto',
            description: 'Se detectó Apache 2.4.49 con vulnerabilidad CVE-2021-41773. Actualizar inmediatamente.',
            steps: [
                'Hacer backup de la configuración actual',
                'Descargar Apache 2.4.52 o superior',
                'Aplicar actualización',
                'Verificar configuración',
                'Reiniciar servicio'
            ]
        },
        {
            priority: 'high',
            title: 'Implementar HTTPS en todos los endpoints',
            effort: 'Medio',
            impact: 'Alto',
            description: 'Se detectaron servicios HTTP sin cifrado. Implementar TLS 1.3.',
            steps: [
                'Obtener certificado SSL (Let\'s Encrypt)',
                'Configurar servidor web para HTTPS',
                'Redirigir HTTP a HTTPS',
                'Habilitar HSTS',
                'Verificar configuración SSL'
            ]
        }
    ];

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
            case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
            case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
            default: return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
        }
    };

    return (
        <div className="space-y-6">

            {/* Priority Matrix */}
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-lg">
                <h3 className="text-lg font-bold mb-4">Matriz de Priorización</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                        <div className="text-2xl font-bold text-red-400 mb-1">2</div>
                        <div className="text-sm text-slate-400">Críticas - Acción Inmediata</div>
                    </div>
                    <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                        <div className="text-2xl font-bold text-orange-400 mb-1">5</div>
                        <div className="text-sm text-slate-400">Altas - 30 días</div>
                    </div>
                    <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                        <div className="text-2xl font-bold text-yellow-400 mb-1">8</div>
                        <div className="text-sm text-slate-400">Medias - 90 días</div>
                    </div>
                    <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                        <div className="text-2xl font-bold text-blue-400 mb-1">12</div>
                        <div className="text-sm text-slate-400">Bajas - Backlog</div>
                    </div>
                </div>
            </div>

            {/* Recommendations List */}
            <div className="space-y-4">
                {recommendations.map((rec, idx) => (
                    <div key={idx} className={`p-6 border rounded-lg ${getPriorityColor(rec.priority)}`}>

                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <Lightbulb className="w-5 h-5" />
                                    <h4 className="font-bold text-lg">{rec.title}</h4>
                                </div>
                                <p className="text-sm opacity-90">{rec.description}</p>
                            </div>
                            <div className="text-right">
                                <div className="text-xs opacity-60 mb-1">Esfuerzo</div>
                                <div className="font-bold">{rec.effort}</div>
                            </div>
                        </div>

                        {/* Impact */}
                        <div className="flex items-center gap-2 mb-4 text-sm">
                            <Shield className="w-4 h-4" />
                            <span className="opacity-80">Impacto: {rec.impact}</span>
                        </div>

                        {/* Steps Checklist */}
                        <div>
                            <div className="text-sm font-medium opacity-80 mb-2">Pasos de Remediación:</div>
                            <div className="space-y-2">
                                {rec.steps.map((step, stepIdx) => (
                                    <label key={stepIdx} className="flex items-start gap-2 text-sm opacity-90">
                                        <input type="checkbox" className="mt-1 rounded border-current" />
                                        <span>{step}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                    </div>
                ))}
            </div>

        </div>
    );
}
