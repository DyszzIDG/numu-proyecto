"use client";

import { Activity, AlertCircle, CheckCircle, Clock, CreditCard, FileText, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function ClientDashboard() {
    const stats = [
        { label: "Servicios Activos", value: "3", icon: CheckCircle, color: "text-green-400", bg: "bg-green-500/10" },
        { label: "Tickets Abiertos", value: "2", icon: AlertCircle, color: "text-yellow-400", bg: "bg-yellow-500/10" },
        { label: "Facturas Pendientes", value: "1", icon: CreditCard, color: "text-blue-400", bg: "bg-blue-500/10" },
        { label: "Uptime Promedio", value: "99.9%", icon: TrendingUp, color: "text-cyan-400", bg: "bg-cyan-500/10" },
    ];

    const services = [
        { name: "CSIRT 24/7", status: "Activo", type: "Seguridad", lastUpdate: "Hace 2 horas" },
        { name: "SOC Monitoring", status: "Activo", type: "Monitoreo", lastUpdate: "Hace 30 min" },
        { name: "Pentesting Mensual", status: "Programado", type: "Auditoría", lastUpdate: "Próximo: 15 Feb" },
    ];

    const recentActivity = [
        { action: "Nuevo reporte de seguridad disponible", time: "Hace 1 hora", type: "report" },
        { action: "Ticket #1234 resuelto", time: "Hace 3 horas", type: "ticket" },
        { action: "Factura #INV-2025-001 generada", time: "Hace 1 día", type: "invoice" },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                    Bienvenido de vuelta
                </h1>
                <p className="text-gray-400">Aquí está el resumen de tus servicios y actividad reciente</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => {
                    const Icon = stat.icon;
                    return (
                        <div key={idx} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all hover:scale-105 hover:shadow-xl hover:shadow-blue-500/10">
                            <div className="flex items-start justify-between mb-4">
                                <div className={`p-3 rounded-xl ${stat.bg}`}>
                                    <Icon className={`w-6 h-6 ${stat.color}`} />
                                </div>
                            </div>
                            <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
                            <p className="text-sm text-gray-400">{stat.label}</p>
                        </div>
                    );
                })}
            </div>

            {/* Services & Activity Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Active Services */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-white">Servicios Activos</h2>
                        <Link href="/client/services" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                            Ver todos →
                        </Link>
                    </div>
                    <div className="space-y-4">
                        {services.map((service, idx) => (
                            <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/20 transition-all">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="font-semibold text-white mb-1">{service.name}</h3>
                                        <p className="text-xs text-gray-500">{service.type}</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${service.status === 'Activo' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                                        }`}>
                                        {service.status}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 mt-3 text-xs text-gray-400">
                                    <Clock className="w-3 h-3" />
                                    {service.lastUpdate}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <Activity className="w-5 h-5 text-blue-400" />
                            Actividad Reciente
                        </h2>
                    </div>
                    <div className="space-y-4">
                        {recentActivity.map((activity, idx) => (
                            <div key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/20 transition-all">
                                <div className="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
                                <div className="flex-1">
                                    <p className="text-sm text-white mb-1">{activity.action}</p>
                                    <p className="text-xs text-gray-500">{activity.time}</p>
                                </div>
                                <FileText className="w-4 h-4 text-gray-600 flex-shrink-0" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-4">Acciones Rápidas</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link href="/client/support" className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-500/30 transition-all group">
                        <LifeBuoy className="w-6 h-6 text-blue-400 mb-2" />
                        <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors">Abrir Ticket</h3>
                        <p className="text-xs text-gray-400 mt-1">Solicita soporte técnico</p>
                    </Link>
                    <Link href="/client/billing" className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-500/30 transition-all group">
                        <CreditCard className="w-6 h-6 text-cyan-400 mb-2" />
                        <h3 className="font-semibold text-white group-hover:text-cyan-400 transition-colors">Ver Facturas</h3>
                        <p className="text-xs text-gray-400 mt-1">Gestiona tus pagos</p>
                    </Link>
                    <Link href="/client/reports" className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/30 transition-all group">
                        <FileText className="w-6 h-6 text-purple-400 mb-2" />
                        <h3 className="font-semibold text-white group-hover:text-purple-400 transition-colors">Descargar Reportes</h3>
                        <p className="text-xs text-gray-400 mt-1">Accede a tus informes</p>
                    </Link>
                </div>
            </div>
        </div>
    );
}
