'use client';

import React, { useEffect, useState, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Activity, Shield, AlertTriangle, CheckCircle,
    Clock, Users, Globe, Target, Server,
    FileText, Zap, BarChart3, Lock, RefreshCw
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';
import { getCSIRTOverviewData } from './actions';
import { CSIRTOverviewData } from './types';

const COLORS = ['#ef4444', '#f97316', '#8b5cf6', '#3b82f6', '#10b981', '#06b6d4'];

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
    Activity,
    AlertTriangle,
    Clock,
    Zap,
    Shield,
    Users
};

export default function CSIRTOverviewPage() {
    const [data, setData] = useState<CSIRTOverviewData | null>(null);
    const [loading, setLoading] = useState(true);
    const [isPending, startTransition] = useTransition();

    const loadData = () => {
        startTransition(async () => {
            try {
                const result = await getCSIRTOverviewData();
                setData(result);
            } catch (err) {
                console.error("Failed to load CSIRT overview data:", err);
            } finally {
                setLoading(false);
            }
        });
    };

    useEffect(() => {
        loadData();
    }, []);

    // Fallbacks if data is loading for the first time
    const kpis = data?.kpis || [
        { title: "Incidentes Activos", value: "...", change: "Cargando...", color: "text-red-500", iconName: "Activity" },
        { title: "Nivel de Riesgo", value: "...", change: "Calculando...", color: "text-orange-500", iconName: "AlertTriangle" },
        { title: "MTTD (Detección)", value: "...", change: "--", color: "text-blue-500", iconName: "Clock" },
        { title: "MTTR (Respuesta)", value: "...", change: "--", color: "text-green-500", iconName: "Zap" },
    ];

    const incidentBreakdown = data?.incidentBreakdown || [
        { label: "Críticos", value: 0, color: "bg-red-600" },
        { label: "Altos", value: 0, color: "bg-orange-500" },
        { label: "Medios", value: 0, color: "bg-yellow-500" },
        { label: "Bajos", value: 0, color: "bg-blue-400" },
    ];

    const threatTypeData = data?.threatTypeData || [];
    const originToDestData = data?.originToDestData || [];
    const recentIncidents = data?.recentIncidents || [];
    const toolsStatus = data?.toolsStatus || [];
    const teamStatus = data?.teamStatus || [];

    const totalActive = incidentBreakdown.reduce((sum, item) => sum + item.value, 0);

    return (
        <div className="p-6 space-y-6 bg-slate-950 min-h-screen text-slate-200">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">CSIRT Management Dashboard</h1>
                    <p className="text-slate-400">Vista General de Operaciones, Incidentes y Telemetría</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={loadData}
                        disabled={isPending}
                        className="px-3 py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-lg text-sm flex items-center gap-2 transition"
                    >
                        <RefreshCw className={`h-4 w-4 ${isPending ? 'animate-spin text-cyan-400' : ''}`} />
                        <span>Actualizar</span>
                    </button>
                    <div className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg shadow-sm flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                        <span className="text-sm font-medium text-slate-300">Sistemas Operativos</span>
                    </div>
                </div>
            </div>

            {/* 1. KPIs Principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {kpis.map((kpi, idx) => {
                    const IconComponent = ICON_MAP[kpi.iconName] || Activity;
                    return (
                        <Card key={idx} className="bg-slate-900 border-slate-800 shadow-lg hover:shadow-cyan-900/20 transition-all duration-300">
                            <CardContent className="p-6 flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-400">{kpi.title}</p>
                                    <h3 className="text-2xl font-bold text-white mt-1">
                                        {loading ? <span className="animate-pulse">...</span> : kpi.value}
                                    </h3>
                                    <p className={`text-xs mt-1 ${kpi.color} font-medium`}>{kpi.change}</p>
                                </div>
                                <div className={`p-3 rounded-full bg-slate-800/50 border border-slate-700`}>
                                    <IconComponent className={`h-6 w-6 ${kpi.color}`} />
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Breakdown de Incidentes y Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Distribución de Severidad */}
                <Card className="bg-slate-900 border-slate-800 shadow-lg lg:col-span-1">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold flex items-center gap-2 text-white">
                            <Activity className="h-5 w-5 text-blue-500" /> Incidentes Activos ({totalActive})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {incidentBreakdown.map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-3 h-3 rounded-full ${item.color} shadow-[0_0_8px_rgba(255,255,255,0.3)]`}></div>
                                        <span className="text-slate-300 font-medium">{item.label}</span>
                                    </div>
                                    <span className="text-white font-bold">{item.value}</span>
                                </div>
                            ))}
                            <div className="pt-4 border-t border-slate-800 mt-2">
                                <div className="flex justify-between text-sm text-slate-500">
                                    <span>Prioridad Alta: {incidentBreakdown[0]?.value + incidentBreakdown[1]?.value}</span>
                                    <span>Activos Totales: {totalActive}</span>
                                </div>
                                <div className="w-full bg-slate-800 h-2 rounded-full mt-2 overflow-hidden">
                                    <div
                                        className="bg-emerald-500 h-full rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)] transition-all duration-500"
                                        style={{ width: `${Math.min(Math.max(totalActive * 12, 15), 100)}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Amenazas y Origen */}
                <Card className="bg-slate-900 border-slate-800 shadow-lg lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold flex items-center gap-2 text-white">
                            <Globe className="h-5 w-5 text-purple-500" /> Amenazas y Orígenes
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className='h-64'>
                            <h4 className="text-sm font-semibold text-slate-400 mb-2 text-center">Top Tipos de Amenaza</h4>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={threatTypeData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {threatTypeData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f1f5f9' }}
                                        itemStyle={{ color: '#f1f5f9' }}
                                    />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className='h-64'>
                            <h4 className="text-sm font-semibold text-slate-400 mb-2 text-center">Origen de Ataques (País)</h4>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={originToDestData} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#1e293b" />
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="country" type="category" width={30} tick={{ fill: '#94a3b8' }} />
                                    <Tooltip
                                        cursor={{ fill: '#1e293b' }}
                                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f1f5f9' }}
                                    />
                                    <Bar dataKey="values" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Gestión de Incidentes (Tabla Detallada con datos de Prisma) */}
            <Card className="bg-slate-900 border-slate-800 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg font-bold flex items-center gap-2 text-white">
                        <FileText className="h-5 w-5 text-slate-400" /> Incidentes CSIRT Registrados en Base de Datos
                    </CardTitle>
                    <span className="text-xs px-2.5 py-1 bg-cyan-950/50 text-cyan-400 border border-cyan-800 rounded-full">
                        {recentIncidents.length} incidentes recientes
                    </span>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-950 text-slate-400 font-medium border-b border-slate-800">
                                <tr>
                                    <th className="py-3 px-4">ID</th>
                                    <th className="py-3 px-4">Incidente</th>
                                    <th className="py-3 px-4">Severidad</th>
                                    <th className="py-3 px-4">Estado</th>
                                    <th className="py-3 px-4">Hora</th>
                                    <th className="py-3 px-4">Analista Asignado</th>
                                    <th className="py-3 px-4">SLA</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {recentIncidents.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="py-8 text-center text-slate-500">
                                            No hay incidentes registrados actualmente.
                                        </td>
                                    </tr>
                                ) : (
                                    recentIncidents.map((inc) => (
                                        <tr key={inc.id} className="hover:bg-slate-800/50 transition-colors">
                                            <td className="py-3 px-4 font-mono font-medium text-cyan-400">{inc.id}</td>
                                            <td className="py-3 px-4 text-slate-200 font-medium">{inc.type}</td>
                                            <td className="py-3 px-4">
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${
                                                    inc.severity === 'Crítico' ? 'bg-red-900/30 text-red-400 border-red-900' :
                                                    inc.severity === 'Alto' ? 'bg-orange-900/30 text-orange-400 border-orange-900' :
                                                    inc.severity === 'Medio' ? 'bg-yellow-900/30 text-yellow-400 border-yellow-900' :
                                                    'bg-blue-900/30 text-blue-400 border-blue-900'
                                                }`}>
                                                    {inc.severity}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-slate-300">
                                                <span className="flex items-center gap-1.5">
                                                    <span className={`w-1.5 h-1.5 rounded-full ${
                                                        inc.status === 'En Análisis' ? 'bg-yellow-400 animate-pulse' :
                                                        inc.status === 'Contenido' ? 'bg-blue-400' :
                                                        inc.status === 'Erradicado' ? 'bg-green-400' : 'bg-slate-400'
                                                    }`} />
                                                    {inc.status}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-slate-400 font-mono text-xs">{inc.time}</td>
                                            <td className="py-3 px-4 text-slate-300">{inc.analyst}</td>
                                            <td className="py-3 px-4 font-medium text-slate-400 text-xs">{inc.sla}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Paneles Inferiores: Herramientas, Equipo, Compliance */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Herramientas Integradas */}
                <Card className="bg-slate-900 border-slate-800 shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-base font-bold flex items-center gap-2 text-white">
                            <Server className="h-5 w-5 text-indigo-500" /> Estado de Herramientas
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {toolsStatus.map((tool, idx) => (
                            <div key={idx} className="flex justify-between items-center bg-slate-950 p-3 rounded-lg border border-slate-800">
                                <span className="text-sm font-medium text-slate-300">{tool.name}</span>
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${tool.color.replace('text-', 'bg-')} shadow-[0_0_5px_currentColor]`}></div>
                                    <span className={`text-xs font-semibold ${tool.color}`}>{tool.status}</span>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Gestión del Equipo */}
                <Card className="bg-slate-900 border-slate-800 shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-base font-bold flex items-center gap-2 text-white">
                            <Users className="h-5 w-5 text-blue-500" /> CSIRT Team Status
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {teamStatus.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center border-b border-slate-800 last:border-0 pb-2 last:pb-0">
                                <span className="text-sm text-slate-400">{item.name}</span>
                                <div className="text-right">
                                    <div className="text-sm font-bold text-white">{item.value}</div>
                                    <div className="text-xs text-slate-500">{item.status}</div>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Reportes y Compliance */}
                <Card className="bg-slate-900 border-slate-800 shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-base font-bold flex items-center gap-2 text-white">
                            <Lock className="h-5 w-5 text-emerald-500" /> Reportes & Compliance
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 gap-3">
                        <div className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="bg-blue-900/20 p-2 rounded text-blue-400">
                                    <FileText className="h-4 w-4" />
                                </div>
                                <div className="text-left">
                                    <div className="text-sm font-semibold text-slate-200">Reporte Operativo CSIRT</div>
                                    <div className="text-xs text-slate-500">PDF - Generación automática</div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="bg-purple-900/20 p-2 rounded text-purple-400">
                                    <Shield className="h-4 w-4" />
                                </div>
                                <div className="text-left">
                                    <div className="text-sm font-semibold text-slate-200">Alineación ISO 27035</div>
                                    <div className="text-xs text-slate-500">Gestión de Incidentes: 94% OK</div>
                                </div>
                            </div>
                        </div>
                        <div className="text-xs text-center text-slate-500 mt-1">Conexión en vivo con base de datos</div>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}
