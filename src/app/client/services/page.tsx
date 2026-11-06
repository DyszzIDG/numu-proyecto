"use client";

import { CheckCircle, Clock, AlertCircle, Settings, TrendingUp } from "lucide-react";

export default function ClientServicesPage() {
    const services = [
        {
            id: 1,
            name: "CSIRT 24/7",
            type: "Seguridad",
            status: "active",
            startDate: "2024-01-15",
            monthlyFee: 5000,
            description: "Monitoreo y respuesta a incidentes de seguridad las 24 horas",
            metrics: { incidents: 12, avgResponseTime: "15 min", uptime: "99.9%" }
        },
        {
            id: 2,
            name: "SOC Monitoring",
            type: "Monitoreo",
            status: "active",
            startDate: "2024-02-01",
            monthlyFee: 3500,
            description: "Centro de operaciones de seguridad con análisis continuo",
            metrics: { alerts: 234, falsePositives: "5%", coverage: "100%" }
        },
        {
            id: 3,
            name: "Pentesting Mensual",
            type: "Auditoría",
            status: "scheduled",
            startDate: "2024-03-01",
            monthlyFee: 2000,
            description: "Pruebas de penetración programadas mensualmente",
            metrics: { lastScan: "15 Ene", vulnsFound: 8, critical: 0 }
        },
    ];

    const getStatusBadge = (status: string) => {
        const styles = {
            active: "bg-green-500/20 text-green-400 border-green-500/30",
            scheduled: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
            suspended: "bg-red-500/20 text-red-400 border-red-500/30"
        };
        const labels = {
            active: "Activo",
            scheduled: "Programado",
            suspended: "Suspendido"
        };
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[status as keyof typeof styles]}`}>
                {labels[status as keyof typeof labels]}
            </span>
        );
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold text-white mb-2">Mis Servicios</h1>
                    <p className="text-gray-400">Gestiona y monitorea tus servicios contratados</p>
                </div>
                <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl font-semibold transition-all hover:scale-105 shadow-lg shadow-blue-500/20">
                    Solicitar Nuevo Servicio
                </button>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 gap-6">
                {services.map((service) => (
                    <div key={service.id} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all hover:shadow-xl hover:shadow-blue-500/10">
                        <div className="flex items-start justify-between mb-6">
                            <div className="flex-1">
                                <div className="flex items-center gap-4 mb-2">
                                    <h2 className="text-2xl font-bold text-white">{service.name}</h2>
                                    {getStatusBadge(service.status)}
                                </div>
                                <p className="text-gray-400 text-sm mb-1">{service.description}</p>
                                <p className="text-xs text-gray-500">Tipo: {service.type} • Desde: {new Date(service.startDate).toLocaleDateString()}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-3xl font-bold text-white">${service.monthlyFee.toLocaleString()}</p>
                                <p className="text-xs text-gray-500">USD/mes</p>
                            </div>
                        </div>

                        {/* Metrics */}
                        <div className="grid grid-cols-3 gap-4 p-4 rounded-xl bg-black/30 border border-white/5">
                            {Object.entries(service.metrics).map(([key, value], idx) => (
                                <div key={idx} className="text-center">
                                    <p className="text-2xl font-bold text-white mb-1">{value}</p>
                                    <p className="text-xs text-gray-500 uppercase tracking-wider">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                                </div>
                            ))}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3 mt-6">
                            <button className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium text-white transition-all">
                                Ver Detalles
                            </button>
                            <button className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium text-white transition-all">
                                Configuración
                            </button>
                            <button className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium text-gray-400 hover:text-white transition-all">
                                <Settings className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Summary Card */}
            <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-2xl p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-bold text-white mb-2">Resumen Mensual</h3>
                        <p className="text-gray-400 text-sm">Total de servicios activos y costo mensual</p>
                    </div>
                    <div className="text-right">
                        <p className="text-4xl font-bold text-white mb-1">${services.reduce((acc, s) => acc + s.monthlyFee, 0).toLocaleString()}</p>
                        <p className="text-sm text-gray-400">USD/mes • {services.filter(s => s.status === 'active').length} servicios activos</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
