"use client";

import React from "react";
import CSIRTModuleLayout from "@/components/csirt/CSIRTModuleLayout";
import { Code, Globe, Shield, Terminal } from "lucide-react";
import NeonCard from "@/components/ui/NeonCard";
import GlassCard from "@/components/ui/GlassCard";

export default function AppProtectionPage() {
    return (
        <CSIRTModuleLayout
            title="App Protection"
            description="Seguridad WAF, RASP y análisis de código estático para aplicaciones."
            icon={Code}
            iconColor="text-teal-400"
        >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <NeonCard glowColor="cyan" className="p-6">
                    <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                        <Globe className="w-5 h-5 text-teal-400" /> WAF Status
                    </h3>
                    <div className="space-y-3">
                        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                            <div className="h-full w-[80%] bg-teal-400 shadow-[0_0_10px_#2dd4bf]" />
                        </div>
                        <p className="text-xs text-right text-teal-400">2.5M Req / Filtered</p>
                    </div>
                </NeonCard>

                <NeonCard glowColor="magenta" className="p-6 col-span-2">
                    <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                        <Terminal className="w-5 h-5 text-teal-400" /> Pipeline Security (DevSecOps)
                    </h3>
                    <div className="flex gap-4 overflow-x-auto pb-2">
                        {['Build #4052', 'Build #4053', 'Build #4054'].map((b, i) => (
                            <GlassCard key={i} className="min-w-[150px] p-3 text-center">
                                <p className="text-sm font-bold text-white mb-1">{b}</p>
                                <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded">PASSED</span>
                            </GlassCard>
                        ))}
                    </div>
                </NeonCard>
            </div>
        </CSIRTModuleLayout>
    );
}
