'use client';

import React from 'react';
import {
    ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
    BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';
import { Calendar, TrendingUp, AlertOctagon, Target, Activity } from 'lucide-react';

interface AnalyticsDashboardProps {
    data: {
        history: Array<{ date: string; critical: number; high: number; medium: number }>;
        severityDistribution: Array<{ name: string; value: number }>;
        topVulns: Array<{ name: string; count: number }>;
        remediationStats: { fixed: number; pending: number; regressed: number };
    };
}

export function AnalyticsDashboard({ data }: AnalyticsDashboardProps) {
    const COLORS = ['#EF4444', '#F97316', '#F59E0B', '#3B82F6', '#10B981'];

    return (
        <div className="space-y-6">

            {/* Header Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <div className="text-sm text-slate-400">Total Escaneos</div>
                            <div className="text-2xl font-bold">1,248</div>
                        </div>
                        <Activity className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div className="text-xs text-green-400 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        +12% vs mes anterior
                    </div>
                </div>

                <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <div className="text-sm text-slate-400">Vuln. Críticas</div>
                            <div className="text-2xl font-bold text-red-500">24</div>
                        </div>
                        <AlertOctagon className="w-5 h-5 text-red-500" />
                    </div>
                    <div className="text-xs text-red-400 flex items-center gap-1">
                        +4 nuevas esta semana
                    </div>
                </div>

                <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <div className="text-sm text-slate-400">Tasa de Remediación</div>
                            <div className="text-2xl font-bold text-green-500">85%</div>
                        </div>
                        <Target className="w-5 h-5 text-green-500" />
                    </div>
                    <div className="text-xs text-slate-500">MTTR: 5.2 días</div>
                </div>

                <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <div className="text-sm text-slate-400">Objetivos Activos</div>
                            <div className="text-2xl font-bold text-purple-500">42</div>
                        </div>
                        <Target className="w-5 h-5 text-purple-500" />
                    </div>
                    <div className="text-xs text-slate-500">6 añadidos recientemente</div>
                </div>
            </div>

            {/* Main Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Vulnerability Trends Area Chart */}
                <div className="lg:col-span-2 p-6 bg-slate-900 border border-slate-800 rounded-lg">
                    <h3 className="text-lg font-bold mb-4">Tendencias de Vulnerabilidades (Últimos 30 días)</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data.history}>
                                <defs>
                                    <linearGradient id="colorCritical" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorHigh" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#F97316" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="date" stroke="#94A3B8" />
                                <YAxis stroke="#94A3B8" />
                                <RechartsTooltip
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }}
                                />
                                <Area type="monotone" dataKey="critical" stroke="#EF4444" fillOpacity={1} fill="url(#colorCritical)" />
                                <Area type="monotone" dataKey="high" stroke="#F97316" fillOpacity={1} fill="url(#colorHigh)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Severity Distribution Pie Chart */}
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-lg">
                    <h3 className="text-lg font-bold mb-4">Distribución por Severidad</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data.severityDistribution}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {data.severityDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <RechartsTooltip
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        {/* Legend */}
                        <div className="flex justify-center gap-4 mt-4 text-xs">
                            {data.severityDistribution.map((entry, index) => (
                                <div key={index} className="flex items-center gap-1">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                    <span>{entry.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>

            {/* Secondary Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Top Vulnerabilities Horizontal Bar Chart */}
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-lg">
                    <h3 className="text-lg font-bold mb-4">Top Vulnerabilidades Recurrentes</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart layout="vertical" data={data.topVulns}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={true} vertical={false} />
                                <XAxis type="number" stroke="#94A3B8" />
                                <YAxis dataKey="name" type="category" width={150} stroke="#94A3B8" style={{ fontSize: '12px' }} />
                                <RechartsTooltip
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }}
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                />
                                <Bar dataKey="count" fill="#3B82F6" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Remediation Status */}
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-lg">
                    <h3 className="text-lg font-bold mb-4">Estado de Remediación</h3>
                    <div className="flex items-center justify-center h-[300px] flex-col gap-6">

                        <div className="flex gap-8 text-center w-full justify-around px-10">
                            <div>
                                <div className="text-sm text-slate-400 mb-1">Resueltas</div>
                                <div className="text-4xl font-bold text-green-500">{data.remediationStats.fixed}</div>
                            </div>
                            <div>
                                <div className="text-sm text-slate-400 mb-1">Pendientes</div>
                                <div className="text-4xl font-bold text-yellow-500">{data.remediationStats.pending}</div>
                            </div>
                            <div>
                                <div className="text-sm text-slate-400 mb-1">Reincidentes</div>
                                <div className="text-4xl font-bold text-red-500">{data.remediationStats.regressed}</div>
                            </div>
                        </div>

                        <div className="w-full px-10">
                            <div className="mb-2 flex justify-between text-sm">
                                <span>Progreso de Meta Mensual</span>
                                <span>78%</span>
                            </div>
                            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500" style={{ width: '78%' }} />
                            </div>
                        </div>

                    </div>
                </div>

            </div>

        </div>
    );
}
