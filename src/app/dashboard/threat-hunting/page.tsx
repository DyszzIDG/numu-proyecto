"use client";

import React from "react";
import CSIRTModuleLayout from "@/components/csirt/CSIRTModuleLayout";
import { Radar, Crosshair, Target, Database } from "lucide-react";
import NeonCard from "@/components/ui/NeonCard";
import GlassCard from "@/components/ui/GlassCard";

export default function ThreatHuntingPage() {
    return (
        <CSIRTModuleLayout
            title="Threat Hunting"
            description="Búsqueda proactiva de amenazas ocultas en la red."
            icon={Crosshair}
            iconColor="text-green-400"
        >
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3 space-y-6">
                    <NeonCard glowColor="green" className="min-h-[300px] flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-900/20 via-transparent to-transparent animate-pulse" />
                        <div className="text-center relative z-10">
                            <Radar className="w-16 h-16 text-green-500 mx-auto mb-4 animate-[spin_4s_linear_infinite]" />
                            <h2 className="text-2xl font-bold text-white">Escaneo Activo</h2>
                            <p className="text-green-400 font-mono text-sm mt-2">Buscando IoCs en 142 endpoints...</p>
                        </div>
                    </NeonCard>

                    <GlassCard className="p-6">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <Database className="w-4 h-4 text-gray-400" /> Consultas Recientes (KQL/SPL)
                        </h3>
                        <div className="space-y-2">
                            {[1, 2, 3].map((_, i) => (
                                <div key={i} className="p-3 bg-black/40 rounded border border-white/5 font-mono text-xs text-gray-300 truncate">
                                    ProcessEvents | where ProcessName == "powershell.exe" | where CommandLine has "EncodedCommand"
                                </div>
                            ))}
                        </div>
                    </GlassCard>
                </div>

                <div className="space-y-6">
                    <GlassCard className="p-6">
                        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                            <Target className="w-4 h-4 text-red-400" /> Top Objetivos
                        </h3>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li>• Domain Controller 01</li>
                            <li>• File Server HR</li>
                            <li>• Gateway VPN</li>
                        </ul>
                    </GlassCard>
                </div>
            </div>
        </CSIRTModuleLayout>
    );
}
