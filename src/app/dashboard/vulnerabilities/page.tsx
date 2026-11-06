"use client";

import React from "react";
import CSIRTModuleLayout from "@/components/csirt/CSIRTModuleLayout";
import { Bug, AlertCircle, ShieldCheck, List } from "lucide-react";
import NeonCard from "@/components/ui/NeonCard";
import GlassCard from "@/components/ui/GlassCard";
import RecentScansTable from "@/components/dashboard/RecentScansTable";

const vulns = [
    { cve: "CVE-2025-1025", severity: "CRITICAL", name: "RCE in WebLogic", score: 9.8 },
    { cve: "CVE-2025-0988", severity: "HIGH", name: "SQL Injection in Login", score: 8.2 },
    { cve: "CVE-2025-0012", severity: "MEDIUM", name: "XSS Stored", score: 5.4 },
];

export default function VulnerabilitiesPage() {
    return (
        <CSIRTModuleLayout
            title="Gestión de Vulnerabilidades"
            description="Detección, priorización y remediación de fallos de seguridad."
            icon={Bug}
            iconColor="text-yellow-400"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <NeonCard glowColor="magenta" className="p-6">
                    <p className="text-xs text-gray-400 uppercase">Puntaje de Riesgo</p>
                    <h2 className="text-4xl font-bold text-white mt-2">B+</h2>
                </NeonCard>
                <GlassCard className="p-6 flex flex-col justify-center">
                    <p className="text-xs text-gray-400 uppercase">Vulns Críticas</p>
                    <h2 className="text-3xl font-bold text-red-500 mt-2">12</h2>
                </GlassCard>
                <GlassCard className="p-6 flex flex-col justify-center">
                    <p className="text-xs text-gray-400 uppercase">Vulns Altas</p>
                    <h2 className="text-3xl font-bold text-orange-500 mt-2">45</h2>
                </GlassCard>
                <GlassCard className="p-6 flex flex-col justify-center">
                    <p className="text-xs text-gray-400 uppercase">Mitigadas (Mes)</p>
                    <h2 className="text-3xl font-bold text-green-500 mt-2">128</h2>
                </GlassCard>
            </div>

            <div>
                <h3 className="font-bold text-white mb-6 flex items-center gap-2">
                    <List className="w-5 h-5 text-gray-400" /> Escaneos Recientes
                </h3>
                <RecentScansTable />
            </div>
        </CSIRTModuleLayout>
    );
}
