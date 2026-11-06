'use client';

import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Shield, Target, Clock, AlertTriangle } from 'lucide-react';

interface DashboardStats {
    totalScans: number;
    totalFindings: number;
    criticalFindings: number;
    averageDuration: number;
    portDistribution: Array<{ name: string; value: number }>;
    severityDistribution: Array<{ name: string; value: number; color: string }>;
    scanTimeline: Array<{ date: string; scans: number }>;
    topTargets: Array<{ target: string; scans: number; findings: number }>;
}

interface ResultsDashboardProps {
    stats: DashboardStats;
}

const SEVERITY_COLORS = {
    critical: '#EF4444',
    high: '#F97316',
    medium: '#F59E0B',
    low: '#3B82F6',
    info: '#6B7280'
};

export function ResultsDashboard({ stats }: ResultsDashboardProps) {
    return (
        <div className="space-y-6">

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

                <div className="p-6 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                        <Target className="w-8 h-8 text-cyan-400" />
                        <TrendingUp className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div className="text-3xl font-bold mb-1">{stats.totalScans}</div>
                    <div className="text-sm text-slate-400">Total Scans</div>
                </div>

                <div className="p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                        <Shield className="w-8 h-8 text-purple-400" />
                        <TrendingUp className="w-5 h-5 text-purple-400" />
                    </div>
                    <div className="text-3xl font-bold mb-1">{stats.totalFindings}</div>
                    <div className="text-sm text-slate-400">Total Findings</div>
                </div>

                <div className="p-6 bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/30 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                        <AlertTriangle className="w-8 h-8 text-red-400" />
                        <TrendingUp className="w-5 h-5 text-red-400" />
                    </div>
                    <div className="text-3xl font-bold mb-1">{stats.criticalFindings}</div>
                    <div className="text-sm text-slate-400">Critical Issues</div>
                </div>

                <div className="p-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                        <Clock className="w-8 h-8 text-green-400" />
                        <TrendingUp className="w-5 h-5 text-green-400" />
                    </div>
                    <div className="text-3xl font-bold mb-1">{stats.averageDuration}m</div>
                    <div className="text-sm text-slate-400">Avg Duration</div>
                </div>

            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Severity Distribution */}
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-lg">
                    <h3 className="text-lg font-bold mb-4">Findings by Severity</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={stats.severityDistribution}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis dataKey="name" stroke="#94A3B8" />
                            <YAxis stroke="#94A3B8" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1E293B',
                                    border: '1px solid #334155',
                                    borderRadius: '8px'
                                }}
                            />
                            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                                {stats.severityDistribution.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Port Distribution */}
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-lg">
                    <h3 className="text-lg font-bold mb-4">Open Ports Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={stats.portDistribution}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {stats.portDistribution.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={['#06B6D4', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981'][index % 5]}
                                    />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1E293B',
                                    border: '1px solid #334155',
                                    borderRadius: '8px'
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 gap-6">

                {/* Scan Timeline */}
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-lg">
                    <h3 className="text-lg font-bold mb-4">Scan Activity Timeline</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={stats.scanTimeline}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis dataKey="date" stroke="#94A3B8" />
                            <YAxis stroke="#94A3B8" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1E293B',
                                    border: '1px solid #334155',
                                    borderRadius: '8px'
                                }}
                            />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="scans"
                                stroke="#06B6D4"
                                strokeWidth={3}
                                dot={{ fill: '#06B6D4', r: 5 }}
                                activeDot={{ r: 8 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

            </div>

            {/* Top Targets Table */}
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-lg">
                <h3 className="text-lg font-bold mb-4">Top Scanned Targets</h3>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-800">
                                <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Target</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Scans</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Findings</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Avg per Scan</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.topTargets.map((target, idx) => (
                                <tr key={idx} className="border-b border-slate-800 hover:bg-slate-800/50 transition">
                                    <td className="py-3 px-4 font-mono text-sm">{target.target}</td>
                                    <td className="py-3 px-4">
                                        <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded text-sm">
                                            {target.scans}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-sm">
                                            {target.findings}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-slate-400">
                                        {(target.findings / target.scans).toFixed(1)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
}
