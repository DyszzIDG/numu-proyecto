'use client';

import ServicePanel from '@/components/services/ServicePanel';
import { FileText, Download, Calendar, TrendingUp } from 'lucide-react';

export default function ReportesPage() {
    const stats = [
        { label: 'Reportes Generados', value: '89', color: 'blue' },
        { label: 'Este Mes', value: '12', color: 'green' },
        { label: 'Pendientes', value: '3', color: 'yellow' },
        { label: 'Compartidos', value: '45', color: 'purple' },
    ];

    const reports = [
        {
            id: 'RPT-2024-012',
            title: 'Reporte Mensual de Incidentes - Enero 2024',
            type: 'Incidentes',
            date: '2024-01-08',
            author: 'Juan Pérez',
            status: 'completed',
            pages: 24
        },
        {
            id: 'RPT-2024-011',
            title: 'Análisis de Vulnerabilidades Q1 2024',
            type: 'Vulnerabilidades',
            date: '2024-01-05',
            author: 'María González',
            status: 'completed',
            pages: 18
        },
        {
            id: 'RPT-2024-010',
            title: 'Auditoría de Seguridad - Infraestructura',
            type: 'Auditoría',
            date: '2024-01-03',
            author: 'Carlos Mora',
            status: 'completed',
            pages: 32
        },
        {
            id: 'RPT-2024-009',
            title: 'Reporte de Escaneos de Seguridad',
            type: 'Scans',
            date: '2024-01-02',
            author: 'Ana Torres',
            status: 'pending',
            pages: 0
        },
        {
            id: 'RPT-2024-008',
            title: 'Análisis de Riesgos 2024',
            type: 'Riesgos',
            date: '2023-12-28',
            author: 'Luis Ramírez',
            status: 'completed',
            pages: 45
        },
    ];

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'Incidentes': return 'bg-red-500/20 text-red-300';
            case 'Vulnerabilidades': return 'bg-orange-500/20 text-orange-300';
            case 'Auditoría': return 'bg-blue-500/20 text-blue-300';
            case 'Scans': return 'bg-cyan-500/20 text-cyan-300';
            case 'Riesgos': return 'bg-purple-500/20 text-purple-300';
            default: return 'bg-gray-500/20 text-gray-300';
        }
    };

    const getStatusColor = (status: string) => {
        return status === 'completed' ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300';
    };

    const getStatusLabel = (status: string) => {
        return status === 'completed' ? 'Completado' : 'Pendiente';
    };

    return (
        <ServicePanel
            title="Reportes CSIRT"
            breadcrumbs={[
                { label: 'Servicios', href: '/dashboard' },
                { label: 'Ciberseguridad', href: '/servicios/ciberseguridad' },
                { label: 'Panel', href: '/servicios/ciberseguridad/panel' },
                { label: 'CSIRT', href: '/servicios/ciberseguridad/panel/csirt' },
                { label: 'Reportes', href: '/servicios/ciberseguridad/panel/csirt/reportes' }
            ]}
            headerActions={
                <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Generar Reporte
                </button>
            }
        >
            <div className="space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {stats.map((stat, index) => {
                        const colorClasses = {
                            blue: 'text-blue-400',
                            green: 'text-green-400',
                            yellow: 'text-yellow-400',
                            purple: 'text-purple-400'
                        };
                        return (
                            <div
                                key={index}
                                className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6"
                            >
                                <p className="text-gray-400 text-sm mb-2">{stat.label}</p>
                                <p className={`text-3xl font-bold ${colorClasses[stat.color as keyof typeof colorClasses]}`}>
                                    {stat.value}
                                </p>
                            </div>
                        );
                    })}
                </div>

                {/* Reports List */}
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                    <h2 className="text-2xl font-bold text-white mb-6">Biblioteca de Reportes</h2>
                    <div className="space-y-4">
                        {reports.map((report) => (
                            <div
                                key={report.id}
                                className="p-5 bg-black/30 rounded-lg border border-white/10 hover:bg-white/5 transition-all cursor-pointer"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <FileText className="w-5 h-5 text-blue-400" />
                                            <h3 className="text-white font-semibold text-lg">{report.title}</h3>
                                        </div>
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className="px-2 py-1 bg-gray-500/20 text-gray-300 rounded text-xs">
                                                {report.id}
                                            </span>
                                            <span className={`px-3 py-1 rounded text-sm ${getTypeColor(report.type)}`}>
                                                {report.type}
                                            </span>
                                            <span className={`px-3 py-1 rounded text-sm ${getStatusColor(report.status)}`}>
                                                {getStatusLabel(report.status)}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-3 gap-4 text-sm text-gray-400">
                                            <div>
                                                <p className="text-gray-500 text-xs">Autor</p>
                                                <p className="text-white">{report.author}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500 text-xs">Fecha</p>
                                                <p className="text-white flex items-center gap-1">
                                                    <Calendar className="w-4 h-4" />
                                                    {report.date}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500 text-xs">Páginas</p>
                                                <p className="text-white">{report.pages || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </div>
                                    {report.status === 'completed' && (
                                        <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-2">
                                            <Download className="w-4 h-4" />
                                            Descargar PDF
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </ServicePanel>
    );
}
