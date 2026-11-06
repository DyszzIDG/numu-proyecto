"use client";

import React from "react";
import CSIRTModuleLayout from "@/components/csirt/CSIRTModuleLayout";
import { Building2, Users, Briefcase, Key } from "lucide-react";
import NeonCard from "@/components/ui/NeonCard";
import GlassCard from "@/components/ui/GlassCard";

export default function EnterpriseSecurityPage() {
    return (
        <CSIRTModuleLayout
            title="Seguridad Empresarial"
            description="Protección corporativa, cumplimiento y gestión de riesgos."
            icon={Building2}
            iconColor="text-indigo-400"
        >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <GlassCard className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Users className="w-5 h-5 text-indigo-400" />
                        <h3 className="font-bold text-white">Empleados</h3>
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">1,240</div>
                    <p className="text-xs text-gray-400">Protegidos (EDR + Email)</p>
                </GlassCard>

                <GlassCard className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Key className="w-5 h-5 text-yellow-400" />
                        <h3 className="font-bold text-white">Accesos VIP</h3>
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">12</div>
                    <p className="text-xs text-red-400">Alertas de anomalía (24h)</p>
                </GlassCard>

                <GlassCard className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Briefcase className="w-5 h-5 text-green-400" />
                        <h3 className="font-bold text-white">Cumplimiento</h3>
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">94%</div>
                    <p className="text-xs text-gray-400">ISO 27001 / GDPR</p>
                </GlassCard>
            </div>
        </CSIRTModuleLayout>
    );
}
