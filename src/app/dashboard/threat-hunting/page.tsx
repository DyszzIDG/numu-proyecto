"use client";

import React, { useEffect, useState, useTransition } from "react";
import CSIRTModuleLayout from "@/components/csirt/CSIRTModuleLayout";
import { Radar, Crosshair, Target, Database, ShieldAlert, Tag, RefreshCw } from "lucide-react";
import NeonCard from "@/components/ui/NeonCard";
import GlassCard from "@/components/ui/GlassCard";
import { getThreatHuntingData, ThreatHuntingData } from "./actions";

export default function ThreatHuntingPage() {
    const [data, setData] = useState<ThreatHuntingData | null>(null);
    const [loading, setLoading] = useState(true);
    const [isPending, startTransition] = useTransition();

    const loadData = () => {
        startTransition(async () => {
            try {
                const res = await getThreatHuntingData();
                setData(res);
            } catch (err) {
                console.error("Failed to load threat hunting data:", err);
            } finally {
                setLoading(false);
            }
        });
    };

    useEffect(() => {
        loadData();
    }, []);

    const threats = data?.threats || [];
    const kqlQueries = data?.kqlQueries || [];
    const targetEndpoints = data?.targetEndpoints || [];

    return (
        <CSIRTModuleLayout
            title="Threat Hunting Proactivo"
            description="Búsqueda anticipada de indicadores de compromiso (IoCs), tácticas adversarias (TTPs) y anomalías."
            icon={Crosshair}
            iconColor="text-green-400"
        >
            <div className="flex justify-end mb-4">
                <button
                    onClick={loadData}
                    disabled={isPending}
                    className="px-3 py-1.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-lg text-xs flex items-center gap-2 transition"
                >
                    <RefreshCw className={`h-3.5 w-3.5 ${isPending ? 'animate-spin text-green-400' : ''}`} />
                    <span>Actualizar IoCs</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3 space-y-6">
                    {/* Active Radar Scanner */}
                    <NeonCard glowColor="green" className="min-h-[260px] flex items-center justify-center relative overflow-hidden p-6">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-900/20 via-transparent to-transparent animate-pulse" />
                        <div className="text-center relative z-10">
                            <Radar className="w-16 h-16 text-green-500 mx-auto mb-4 animate-[spin_4s_linear_infinite]" />
                            <h2 className="text-2xl font-bold text-white tracking-tight">Escaneo Continuo de IoCs</h2>
                            <p className="text-green-400 font-mono text-xs mt-2">
                                Correlacionando logs con {threats.length} campañas activas de Threat Intel
                            </p>
                        </div>
                    </NeonCard>

                    {/* Threat Intelligence Feed from DB */}
                    <GlassCard className="p-6">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <ShieldAlert className="w-5 h-5 text-amber-400" /> Inteligencia de Amenazas Activa (DB)
                        </h3>
                        {loading ? (
                            <p className="text-xs text-slate-500 font-mono py-4 text-center animate-pulse">
                                Consultando base de datos de inteligencia...
                            </p>
                        ) : threats.length === 0 ? (
                            <p className="text-xs text-slate-500 py-4 text-center">
                                No hay campañas registradas actualmente.
                            </p>
                        ) : (
                            <div className="space-y-4">
                                {threats.map((threat) => (
                                    <div key={threat.id} className="p-4 rounded-lg bg-black/40 border border-slate-800 hover:border-slate-700 transition">
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                                                        threat.severity === 'CRITICAL' ? 'bg-red-900/40 text-red-400 border border-red-800' :
                                                        threat.severity === 'HIGH' ? 'bg-orange-900/40 text-orange-400 border border-orange-800' :
                                                        'bg-yellow-900/40 text-yellow-400 border border-yellow-800'
                                                    }`}>
                                                        {threat.severity}
                                                    </span>
                                                    <h4 className="text-sm font-bold text-white">{threat.title}</h4>
                                                </div>
                                                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{threat.description}</p>
                                            </div>
                                            <span className="text-xs font-mono text-cyan-400 whitespace-nowrap bg-cyan-950/40 px-2 py-1 rounded border border-cyan-900">
                                                {threat.confidence}% Confianza
                                            </span>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-slate-800/80">
                                            <span className="text-[11px] text-slate-500 font-mono">Técnicas MITRE:</span>
                                            {threat.techniques.map((tech, idx) => (
                                                <span key={idx} className="px-2 py-0.5 bg-slate-900 text-slate-300 text-[10px] font-mono rounded border border-slate-700">
                                                    {tech}
                                                </span>
                                            ))}
                                            {threat.threatActor && (
                                                <span className="text-[11px] text-purple-400 font-mono ml-auto">
                                                    Actor: {threat.threatActor}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </GlassCard>

                    {/* KQL Queries */}
                    <GlassCard className="p-6">
                        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                            <Database className="w-4 h-4 text-cyan-400" /> Consultas de Caza Estandarizadas (KQL / SIEM)
                        </h3>
                        <div className="space-y-2.5">
                            {kqlQueries.map((query, i) => (
                                <div key={i} className="p-3 bg-black/50 rounded-lg border border-slate-800/80 font-mono text-xs text-slate-300 overflow-x-auto">
                                    <code>{query}</code>
                                </div>
                            ))}
                        </div>
                    </GlassCard>
                </div>

                {/* Right Column: Top Target Assets */}
                <div className="space-y-6">
                    <GlassCard className="p-6">
                        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                            <Target className="w-4 h-4 text-red-400" /> Activos de Alto Valor (HVA)
                        </h3>
                        <ul className="space-y-3 text-xs font-mono text-slate-300">
                            {targetEndpoints.map((target, idx) => (
                                <li key={idx} className="flex items-center gap-2 p-2 rounded bg-slate-900/60 border border-slate-800/60">
                                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                                    <span>{target}</span>
                                </li>
                            ))}
                        </ul>
                    </GlassCard>

                    <GlassCard className="p-6">
                        <h3 className="font-bold text-white mb-3 text-sm">Estado de Integración SIEM</h3>
                        <div className="space-y-2 text-xs text-slate-400">
                            <div className="flex justify-between py-1 border-b border-slate-800">
                                <span>Conector Microsoft Sentinel</span>
                                <span className="text-green-400 font-mono">Activo</span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-slate-800">
                                <span>Agent Wazuh EDR</span>
                                <span className="text-green-400 font-mono">142/142</span>
                            </div>
                            <div className="flex justify-between py-1">
                                <span>Feed de Inteligencia</span>
                                <span className="text-cyan-400 font-mono">Sincronizado</span>
                            </div>
                        </div>
                    </GlassCard>
                </div>
            </div>
        </CSIRTModuleLayout>
    );
}
