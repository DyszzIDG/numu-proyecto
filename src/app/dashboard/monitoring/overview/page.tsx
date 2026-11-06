"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Activity, Server, Wifi, ShieldCheck } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import CyberButton from "@/components/ui/CyberButton";
import NeonCard from "@/components/ui/NeonCard";
import GlassCard from "@/components/ui/GlassCard";

const data = [
    { name: '00:00', traffic: 400, threats: 2 },
    { name: '04:00', traffic: 300, threats: 1 },
    { name: '08:00', traffic: 550, threats: 5 },
    { name: '12:00', traffic: 800, threats: 8 },
    { name: '16:00', traffic: 700, threats: 4 },
    { name: '20:00', traffic: 900, threats: 12 },
    { name: '24:00', traffic: 600, threats: 3 },
];

export default function OverviewPage() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500 p-8">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-6">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                        <Activity className="text-cyan-400" /> Panel Principal de Monitoreo
                    </h1>
                    <p className="text-sm text-gray-400 mt-1">
                        Vista general del estado de la red y amenazas detectadas.
                    </p>
                </div>
                <Link href="/dashboard/monitoring">
                    <CyberButton variant="outline" className="text-xs">
                        <ArrowLeft className="w-4 h-4 mr-2" /> VOLVER
                    </CyberButton>
                </Link>
            </div>

            {/* KPI Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <NeonCard glowColor="cyan" className="p-6 flex items-center justify-between">
                    <div>
                        <p className="text-xs text-gray-400 uppercase tracking-widest">Tráfico de Red</p>
                        <h3 className="text-3xl font-bold text-white mt-1">1.2 TB</h3>
                        <span className="text-xs text-green-400 flex items-center gap-1 mt-1">
                            ▲ 12% vs ayer
                        </span>
                    </div>
                    <Wifi className="w-8 h-8 text-cyan-400 opacity-50" />
                </NeonCard>
                <NeonCard glowColor="magenta" className="p-6 flex items-center justify-between">
                    <div>
                        <p className="text-xs text-gray-400 uppercase tracking-widest">Amenazas Bloqueadas</p>
                        <h3 className="text-3xl font-bold text-white mt-1">42</h3>
                        <span className="text-xs text-red-400 flex items-center gap-1 mt-1">
                            ▲ 5 detectadas hoy
                        </span>
                    </div>
                    <ShieldCheck className="w-8 h-8 text-purple-400 opacity-50" />
                </NeonCard>
                <GlassCard className="p-6 flex items-center justify-between">
                    <div>
                        <p className="text-xs text-gray-400 uppercase tracking-widest">Estado del Sistema</p>
                        <h3 className="text-3xl font-bold text-green-400 mt-1">OPERATIVO</h3>
                        <span className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                            Uptime: 99.99%
                        </span>
                    </div>
                    <Server className="w-8 h-8 text-green-400 opacity-50" />
                </GlassCard>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <GlassCard className="p-6 min-h-[400px]">
                    <h3 className="text-lg font-bold text-white mb-6">Tráfico en Tiempo Real</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" stroke="#525252" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#525252" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area type="monotone" dataKey="traffic" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorTraffic)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </GlassCard>

                <GlassCard className="p-6 min-h-[400px]">
                    <h3 className="text-lg font-bold text-white mb-6">Intentos de Intrusión</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data}>
                                <XAxis dataKey="name" stroke="#525252" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#525252" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '8px' }}
                                    itemStyle={{ color: '#ef4444' }}
                                />
                                <Line type="step" dataKey="threats" stroke="#ef4444" strokeWidth={2} dot={{ r: 4, strokeWidth: 0, fill: '#ef4444' }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </GlassCard>
            </div>
        </div>
    );
}
