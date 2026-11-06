'use client';

import React from 'react';
import { Target, Shield, Clock, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

interface QuickStats {
    scansToday: number;
    criticalVulns: number;
    avgScanTime: number;
    successRate: number;
    totalTargets: number;
    pendingScans: number;
}

interface QuickStatsHeaderProps {
    stats: QuickStats;
}

export function QuickStatsHeader({ stats }: QuickStatsHeaderProps) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">

            {/* Scans Today */}
            <div className="p-4 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs text-slate-400">Hoy</span>
                </div>
                <div className="text-2xl font-bold text-cyan-400">{stats.scansToday}</div>
                <div className="text-xs text-slate-500">escaneos</div>
            </div>

            {/* Critical Vulns */}
            <div className="p-4 bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/30 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    <span className="text-xs text-slate-400">Críticas</span>
                </div>
                <div className="text-2xl font-bold text-red-400">{stats.criticalVulns}</div>
                <div className="text-xs text-slate-500">pendientes</div>
            </div>

            {/* Avg Scan Time */}
            <div className="p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-purple-400" />
                    <span className="text-xs text-slate-400">Promedio</span>
                </div>
                <div className="text-2xl font-bold text-purple-400">{stats.avgScanTime}s</div>
                <div className="text-xs text-slate-500">por escaneo</div>
            </div>

            {/* Success Rate */}
            <div className="p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-xs text-slate-400">Éxito</span>
                </div>
                <div className="text-2xl font-bold text-green-400">{stats.successRate}%</div>
                <div className="text-xs text-slate-500">tasa</div>
            </div>

            {/* Total Targets */}
            <div className="p-4 bg-gradient-to-br from-yellow-500/10 to-amber-500/10 border border-yellow-500/30 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-yellow-400" />
                    <span className="text-xs text-slate-400">Objetivos</span>
                </div>
                <div className="text-2xl font-bold text-yellow-400">{stats.totalTargets}</div>
                <div className="text-xs text-slate-500">únicos</div>
            </div>

            {/* Pending Scans */}
            <div className="p-4 bg-gradient-to-br from-slate-700/50 to-slate-600/50 border border-slate-600/30 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-slate-400" />
                    <span className="text-xs text-slate-400">En Cola</span>
                </div>
                <div className="text-2xl font-bold text-slate-300">{stats.pendingScans}</div>
                <div className="text-xs text-slate-500">esperando</div>
            </div>

        </div>
    );
}
