"use client";

import React from "react";
import Link from "next/link";
import { Activity, FileText, Zap, ArrowLeft } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import NeonCard from "@/components/ui/NeonCard";
import CyberButton from "@/components/ui/CyberButton";

export default function MonitoringPage() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500 p-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
                        <Activity className="w-8 h-8 text-cyan-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">
                            Monitoreo y Detección
                        </h1>
                        <p className="text-sm text-gray-400 mt-1">
                            Dashboards en tiempo real y detección de anomalías. Visibilidad completa de tu infraestructura 24/7.
                        </p>
                    </div>
                </div>

                <Link href="/dashboard">
                    <CyberButton variant="outline" className="text-xs">
                        <ArrowLeft className="w-4 h-4 mr-2" /> VOLVER
                    </CyberButton>
                </Link>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Card 1: Panel Principal */}
                <Link href="/dashboard/monitoring/overview" className="block h-full">
                    <NeonCard glowColor="cyan" className="min-h-[250px] flex flex-col items-center justify-center text-center group cursor-pointer hover:bg-white/5 transition-colors h-full">
                        <div className="p-4 rounded-full bg-white/5 mb-4 group-hover:scale-110 transition-transform duration-300">
                            <Activity className="w-10 h-10 text-gray-400 group-hover:text-cyan-400 transition-colors" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Panel Principal</h3>
                        <p className="text-gray-500 text-sm max-w-[200px]">
                            Visualización de datos en tiempo real y métricas clave.
                        </p>
                    </NeonCard>
                </Link>

                {/* Card 2: Reportes Recientes */}
                <Link href="/dashboard/monitoring/reports" className="block h-full">
                    <GlassCard className="min-h-[250px] flex flex-col items-center justify-center text-center group cursor-pointer border-dashed border-white/10 hover:border-white/20 h-full">
                        <div className="p-4 rounded-full bg-white/5 mb-4 group-hover:scale-110 transition-transform duration-300">
                            <FileText className="w-10 h-10 text-gray-400 group-hover:text-purple-400 transition-colors" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Reportes Recientes</h3>
                        <p className="text-gray-500 text-sm">
                            Historial de detecciones y logs del sistema.
                        </p>
                    </GlassCard>
                </Link>

                {/* Card 3: Acciones Rápidas */}
                <Link href="/dashboard/monitoring/actions" className="block h-full">
                    <GlassCard className="min-h-[250px] flex flex-col items-center justify-center text-center group cursor-pointer border-dashed border-white/10 hover:border-white/20 h-full">
                        <div className="p-4 rounded-full bg-white/5 mb-4 group-hover:scale-110 transition-transform duration-300">
                            <Zap className="w-10 h-10 text-gray-400 group-hover:text-yellow-400 transition-colors" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Acciones Rápidas</h3>
                        <p className="text-gray-500 text-sm max-w-[200px]">
                            Ejecutar escaneos y configurar herramientas.
                        </p>
                    </GlassCard>
                </Link>
            </div>
        </div>
    );
}
