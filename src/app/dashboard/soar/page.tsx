"use client";

import React from "react";
import CSIRTModuleLayout from "@/components/csirt/CSIRTModuleLayout";
import { Workflow, PlayCircle, Layers, Zap } from "lucide-react";
import NeonCard from "@/components/ui/NeonCard";
import GlassCard from "@/components/ui/GlassCard";

const playbooks = [
    { name: "Phishing Response", description: "Email parse, URL scan, User quarantine", runs: 124 },
    { name: "Malware Containment", description: "Isolate host, Kill process, Dump memory", runs: 45 },
    { name: "New User Onboarding", description: "Create AD user, Assign roles, Send welcome", runs: 890 },
];

export default function SOARPage() {
    return (
        <CSIRTModuleLayout
            title="Automatización SOAR"
            description="Orquestación, Automatización y Respuesta de Seguridad."
            icon={Workflow}
            iconColor="text-orange-400"
        >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <NeonCard glowColor="cyan" className="p-6 col-span-1 lg:col-span-2">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Layers className="w-5 h-5 text-cyan-400" /> Playbooks Activos
                    </h3>
                    <div className="space-y-4">
                        {playbooks.map((pb, i) => (
                            <GlassCard key={i} className="p-4 flex items-center justify-between group hover:bg-white/5 cursor-pointer">
                                <div>
                                    <h4 className="font-bold text-white group-hover:text-cyan-400 transition-colors">{pb.name}</h4>
                                    <p className="text-xs text-gray-500">{pb.description}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-xs font-mono text-gray-400">{pb.runs} runs</span>
                                    <PlayCircle className="w-8 h-8 text-white/20 group-hover:text-cyan-400 transition-colors" />
                                </div>
                            </GlassCard>
                        ))}
                    </div>
                </NeonCard>

                <GlassCard className="p-6 flex flex-col items-center justify-center text-center">
                    <Zap className="w-16 h-16 text-yellow-400 mb-4" />
                    <h3 className="text-2xl font-bold text-white">2.4s</h3>
                    <p className="text-sm text-gray-400">Tiempo de Respuesta Promedio (MTTR)</p>
                    <div className="mt-8 text-xs text-green-400 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
                        Ahorro estimado: 450h / mes
                    </div>
                </GlassCard>
            </div>
        </CSIRTModuleLayout>
    );
}
