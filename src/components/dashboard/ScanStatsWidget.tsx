'use client';

import { useEffect, useState } from 'react';
import { Radar, TrendingUp, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

interface ScanStats {
    total: number;
    today: number;
    last7Days: number;
}

interface FindingStats {
    total: number;
    bySeverity: {
        critical: number;
        high: number;
        medium: number;
        low: number;
        info: number;
    };
}

interface RecentScan {
    id: string;
    target: string;
    scanType: string;
    status: string;
    findingsCount: number;
    createdAt: string;
    duration: number | null;
}

export default function ScanStatsWidget() {
    const [scans, setScans] = useState<ScanStats | null>(null);
    const [findings, setFindings] = useState<FindingStats | null>(null);
    const [recentScans, setRecentScans] = useState<RecentScan[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await fetch('/api/dashboard/stats');
            const data = await response.json();

            if (data.success) {
                setScans(data.data.scans);
                setFindings(data.data.findings);
                setRecentScans(data.data.recentScans);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <div className="animate-pulse space-y-4">
                    <div className="h-6 bg-white/10 rounded w-1/3"></div>
                    <div className="h-20 bg-white/10 rounded"></div>
                </div>
            </div>
        );
    }

    const criticalAndHigh = (findings?.bySeverity.critical || 0) + (findings?.bySeverity.high || 0);

    return (
        <div className="space-y-6">
            {/* Scan Stats Card */}
            <div className="p-6 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 backdrop-blur-sm">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <p className="text-cyan-400 text-sm font-medium mb-1">Escaneos de Seguridad</p>
                        <h3 className="text-3xl font-bold text-white">{scans?.total || 0}</h3>
                    </div>
                    <div className="p-3 rounded-lg bg-cyan-500/20">
                        <Radar className="w-6 h-6 text-cyan-400" />
                    </div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-400" />
                        <span className="text-green-400 font-medium">{scans?.today || 0} hoy</span>
                    </div>
                    <span className="text-zinc-500">•</span>
                    <span className="text-zinc-400">{scans?.last7Days || 0} últimos 7 días</span>
                </div>
            </div>

            {/* Findings Alert */}
            {criticalAndHigh > 0 && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30">
                    <div className="flex items-center gap-3">
                        <AlertTriangle className="w-5 h-5 text-red-400" />
                        <div>
                            <p className="text-red-400 font-medium text-sm">
                                {criticalAndHigh} Findings Críticos/Altos
                            </p>
                            <p className="text-zinc-400 text-xs">
                                {findings?.bySeverity.critical || 0} críticos, {findings?.bySeverity.high || 0} altos
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Recent Scans */}
            <div className="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Últimos Escaneos</h3>
                    <Link
                        href="/dashboard/csirt-scans"
                        className="text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors"
                    >
                        Ver todos →
                    </Link>
                </div>
                <div className="space-y-3">
                    {recentScans.length === 0 ? (
                        <p className="text-zinc-500 text-sm text-center py-4">No hay escaneos recientes</p>
                    ) : (
                        recentScans.map((scan) => (
                            <Link
                                key={scan.id}
                                href={`/dashboard/csirt-scans`}
                                className="block p-3 rounded-lg bg-black/20 hover:bg-black/40 border border-white/5 hover:border-cyan-500/30 transition-all"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <p className="text-white font-medium text-sm">{scan.target}</p>
                                        <p className="text-zinc-500 text-xs mt-1">
                                            {scan.scanType} • {scan.findingsCount} findings
                                        </p>
                                    </div>
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${scan.status === 'success'
                                            ? 'bg-green-500/20 text-green-400'
                                            : 'bg-red-500/20 text-red-400'
                                        }`}>
                                        {scan.status}
                                    </span>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
