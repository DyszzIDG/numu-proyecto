"use client";

import React from "react";
import CSIRTModuleLayout from "@/components/csirt/CSIRTModuleLayout";
import { FileBarChart, Download, Calendar, Filter } from "lucide-react";
import NeonCard from "@/components/ui/NeonCard";
import GlassCard from "@/components/ui/GlassCard";

export default function ReportsPage() {
    return (
        <CSIRTModuleLayout
            title="Reportes y Métricas"
            description="Centro unificado de reportes ejecutivos y técnicos."
            icon={FileBarChart}
            iconColor="text-emerald-400"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {['Diario', 'Semanal', 'Mensual', 'Trimestral'].map((period, i) => (
                    <GlassCard key={i} className="p-6 cursor-pointer hover:border-emerald-400/50 transition-colors group">
                        <Calendar className="w-6 h-6 text-emerald-500 mb-3" />
                        <h3 className="font-bold text-white mb-1">Reporte {period}</h3>
                        <span className="text-xs text-gray-500 group-hover:text-emerald-300 transition-colors">Generar PDF</span>
                    </GlassCard>
                ))}
            </div>

            <NeonCard className="p-8 text-center text-gray-500 min-h-[300px] flex items-center justify-center">
                Métricas personalizadas en desarrollo (PowerBI Embed / Custom Charts)
            </NeonCard>
        </CSIRTModuleLayout>
    );
}
