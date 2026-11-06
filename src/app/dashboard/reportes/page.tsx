'use client';

import { useEffect, useState } from 'react';
import { FileText, Download, TrendingUp, Shield, Activity, Calendar } from 'lucide-react';

export default function ReportsPage() {
    const [loading, setLoading] = useState(false);

    const reportTypes = [
        {
            id: 'executive',
            title: 'Resumen Ejecutivo',
            description: 'Resumen de alto nivel del estado de seguridad',
            icon: TrendingUp,
            color: 'blue'
        },
        {
            id: 'vulnerabilities',
            title: 'Reporte de Vulnerabilidades',
            description: 'Listado detallado de vulnerabilidades detectadas',
            icon: Shield,
            color: 'red'
        },
        {
            id: 'scans',
            title: 'Actividad de Escaneos',
            description: 'Historial y estadísticas de escaneos realizados',
            icon: Activity,
            color: 'green'
        },
        {
            id: 'compliance',
            title: 'Cumplimiento',
            description: 'Estado de cumplimiento de políticas y estándares',
            icon: FileText,
            color: 'purple'
        }
    ];

    const handleGenerateReport = async (reportType: string) => {
        setLoading(true);
        try {
            // Simulate report generation
            await new Promise(resolve => setTimeout(resolve, 2000));
            alert(`Reporte ${reportType} generado exitosamente`);
        } catch (error) {
            console.error('Error generating report:', error);
            alert('Error al generar el reporte');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                        <FileText className="w-8 h-8 text-purple-400" />
                        Reportes
                    </h1>
                    <p className="text-gray-400">
                        Genera reportes ejecutivos y técnicos de seguridad
                    </p>
                </div>

                {/* Report Types */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {reportTypes.map((report) => {
                        const Icon = report.icon;
                        return (
                            <div
                                key={report.id}
                                className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all"
                            >
                                <div className="flex items-start gap-4 mb-4">
                                    <div className={`p-3 rounded-lg bg-${report.color}-500/10 border border-${report.color}-500/30`}>
                                        <Icon className={`w-6 h-6 text-${report.color}-400`} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-white font-semibold text-lg mb-1">
                                            {report.title}
                                        </h3>
                                        <p className="text-gray-400 text-sm">
                                            {report.description}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleGenerateReport(report.id)}
                                    disabled={loading}
                                    className="w-full px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    <Download className="w-4 h-4" />
                                    Generar Reporte
                                </button>
                            </div>
                        );
                    })}
                </div>

                {/* Recent Reports */}
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                    <h2 className="text-xl font-semibold text-white mb-4">Reportes Recientes</h2>
                    <div className="text-center py-12">
                        <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400 text-lg">
                            No hay reportes generados aún
                        </p>
                        <p className="text-gray-500 text-sm mt-2">
                            Los reportes generados aparecerán aquí
                        </p>
                    </div>
                </div>

                {/* Info Box */}
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-400" />
                        Próximamente
                    </h3>
                    <ul className="text-gray-300 space-y-1 text-sm">
                        <li>• Exportación a PDF y CSV</li>
                        <li>• Reportes programados automáticos</li>
                        <li>• Personalización de plantillas</li>
                        <li>• Envío por email</li>
                        <li>• Comparativas históricas</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
