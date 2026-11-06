'use client';

import { useState } from 'react';
import { Crosshair, Play, AlertTriangle, Target, Zap, Shield as ShieldIcon, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { getRedTeamTools } from '@/lib/tools/security-tools-db';
import { getToolConfig } from '@/lib/tools/tool-configs';
import ToolConfigPanel from '@/components/tools/ToolConfigPanel';
import ScanResultsPanel from '@/components/tools/ScanResultsPanel';

export default function RedTeamPage() {
    const [selectedTool, setSelectedTool] = useState<string | null>(null);
    const [executionId, setExecutionId] = useState<string | null>(null);
    const [execution, setExecution] = useState<any>(null);

    const redTeamTools = getRedTeamTools();

    const selectedToolData = selectedTool ? redTeamTools.find(t => t.id === selectedTool) : null;
    const selectedToolConfig = selectedTool ? getToolConfig(selectedTool) : null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-950/20 to-gray-900 p-8">
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
                        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 shadow-[0_0_30px_rgba(220,38,38,0.3)]">
                            <Crosshair className="w-10 h-10 text-red-400" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-white mb-2">
                                Red Team - Operaciones Ofensivas
                            </h1>
                            <p className="text-gray-400 text-lg">
                                Herramientas de pentesting, explotación y simulación de ataques
                            </p>
                        </div>
                    </div>

                    {/* Warning Banner */}
                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <h3 className="text-red-400 font-semibold mb-1">Advertencia de Seguridad</h3>
                            <p className="text-gray-400 text-sm">
                                Las herramientas Red Team son para uso autorizado únicamente. El uso no autorizado puede ser ilegal.
                                Asegúrate de tener permisos explícitos antes de ejecutar cualquier escaneo o ataque.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <StatCard title="Herramientas" value={redTeamTools.length.toString()} icon={Target} color="red" />
                    <StatCard title="Escaneos Activos" value="5" icon={Zap} color="orange" />
                    <StatCard title="Vulnerabilidades" value="23" icon={AlertTriangle} color="yellow" />
                    <StatCard title="Última Actividad" value="2m" icon={Play} color="purple" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Tools List */}
                    <div className="lg:col-span-1 space-y-4">
                        <h2 className="text-xl font-bold text-white mb-4">Herramientas Disponibles</h2>
                        <div className="space-y-3">
                            {redTeamTools.map((tool) => {
                                const Icon = Crosshair;
                                const isSelected = selectedTool === tool.id;
                                const hasConfig = !!getToolConfig(tool.id);

                                return (
                                    <button
                                        key={tool.id}
                                        onClick={() => hasConfig ? setSelectedTool(tool.id) : null}
                                        disabled={!hasConfig}
                                        className={`
                                            w-full p-4 rounded-xl border-2 transition-all text-left
                                            ${isSelected
                                                ? 'bg-red-500/20 border-red-500/60 shadow-[0_0_20px_rgba(220,38,38,0.3)]'
                                                : hasConfig
                                                    ? 'bg-white/5 border-white/10 hover:border-red-500/30 hover:bg-red-500/10'
                                                    : 'bg-white/5 border-white/10 opacity-50 cursor-not-allowed'
                                            }
                                        `}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className={`p-2 rounded-lg ${isSelected ? 'bg-red-500/30' : 'bg-red-500/10'} border border-red-500/30`}>
                                                <Icon className="w-5 h-5 text-red-400" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-white mb-1">{tool.name}</h3>
                                                <p className="text-xs text-gray-400 line-clamp-2">{tool.description}</p>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <span className="text-xs px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">
                                                        {tool.difficulty}
                                                    </span>
                                                    {!hasConfig && (
                                                        <span className="text-xs text-gray-500">En desarrollo</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Tool Panel */}
                    <div className="lg:col-span-2">
                        {selectedToolData && selectedToolConfig ? (
                            <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h2 className="text-2xl font-bold text-white mb-1">{selectedToolData.name}</h2>
                                        <p className="text-gray-400">{selectedToolData.description}</p>
                                    </div>
                                    {selectedToolData.requiresDocker && (
                                        <span className="px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/30 rounded-full text-sm">
                                            🐳 Docker
                                        </span>
                                    )}
                                </div>

                                <ToolConfigPanel
                                    tool={selectedToolData}
                                    toolConfig={selectedToolConfig}
                                    onExecutionStart={(id: string) => {
                                        setExecutionId(id);
                                    }}
                                />

                                {executionId && (
                                    <div className="mt-6">
                                        <h3 className="text-lg font-bold text-white mb-4">Resultados del Escaneo</h3>
                                        <ScanResultsPanel toolId={selectedTool} execution={execution} />
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="bg-white/5 border border-white/10 rounded-xl p-12 backdrop-blur-sm text-center">
                                <ShieldIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-white mb-2">
                                    Selecciona una Herramienta
                                </h3>
                                <p className="text-gray-400">
                                    Elige una herramienta de la lista para comenzar un escaneo ofensivo
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon: Icon, color }: any) {
    const colorClasses: Record<string, string> = {
        red: "bg-red-500/10 text-red-400 border-red-500/20",
        orange: "bg-orange-500/10 text-orange-400 border-orange-500/20",
        yellow: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
        purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
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
