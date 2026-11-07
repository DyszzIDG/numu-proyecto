"use client";

import React, { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { ArrowLeft, FileText, Download, Filter, RefreshCw, Eye } from "lucide-react";
import CyberButton from "@/components/ui/CyberButton";
import GlassCard from "@/components/ui/GlassCard";
import { getMonitoringReports, ReportItem } from "./actions";

export default function ReportsPage() {
    const [reports, setReports] = useState<ReportItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [isPending, startTransition] = useTransition();

    const loadReports = () => {
        startTransition(async () => {
            try {
                const data = await getMonitoringReports();
                setReports(data);
            } catch (err) {
                console.error("Error loading reports:", err);
            } finally {
                setLoading(false);
            }
        });
    };

    useEffect(() => {
        loadReports();
    }, []);

    return (
        <div className="space-y-8 animate-in fade-in duration-500 p-8">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-6">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                        <FileText className="text-purple-400" /> Reportes del Sistema
                    </h1>
                    <p className="text-sm text-gray-400 mt-1">
                        Historial de auditoría, escaneos ejecutados y reportes generados automáticamente.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={loadReports}
                        disabled={isPending}
                        className="px-3 py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-lg text-xs flex items-center gap-2 transition"
                    >
                        <RefreshCw className={`h-3.5 w-3.5 ${isPending ? 'animate-spin text-purple-400' : ''}`} />
                        <span>Actualizar</span>
                    </button>
                    <Link href="/dashboard/monitoring">
                        <CyberButton variant="outline" className="text-xs">
                            <ArrowLeft className="w-4 h-4 mr-2" /> VOLVER
                        </CyberButton>
                    </Link>
                </div>
            </div>

            <GlassCard className="p-0 overflow-hidden">
                <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                    <div className="flex gap-2">
                        <button className="px-3 py-1.5 rounded-lg bg-white/10 text-xs text-white hover:bg-white/20 transition-colors flex items-center gap-2">
                            <Filter className="w-3 h-3" /> Filtrar
                        </button>
                    </div>
                    <span className="text-xs text-gray-500 font-mono">
                        {loading ? "Cargando..." : `Mostrando ${reports.length} resultados`}
                    </span>
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
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500 animate-pulse">
                                        Cargando reportes desde la base de datos...
                                    </td>
                                </tr>
                            ) : reports.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        No se encontraron reportes registrados.
                                    </td>
                                </tr>
                            ) : (
                                reports.map((report) => (
                                    <tr key={report.id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 font-mono text-cyan-400 text-xs">{report.id}</td>
                                        <td className="px-6 py-4 font-medium text-white">{report.title}</td>
                                        <td className="px-6 py-4 text-gray-400 text-xs">{report.date}</td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-0.5 rounded text-xs bg-purple-500/10 text-purple-400 border border-purple-500/20 font-mono">
                                                {report.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-0.5 rounded text-xs border font-medium ${
                                                report.status === 'Completado' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                                report.status === 'En Ejecución' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20 animate-pulse' :
                                                report.status === 'Fallido' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                                'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                            }`}>
                                                {report.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link
                                                href="/dashboard/tools-results"
                                                className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-mono transition-colors"
                                            >
                                                <Eye className="w-3.5 h-3.5" /> Ver Detalle
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </GlassCard>
        </div>
    );
}
