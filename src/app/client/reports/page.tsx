"use client";

import { Download, FileText, Shield, TrendingUp, Calendar } from "lucide-react";

export default function ClientReportsPage() {
    const reports = [
        { id: 1, title: "Reporte Mensual de Seguridad", type: "Seguridad", date: "2025-01-15", size: "2.4 MB", status: "available" },
        { id: 2, title: "Análisis de Vulnerabilidades Q1", type: "Auditoría", date: "2025-01-10", size: "1.8 MB", status: "available" },
        { id: 3, title: "Incidentes Resueltos - Enero", type: "Incidentes", date: "2025-01-05", size: "890 KB", status: "available" },
        { id: 4, title: "Reporte de Uptime - Diciembre", type: "Monitoreo", date: "2024-12-31", size: "1.2 MB", status: "available" },
    ];

    const stats = [
        { label: "Reportes Disponibles", value: "12", icon: FileText, color: "text-blue-400", bg: "bg-blue-500/10" },
        { label: "Incidentes Detectados", value: "8", icon: Shield, color: "text-red-400", bg: "bg-red-500/10" },
        { label: "Uptime Promedio", value: "99.9%", icon: TrendingUp, color: "text-green-400", bg: "bg-green-500/10" },
        { label: "Último Reporte", value: "Hace 2 días", icon: Calendar, color: "text-purple-400", bg: "bg-purple-500/10" },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-bold text-white mb-2">Reportes y Analíticas</h1>
                <p className="text-gray-400">Accede a tus reportes de seguridad y métricas</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {stats.map((stat, idx) => {
                    const Icon = stat.icon;
                    return (
                        <div key={idx} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all">
                            <div className={`p-3 rounded-xl ${stat.bg} w-fit mb-4`}>
                                <Icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                            <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
                            <p className="text-sm text-gray-400">{stat.label}</p>
                        </div>
                    );
                })}
            </div>

            {/* Reports List */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-white/10">
                    <h2 className="text-xl font-bold text-white">Reportes Recientes</h2>
                </div>
                <div className="divide-y divide-white/5">
                    {reports.map((report) => (
                        <div key={report.id} className="p-6 hover:bg-white/5 transition-all group">
                            <div className="flex items-center justify-between">
                                <div className="flex items-start gap-4 flex-1">
                                    <div className="p-3 rounded-xl bg-blue-500/10 group-hover:bg-blue-500/20 transition-all">
                                        <FileText className="w-6 h-6 text-blue-400" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-white mb-1">{report.title}</h3>
                                        <div className="flex items-center gap-4 text-xs text-gray-500">
                                            <span className="px-2 py-1 rounded bg-white/5 border border-white/10 text-gray-400">{report.type}</span>
                                            <span>{new Date(report.date).toLocaleDateString()}</span>
                                            <span>•</span>
                                            <span>{report.size}</span>
                                        </div>
                                    </div>
                                </div>
                                <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl font-semibold transition-all hover:scale-105 shadow-lg shadow-blue-500/20">
                                    <Download className="w-4 h-4" />
                                    Descargar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Custom Report Request */}
            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-bold text-white mb-2">¿Necesitas un reporte personalizado?</h3>
                        <p className="text-gray-400 text-sm">Solicita un análisis específico o reporte customizado para tu empresa</p>
                    </div>
                    <button className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl font-semibold transition-all whitespace-nowrap">
                        Solicitar Reporte
                    </button>
                </div>
            </div>
        </div>
    );
}
