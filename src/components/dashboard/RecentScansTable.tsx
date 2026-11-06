"use client";

import React, { useEffect, useState } from "react";
import { FileText, AlertTriangle, CheckCircle } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";

interface ScanResult {
    id: string;
    scanType: string;
    status: string;
    completedAt: string;
    target: {
        target: string;
    };
    findings: Array<{
        severity: string;
    }>;
}

export default function RecentScansTable() {
    const [scans, setScans] = useState<ScanResult[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/scans/recent')
            .then(res => res.json())
            .then(data => {
                setScans(data.scans || []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (loading) {
        return <GlassCard className="p-6 text-center text-gray-500">Cargando escaneos...</GlassCard>;
    }

    if (scans.length === 0) {
        return <GlassCard className="p-6 text-center text-gray-500">No hay escaneos recientes</GlassCard>;
    }

    return (
        <GlassCard className="p-0 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-black/20 text-gray-400 font-medium uppercase tracking-wider text-xs">
                        <tr>
                            <th className="px-6 py-4">Target</th>
                            <th className="px-6 py-4">Tipo</th>
                            <th className="px-6 py-4">Fecha</th>
                            <th className="px-6 py-4">Hallazgos Críticos</th>
                            <th className="px-6 py-4">Estado</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-gray-300">
                        {scans.map((scan) => (
                            <tr key={scan.id} className="hover:bg-white/5 transition-colors cursor-pointer group" onClick={() => window.location.href = `/dashboard/csirt-scans/${scan.id}`}>
                                <td className="px-6 py-4 font-medium text-white group-hover:text-cyan-400 transition-colors">{scan.target.target}</td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 rounded bg-white/5 border border-white/10 text-xs uppercase">
                                        {scan.scanType}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-xs">{new Date(scan.completedAt).toLocaleString()}</td>
                                <td className="px-6 py-4">
                                    {scan.findings.length > 0 ? (
                                        <span className="flex items-center gap-2 text-red-400">
                                            <AlertTriangle className="w-4 h-4" />
                                            {scan.findings.length}
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-2 text-green-400">
                                            <CheckCircle className="w-4 h-4" />
                                            0
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs ${scan.status === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-gray-500/10 text-gray-400'
                                        }`}>
                                        {scan.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </GlassCard>
    );
}
