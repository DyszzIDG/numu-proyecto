"use client";

import React from "react";
import CSIRTModuleLayout from "@/components/csirt/CSIRTModuleLayout";
import { Server, Cloud, Network, Wifi } from "lucide-react";
import NeonCard from "@/components/ui/NeonCard";
import GlassCard from "@/components/ui/GlassCard";

export default function InfrastructurePage() {
    return (
        <CSIRTModuleLayout
            title="Infraestructura y Red"
            description="Monitoreo de servidores, nube y segmentos de red críticos."
            icon={Server}
            iconColor="text-slate-300"
        >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <NeonCard glowColor="cyan" className="p-6">
                    <h3 className="font-bold text-white mb-6 flex items-center gap-2">
                        <Cloud className="w-5 h-5 text-cyan-400" /> Nube Híbrida
                    </h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center bg-white/5 p-3 rounded">
                            <span className="text-sm text-gray-300">AWS (us-east-1)</span>
                            <span className="text-xs text-green-400 font-bold">HEALTHY</span>
                        </div>
                        <div className="flex justify-between items-center bg-white/5 p-3 rounded">
                            <span className="text-sm text-gray-300">Azure (Brazil South)</span>
                            <span className="text-xs text-green-400 font-bold">HEALTHY</span>
                        </div>
                    </div>
                </NeonCard>

                <NeonCard glowColor="magenta" className="p-6">
                    <h3 className="font-bold text-white mb-6 flex items-center gap-2">
                        <Network className="w-5 h-5 text-purple-400" /> Segmentos Críticos
                    </h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center bg-white/5 p-3 rounded">
                            <span className="text-sm text-gray-300">VLAN 10 (Management)</span>
                            <span className="text-xs text-green-400 font-bold">SECURE</span>
                        </div>
                        <div className="flex justify-between items-center bg-white/5 p-3 rounded">
                            <span className="text-sm text-gray-300">VLAN 20 (Production)</span>
                            <span className="text-xs text-yellow-400 font-bold">TRAFFIC SPIKE</span>
                        </div>
                    </div>
                </NeonCard>
            </div>
        </CSIRTModuleLayout>
    );
}
