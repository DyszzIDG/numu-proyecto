
'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import CSIRTModuleLayout from '@/components/csirt/CSIRTModuleLayout';
import { Radar, Terminal, AlertTriangle, CheckCircle, Clock, Server, FileText, ArrowDownCircle } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import NeonCard from '@/components/ui/NeonCard';

interface ScanDetail {
    id: string;
    target: {
        target: string;
        type: string;
    };
    scanType: string;
    status: string;
    completedAt: string;
    duration: number;
    rawOutput?: string;
    metadata?: string | any;
    findings: Array<{
        id: string;
        severity: string;
        title: string;
        description: string;
    }>;
}

export default function ScanDetailPage() {
    const params = useParams();
    const id = params.id as string;
    const [scan, setScan] = useState<ScanDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/scans/${id}`)
            .then(res => res.json())
            .then(data => {
                console.log('📊 Scan data received:', data);
                console.log('📊 Findings:', data?.findings);
                console.log('📊 Target:', data?.target);
                setScan(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('❌ Error fetching scan:', err);
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return (
            <CSIRTModuleLayout title="Detalles del Escaneo" description="Cargando información..." icon={Radar}>
                <div className="flex items-center justify-center p-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
                </div>
            </CSIRTModuleLayout>
        );
    }

    if (!scan || (scan as any).error) {
        return (
            <CSIRTModuleLayout title="Scan Not Found" description="The requested scan could not be found." icon={Radar}>
                <div className="text-center p-12 bg-red-500/10 rounded-xl border border-red-500/30">
                    <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-white">Escaneo no encontrado</h2>
                    <p className="text-gray-400 mt-2">No se pudo recuperar la información del escaneo solicitado.</p>
                </div>
            </CSIRTModuleLayout>
        );
    }

    return (
        <CSIRTModuleLayout
            title={`Scan: ${scan.target.target}`}
            description={`Ejecutado el ${new Date(scan.completedAt).toLocaleString()}`}
            icon={Radar}
            iconColor={scan.status === 'success' ? 'text-green-400' : 'text-red-400'}
            backLink="/dashboard/unified-scan"
        >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <NeonCard glowColor={scan.status === 'success' ? 'green' : 'red'} className="p-6">
                    <p className="text-xs text-gray-400 uppercase">Estado</p>
                    <h2 className={`text-3xl font-bold ${scan.status === 'success' ? 'text-green-400' : 'text-red-400'} mt-2 uppercase`}>
                        {scan.status}
                    </h2>
                </NeonCard>
                <GlassCard className="p-6">
                    <p className="text-xs text-gray-400 uppercase flex items-center gap-2">
                        <Terminal className="w-4 h-4" /> Herramienta
                    </p>
                    <h2 className="text-3xl font-bold text-white mt-2 uppercase">{scan.scanType}</h2>
                </GlassCard>
                <GlassCard className="p-6">
                    <p className="text-xs text-gray-400 uppercase flex items-center gap-2">
                        <Clock className="w-4 h-4" /> Duración
                    </p>
                    <h2 className="text-3xl font-bold text-cyan-400 mt-2">
                        {scan.duration ? `${(scan.duration / 1000).toFixed(1)}s` : 'N/A'}
                    </h2>
                </GlassCard>
                <GlassCard className="p-6">
                    <p className="text-xs text-gray-400 uppercase flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" /> Hallazgos
                    </p>
                    <h2 className="text-3xl font-bold text-yellow-400 mt-2">
                        {scan.findings.length}
                    </h2>
                </GlassCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Findings List */}
                <div className="lg:col-span-1 space-y-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-yellow-400" />
                        Hallazgos Detectados
                    </h3>
                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                        {scan.findings.length === 0 ? (
                            <div className="p-6 rounded-xl bg-white/5 border border-white/10 text-center">
                                <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                                <p className="text-gray-400">No se detectaron vulnerabilidades críticas.</p>
                            </div>
                        ) : (
                            scan.findings.map(finding => (
                                <div key={finding.id} className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${finding.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                                            finding.severity === 'high' ? 'bg-orange-500/20 text-orange-400' :
                                                'bg-blue-500/20 text-blue-400'
                                            }`}>
                                            {finding.severity}
                                        </span>
                                    </div>
                                    <h4 className="font-bold text-white mb-1">{finding.title}</h4>
                                    <p className="text-sm text-gray-400 line-clamp-2">{finding.description}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Raw Output Terminal */}
                <div className="lg:col-span-2">
                    <h3 className="text-xl font-bold text-white flex items-center justify-between mb-4">
                        <span className="flex items-center gap-2">
                            <Terminal className="w-5 h-5 text-gray-400" />
                            Salida de Consola (Raw Output)
                        </span>
                        <button className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2">
                            <ArrowDownCircle className="w-4 h-4" /> Exportar Log
                        </button>
                    </h3>
                    <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-0 overflow-hidden shadow-2xl">
                        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border-b border-white/5">
                            <div className="w-3 h-3 rounded-full bg-red-500" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500" />
                            <div className="w-3 h-3 rounded-full bg-green-500" />
                            <span className="ml-2 text-xs text-mono text-gray-500">root@numu-csirt:~# logs</span>
                        </div>
                        <div className="p-6 overflow-x-auto">
                            <pre className="font-mono text-xs md:text-sm text-green-400/90 whitespace-pre-wrap leading-relaxed">
                                {(() => {
                                    try {
                                        const metadata = typeof scan.metadata === 'string'
                                            ? JSON.parse(scan.metadata)
                                            : scan.metadata;
                                        return metadata?.rawOutput || "No output available.";
                                    } catch (e) {
                                        return scan.metadata || "No output available.";
                                    }
                                })()}
                            </pre>
                        </div>
                    </div>
                </div>
            </div>
        </CSIRTModuleLayout>
    );
}
