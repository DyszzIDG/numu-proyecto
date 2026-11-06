"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, FileText, Download, Filter } from "lucide-react";
import CyberButton from "@/components/ui/CyberButton";
import GlassCard from "@/components/ui/GlassCard";

const reports = [
    { id: 'REP-2025-001', title: 'Análisis de Vulnerabilidades Semanal', date: '2025-10-23', status: 'Completado', type: 'Security' },
    { id: 'REP-2025-002', title: 'Log de Accesos Sospechosos', date: '2025-10-22', status: 'Revisión', type: 'Audit' },
    { id: 'REP-2025-003', title: 'Rendimiento de Servidores', date: '2025-10-22', status: 'Completado', type: 'Performance' },
    { id: 'REP-2025-004', title: 'Incidente #442 - Post Mortem', date: '2025-10-20', status: 'Archivado', type: 'Incident' },
];

export default function ReportsPage() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500 p-8">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-6">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                        <FileText className="text-purple-400" /> Reportes del Sistema
                    </h1>
                    <p className="text-sm text-gray-400 mt-1">
                        Historial de auditoría y reportes generados automáticamente.
                    </p>
                </div>
                <Link href="/dashboard/monitoring">
                    <CyberButton variant="outline" className="text-xs">
                        <ArrowLeft className="w-4 h-4 mr-2" /> VOLVER
                    </CyberButton>
                </Link>
            </div>

            <GlassCard className="p-0 overflow-hidden">
                <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                    <div className="flex gap-2">
                        <button className="px-3 py-1.5 rounded-lg bg-white/10 text-xs text-white hover:bg-white/20 transition-colors flex items-center gap-2">
                            <Filter className="w-3 h-3" /> Filtrar
                        </button>
                    </div>
                    <span className="text-xs text-gray-500">Mostrando {reports.length} resultados</span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-black/20 text-gray-400 font-medium uppercase tracking-wider text-xs">
                            <tr>
                                <th className="px-6 py-4">ID Reporte</th>
                                <th className="px-6 py-4">Título</th>
                                <th className="px-6 py-4">Fecha</th>
                                <th className="px-6 py-4">Tipo</th>
                                <th className="px-6 py-4">Estado</th>
                                <th className="px-6 py-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-gray-300">
                            {reports.map((report) => (
                                <tr key={report.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 font-mono text-xs text-purple-300">{report.id}</td>
                                    <td className="px-6 py-4 font-medium text-white">{report.title}</td>
                                    <td className="px-6 py-4">{report.date}</td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 rounded bg-white/5 border border-white/10 text-xs">
                                            {report.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs border ${report.status === 'Completado' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                                report.status === 'Revisión' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                                                    'bg-gray-500/10 text-gray-400 border-gray-500/20'
                                            }`}>
                                            {report.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-blue-400 hover:text-blue-300 transition-colors">
                                            <Download className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </GlassCard>
        </div>
    );
}
