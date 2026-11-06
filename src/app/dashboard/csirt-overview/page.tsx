'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Activity, Shield, AlertTriangle, CheckCircle,
    Clock, Users, Globe, Target, Server,
    FileText, Zap, BarChart3, Lock
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';

export default function CSIRTOverviewPage() {
    // 1. KPIs Generales
    const kpis = [
        { title: "Incidentes Activos", value: "24", change: "+4", color: "text-red-500", icon: Activity },
        { title: "Nivel de Riesgo", value: "Alto", change: "Score: 85/100", color: "text-orange-500", icon: AlertTriangle },
        { title: "MTTD (Detección)", value: "12m", change: "-2m vs avg", color: "text-blue-500", icon: Clock },
        { title: "MTTR (Respuesta)", value: "45m", change: "-5m vs avg", color: "text-green-500", icon: Zap },
    ];

    const incidentBreakdown = [
        { label: "Críticos", value: 3, color: "bg-red-600" },
        { label: "Altos", value: 8, color: "bg-orange-500" },
        { label: "Medios", value: 12, color: "bg-yellow-500" },
        { label: "Bajos", value: 5, color: "bg-blue-400" },
    ];

    // 2. Data para Gráficos
    const threatTypeData = [
        { name: 'Malware', value: 35 },
        { name: 'Phishing', value: 25 },
        { name: 'Ransomware', value: 15 },
        { name: 'Brute Force', value: 15 },
        { name: 'Exploits', value: 10 },
    ];

    const COLORS = ['#ef4444', '#f97316', '#8b5cf6', '#3b82f6', '#10b981']; // Neon Colors intact

    const originToDestData = [
        { country: 'CN', values: 120 },
        { country: 'RU', values: 98 },
        { country: 'US', values: 86 },
        { country: 'BR', values: 54 },
        { country: 'IR', values: 40 },
    ];

    // 3. Lista de Incidentes
    const recentIncidents = [
        { id: "INC-2024-001", type: "Ransomware Detected", severity: "Crítico", status: "En Análisis", time: "10:42 AM", analyst: "J. Doe", sla: "15m left" },
        { id: "INC-2024-002", type: "Phishing Campaign", severity: "Alto", status: "Contenido", time: "09:15 AM", analyst: "M. Smith", sla: "OK" },
        { id: "INC-2024-003", type: "Brute Force SSH", severity: "Medio", status: "Erradicado", time: "Yesterday", analyst: "A. Garcia", sla: "OK" },
        { id: "INC-2024-004", type: "Malware Download", severity: "Alto", status: "Nuevo", time: "11:05 AM", analyst: "Pending", sla: "Urgent" },
        { id: "INC-2024-005", type: "Policy Violation", severity: "Bajo", status: "Cerrado", time: "Yesterday", analyst: "System", sla: "OK" },
    ];

    // 4. Estado de Herramientas
    const toolsStatus = [
        { name: "MS Sentinel (SIEM)", status: "Operational", color: "text-green-500" },
        { name: "Palo Alto FW", status: "Operational", color: "text-green-500" },
        { name: "CrowdStrike EDR", status: "Warning", color: "text-yellow-500" },
        { name: "Darktrace IDS", status: "Operational", color: "text-green-500" },
    ];

    // 5. Equipo CSIRT
    const teamStatus = [
        { name: "Analistas Activos", value: "4/6", status: "Normal" },
        { name: "Incid. por Analista", value: "3.2", status: "High Load" },
        { name: "Escalamientos (L2)", value: "2", status: "Normal" },
    ];

    return (
        <div className="p-6 space-y-6 bg-slate-950 min-h-screen text-slate-200">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">CSIRT Management Dashboard</h1>
                    <p className="text-slate-400">Vista General de Operaciones y Seguridad</p>
                </div>
                <div className="flex gap-3">
                    <div className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg shadow-sm flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                        <span className="text-sm font-medium text-slate-300">Sistemas Operativos</span>
                    </div>
                </div>
            </div>

            {/* 1. KPIs Principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {kpis.map((kpi, idx) => (
                    <Card key={idx} className="bg-slate-900 border-slate-800 shadow-lg hover:shadow-cyan-900/20 transition-all duration-300">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-400">{kpi.title}</p>
                                <h3 className="text-2xl font-bold text-white mt-1">{kpi.value}</h3>
                                <p className={`text-xs mt-1 ${kpi.color} font-medium`}>{kpi.change}</p>
                            </div>
                            <div className={`p-3 rounded-full bg-slate-800/50 border border-slate-700`}>
                                <kpi.icon className={`h-6 w-6 ${kpi.color}`} />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Breakdown de Incidentes y Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Distribución de Severidad */}
                <Card className="bg-slate-900 border-slate-800 shadow-lg lg:col-span-1">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold flex items-center gap-2 text-white">
                            <Activity className="h-5 w-5 text-blue-500" /> Incidentes Activos
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
                                    <span>Resueltos (Hoy): 15</span>
                                    <span>Pendientes: 28</span>
                                </div>
                                <div className="w-full bg-slate-800 h-2 rounded-full mt-2 overflow-hidden">
                                    <div className="bg-emerald-500 h-full rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" style={{ width: '35%' }}></div>
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

            {/* Gestión de Incidentes (Tabla Detallada) */}
            <Card className="bg-slate-900 border-slate-800 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg font-bold flex items-center gap-2 text-white">
                        <FileText className="h-5 w-5 text-slate-400" /> Últimos Incidentes
                    </CardTitle>
                    <button className="text-sm text-cyan-500 hover:text-cyan-400 font-medium transition-colors">Ver todos</button>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-950 text-slate-400 font-medium border-b border-slate-800">
                                <tr>
                                    <th className="py-3 px-4">ID Incidente</th>
                                    <th className="py-3 px-4">Tipo</th>
                                    <th className="py-3 px-4">Severidad</th>
                                    <th className="py-3 px-4">Estado</th>
                                    <th className="py-3 px-4">Detectado</th>
                                    <th className="py-3 px-4">Analista</th>
                                    <th className="py-3 px-4">SLA</th>
                                    <th className="py-3 px-4">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {recentIncidents.map((inc) => (
                                    <tr key={inc.id} className="hover:bg-slate-800/50 transition-colors">
                                        <td className="py-3 px-4 font-medium text-white">{inc.id}</td>
                                        <td className="py-3 px-4 text-slate-300">{inc.type}</td>
                                        <td className="py-3 px-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${inc.severity === 'Crítico' ? 'bg-red-900/30 text-red-400 border-red-900' :
                                                inc.severity === 'Alto' ? 'bg-orange-900/30 text-orange-400 border-orange-900' :
                                                    inc.severity === 'Medio' ? 'bg-yellow-900/30 text-yellow-400 border-yellow-900' : 'bg-blue-900/30 text-blue-400 border-blue-900'}`}>
                                                {inc.severity}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-slate-300">{inc.status}</td>
                                        <td className="py-3 px-4 text-slate-500">{inc.time}</td>
                                        <td className="py-3 px-4 text-slate-300">{inc.analyst}</td>
                                        <td className="py-3 px-4 font-medium text-slate-300">{inc.sla}</td>
                                        <td className="py-3 px-4">
                                            <button className="text-cyan-500 hover:text-cyan-400 hover:underline">Gestionar</button>
                                        </td>
                                    </tr>
                                ))}
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
                        <button className="w-full mt-2 py-2 text-xs font-medium text-cyan-400 bg-cyan-950/30 rounded hover:bg-cyan-900/50 transition border border-cyan-900/30">
                            Ver Calendario de Turnos
                        </button>
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
                        <button className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-lg hover:border-cyan-700/50 hover:shadow-cyan-900/10 hover:shadow-sm transition group">
                            <div className="flex items-center gap-3">
                                <div className="bg-blue-900/20 p-2 rounded text-blue-400">
                                    <FileText className="h-4 w-4" />
                                </div>
                                <div className="text-left">
                                    <div className="text-sm font-semibold text-slate-200 group-hover:text-cyan-400">Reporte Ejecutivo</div>
                                    <div className="text-xs text-slate-500">PDF - Último: Hoy 08:00</div>
                                </div>
                            </div>
                        </button>
                        <button className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-lg hover:border-purple-700/50 hover:shadow-purple-900/10 hover:shadow-sm transition group">
                            <div className="flex items-center gap-3">
                                <div className="bg-purple-900/20 p-2 rounded text-purple-400">
                                    <Shield className="h-4 w-4" />
                                </div>
                                <div className="text-left">
                                    <div className="text-sm font-semibold text-slate-200 group-hover:text-purple-400">Estado Compliance</div>
                                    <div className="text-xs text-slate-500">ISO 27001 - 92% OK</div>
                                </div>
                            </div>
                        </button>
                        <div className="text-xs text-center text-slate-600 mt-1">Próxima auditoría: 15 días</div>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}
