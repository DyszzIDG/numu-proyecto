'use client';

import { useState } from 'react';
import { Shield, Eye, Activity, CheckCircle, AlertCircle, ArrowLeft, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { getBlueTeamTools } from '@/lib/tools/security-tools-db';

export default function BlueTeamPage() {
    const [selectedTool, setSelectedTool] = useState<string | null>(null);

    const blueTeamTools = getBlueTeamTools();
    const selectedToolData = selectedTool ? blueTeamTools.find(t => t.id === selectedTool) : null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-950/20 to-gray-900 p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div>
                    <Link
                        href="/dashboard/escaneo"
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Volver a Selección de Equipos
                    </Link>

                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 shadow-[0_0_30px_rgba(37,99,235,0.3)]">
                            <Shield className="w-10 h-10 text-blue-400" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-white mb-2">
                                Blue Team - Operaciones Defensivas
                            </h1>
                            <p className="text-gray-400 text-lg">
                                Herramientas de monitoreo, detección y respuesta a incidentes
                            </p>
                        </div>
                    </div>

                    {/* Info Banner */}
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 flex items-start gap-3">
                        <Shield className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <h3 className="text-blue-400 font-semibold mb-1">Postura Defensiva Activa</h3>
                            <p className="text-gray-400 text-sm">
                                Monitorea, detecta y responde a amenazas en tiempo real. Mantén tus sistemas seguros y conformes.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stats Dashboard */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <StatCard title="Sistemas Monitoreados" value="48" icon={Eye} color="blue" />
                    <StatCard title="Alertas Activas" value="12" icon={AlertCircle} color="yellow" />
                    <StatCard title="Score de Seguridad" value="85%" icon={CheckCircle} color="green" />
                    <StatCard title="Tendencia" value="+5%" icon={TrendingUp} color="cyan" />
                </div>

                {/* Security Metrics */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
                        <h3 className="text-lg font-bold text-white mb-4">Estado de Protección</h3>
                        <div className="space-y-3">
                            <MetricBar label="Firewall" percentage={100} color="green" />
                            <MetricBar label="IDS/IPS" percentage={95} color="green" />
                            <MetricBar label="Antivirus" percentage={100} color="green" />
                            <MetricBar label="File Integrity" percentage={88} color="yellow" />
                        </div>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
                        <h3 className="text-lg font-bold text-white mb-4">Alertas Recientes</h3>
                        <div className="space-y-3">
                            <AlertItem severity="medium" message="Intento de fuerza bruta bloqueado" time="5m" />
                            <AlertItem severity="low" message="Actualización de firma disponible" time="15m" />
                            <AlertItem severity="high" message="Archivo modificado detectado" time="1h" />
                            <AlertItem severity="low" message="Escaneo de puertos detectado" time="2h" />
                        </div>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
                        <h3 className="text-lg font-bold text-white mb-4">Compliance Status</h3>
                        <div className="space-y-3">
                            <ComplianceItem standard="CIS Benchmark" status="compliant" score="92%" />
                            <ComplianceItem standard="PCI DSS" status="compliant" score="88%" />
                            <ComplianceItem standard="ISO 27001" status="partial" score="75%" />
                            <ComplianceItem standard="NIST CSF" status="compliant" score="90%" />
                        </div>
                    </div>
                </div>

                {/* Tools Section */}
                <div>
                    <h2 className="text-2xl font-bold text-white mb-6">Herramientas Defensivas</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {blueTeamTools.map((tool) => {
                            const isSelected = selectedTool === tool.id;

                            return (
                                <button
                                    key={tool.id}
                                    onClick={() => setSelectedTool(tool.id)}
                                    className={`
                                        p-6 rounded-xl border-2 transition-all text-left
                                        ${isSelected
                                            ? 'bg-blue-500/20 border-blue-500/60 shadow-[0_0_20px_rgba(37,99,235,0.3)]'
                                            : 'bg-white/5 border-white/10 hover:border-blue-500/30 hover:bg-blue-500/10'
                                        }
                                    `}
                                >
                                    <div className="flex items-start gap-3 mb-3">
                                        <div className={`p-2 rounded-lg ${isSelected ? 'bg-blue-500/30' : 'bg-blue-500/10'} border border-blue-500/30`}>
                                            <Shield className="w-5 h-5 text-blue-400" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-white mb-1">{tool.name}</h3>
                                            <span className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                                                {tool.difficulty}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-400 mb-3">{tool.description}</p>
                                    <div className="flex flex-wrap gap-1">
                                        {tool.tags.slice(0, 3).map((tag, idx) => (
                                            <span key={idx} className="text-xs px-2 py-0.5 rounded bg-white/5 text-gray-500">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Tool Details */}
                {selectedToolData && (
                    <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
                        <h2 className="text-2xl font-bold text-white mb-4">{selectedToolData.name}</h2>
                        <p className="text-gray-400 mb-6">{selectedToolData.description}</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-3">Información</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Categoría:</span>
                                        <span className="text-white">{selectedToolData.category}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Dificultad:</span>
                                        <span className="text-white capitalize">{selectedToolData.difficulty}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Requiere Docker:</span>
                                        <span className="text-white">{selectedToolData.requiresDocker ? 'Sí' : 'No'}</span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-3">Tags</h3>
                                <div className="flex flex-wrap gap-2">
                                    {selectedToolData.tags.map((tag, idx) => (
                                        <span key={idx} className="px-3 py-1 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/30 text-sm">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                            <p className="text-yellow-400 text-sm">
                                <strong>Nota:</strong> La configuración completa de esta herramienta estará disponible próximamente.
                                Por ahora, puedes usar las herramientas Red Team que ya están configuradas.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function StatCard({ title, value, icon: Icon, color }: any) {
    const colorClasses: Record<string, string> = {
        blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
        yellow: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
        green: "bg-green-500/10 text-green-400 border-green-500/20",
        cyan: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    };

    return (
        <div className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all backdrop-blur-sm group">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <p className="text-gray-400 text-sm font-medium">{title}</p>
                    <h3 className="text-3xl font-bold mt-1 text-white">{value}</h3>
                </div>
                <div className={`p-3 rounded-lg ${colorClasses[color]} group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>
        </div>
    );
}

function MetricBar({ label, percentage, color }: { label: string; percentage: number; color: 'green' | 'yellow' | 'red' }) {
    const colorClasses = {
        green: 'bg-green-500',
        yellow: 'bg-yellow-500',
        red: 'bg-red-500'
    };

    return (
        <div>
            <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">{label}</span>
                <span className="text-white font-semibold">{percentage}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
                <div className={`${colorClasses[color]} h-2 rounded-full transition-all`} style={{ width: `${percentage}%` }} />
            </div>
        </div>
    );
}

function AlertItem({ severity, message, time }: { severity: 'low' | 'medium' | 'high'; message: string; time: string }) {
    const severityColors = {
        low: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        high: 'bg-red-500/20 text-red-400 border-red-500/30'
    };

    return (
        <div className="flex items-start gap-3 p-3 rounded-lg bg-black/20 border border-white/5">
            <div className={`w-2 h-2 rounded-full mt-1.5 ${severityColors[severity].split(' ')[1].replace('text-', 'bg-')}`} />
            <div className="flex-1">
                <p className="text-sm text-white">{message}</p>
                <p className="text-xs text-gray-500 mt-1">Hace {time}</p>
            </div>
        </div>
    );
}

function ComplianceItem({ standard, status, score }: { standard: string; status: 'compliant' | 'partial' | 'non-compliant'; score: string }) {
    const statusConfig = {
        compliant: { color: 'text-green-400', icon: '✓' },
        partial: { color: 'text-yellow-400', icon: '⚠' },
        'non-compliant': { color: 'text-red-400', icon: '✗' }
    };

    const config = statusConfig[status];

    return (
        <div className="flex items-center justify-between p-3 rounded-lg bg-black/20 border border-white/5">
            <div className="flex items-center gap-2">
                <span className={`${config.color} font-bold`}>{config.icon}</span>
                <span className="text-sm text-white">{standard}</span>
            </div>
            <span className={`text-sm font-semibold ${config.color}`}>{score}</span>
        </div>
    );
}
