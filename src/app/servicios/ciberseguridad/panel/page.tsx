'use client';

import { useState } from 'react';
import ServicePanel from '@/components/services/ServicePanel';
import { Shield, Eye, Network, Activity, AlertTriangle, TrendingUp, Server, Lock, Users } from 'lucide-react';
import Link from 'next/link';

export default function CiberseguridadPanelPage() {
    const stats = [
        { label: 'Eventos Hoy', value: '1,234', icon: Activity, color: 'blue' },
        { label: 'Alertas Activas', value: '20', icon: AlertTriangle, color: 'yellow' },
        { label: 'Incidentes Resueltos', value: '45', icon: Shield, color: 'green' },
        { label: 'Uptime', value: '99.9%', icon: TrendingUp, color: 'purple' },
    ];

    const services = [
        {
            id: 'soc-24x7',
            name: 'SOC 24x7',
            icon: Eye,
            description: 'Monitoreo continuo de seguridad las 24 horas',
            status: 'active',
            alerts: 12,
            link: '/servicios/ciberseguridad/panel/soc-24x7',
            color: 'blue',
            metrics: { events: '456', threats: '8', response: '< 5min' }
        },
        {
            id: 'csirt',
            name: 'CSIRT',
            icon: Shield,
            description: 'Equipo de Respuesta a Incidentes de Seguridad',
            status: 'active',
            alerts: 3,
            link: '/servicios/ciberseguridad/panel/csirt',
            color: 'red',
            metrics: { incidents: '23', resolved: '45', pending: '3' }
        },
        {
            id: 'redes',
            name: 'Gestión de Redes',
            icon: Network,
            description: 'Monitoreo y gestión de infraestructura de red',
            status: 'active',
            alerts: 5,
            link: '/servicios/ciberseguridad/panel/redes',
            color: 'green',
            metrics: { devices: '48', uptime: '99.9%', bandwidth: '85%' }
        }
    ];

    const recentActivity = [
        { time: '10:45', event: 'Nuevo escaneo de vulnerabilidades completado', severity: 'info', service: 'SOC 24x7' },
        { time: '10:30', event: 'Alerta de seguridad: Intento de acceso no autorizado', severity: 'warning', service: 'SOC 24x7' },
        { time: '10:15', event: 'Incidente #1234 resuelto', severity: 'success', service: 'CSIRT' },
        { time: '10:00', event: 'Actualización de reglas de firewall aplicada', severity: 'info', service: 'Redes' },
        { time: '09:45', event: 'Análisis de malware completado', severity: 'info', service: 'CSIRT' },
    ];

    return (
        <ServicePanel
            title="Panel Central de Ciberseguridad"
            breadcrumbs={[
                { label: 'Servicios', href: '/dashboard' },
                { label: 'Ciberseguridad', href: '/servicios/ciberseguridad' }
            ]}
        >
            <div className="space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        const colorClasses = {
                            blue: 'text-blue-400',
                            yellow: 'text-yellow-400',
                            green: 'text-green-400',
                            purple: 'text-purple-400'
                        };
                        return (
                            <div
                                key={index}
                                className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <Icon className={`w-8 h-8 ${colorClasses[stat.color as keyof typeof colorClasses]}`} />
                                    <span className={`text-3xl font-bold ${colorClasses[stat.color as keyof typeof colorClasses]}`}>
                                        {stat.value}
                                    </span>
                                </div>
                                <p className="text-gray-400 text-sm">{stat.label}</p>
                            </div>
                        );
                    })}
                </div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {services.map((service) => {
                        const Icon = service.icon;
                        const colorClasses = {
                            blue: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30', btn: 'bg-blue-500 hover:bg-blue-600' },
                            red: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30', btn: 'bg-red-500 hover:bg-red-600' },
                            green: { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/30', btn: 'bg-green-500 hover:bg-green-600' }
                        };
                        const colors = colorClasses[service.color as keyof typeof colorClasses];

                        return (
                            <Link
                                key={service.id}
                                href={service.link}
                                className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all transform hover:scale-105 cursor-pointer"
                            >
                                <div className={`p-4 rounded-lg ${colors.bg} ${colors.border} border mb-4 inline-block`}>
                                    <Icon className={`w-8 h-8 ${colors.text}`} />
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-2">{service.name}</h3>
                                <p className="text-gray-400 mb-4 text-sm">{service.description}</p>

                                {/* Metrics */}
                                <div className="grid grid-cols-3 gap-2 mb-4">
                                    {Object.entries(service.metrics).map(([key, value]) => (
                                        <div key={key} className="bg-black/30 rounded p-2">
                                            <p className="text-gray-400 text-xs capitalize">{key}</p>
                                            <p className="text-white font-semibold text-sm">{value}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                                    <span className={`px-3 py-1 rounded-full text-sm ${service.status === 'active'
                                        ? 'bg-green-500/20 text-green-300'
                                        : 'bg-red-500/20 text-red-300'
                                        }`}>
                                        {service.status === 'active' ? 'Activo' : 'Inactivo'}
                                    </span>
                                    {service.alerts > 0 && (
                                        <span className="px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-sm">
                                            {service.alerts} alertas
                                        </span>
                                    )}
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* Recent Activity */}
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                    <h2 className="text-2xl font-bold text-white mb-6">Actividad Reciente</h2>
                    <div className="space-y-4">
                        {recentActivity.map((activity, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-4 p-4 bg-black/30 rounded-lg border border-white/10"
                            >
                                <span className="text-gray-400 text-sm w-16">{activity.time}</span>
                                <div className={`w-2 h-2 rounded-full ${activity.severity === 'warning' ? 'bg-yellow-400' :
                                    activity.severity === 'success' ? 'bg-green-400' : 'bg-blue-400'
                                    }`}></div>
                                <div className="flex-1">
                                    <p className="text-white">{activity.event}</p>
                                    <p className="text-gray-400 text-sm">{activity.service}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </ServicePanel>
    );
}
