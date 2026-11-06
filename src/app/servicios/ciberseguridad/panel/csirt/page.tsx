'use client';

import ServicePanel from '@/components/services/ServicePanel';
import { Shield, AlertTriangle, CheckCircle, Clock, FileText, Users, TrendingUp, Activity } from 'lucide-react';
import Link from 'next/link';

export default function CSIRTPanelPage() {
    const stats = [
        { label: 'Incidentes Activos', value: '3', icon: AlertTriangle, color: 'red' },
        { label: 'Resueltos Este Mes', value: '45', icon: CheckCircle, color: 'green' },
        { label: 'Tiempo Promedio', value: '2.5h', icon: Clock, color: 'blue' },
        { label: 'Vulnerabilidades', value: '12', icon: Shield, color: 'yellow' },
    ];

    const incidents = [
        { id: '#INC-2024-045', title: 'Intento de acceso no autorizado', severity: 'high', status: 'En progreso', assignee: 'Juan Pérez', time: '2h' },
        { id: '#INC-2024-044', title: 'Malware detectado en endpoint', severity: 'critical', status: 'En análisis', assignee: 'María González', time: '4h' },
        { id: '#INC-2024-043', title: 'Phishing reportado', severity: 'medium', status: 'Resuelto', assignee: 'Carlos Mora', time: '1d' },
    ];

    const quickLinks = [
        { name: 'Incidentes', href: '/servicios/ciberseguridad/panel/csirt/incidentes', icon: AlertTriangle, count: 3 },
        { name: 'Vulnerabilidades', href: '/servicios/ciberseguridad/panel/csirt/vulnerabilidades', icon: Shield, count: 12 },
        { name: 'Activos', href: '/servicios/ciberseguridad/panel/csirt/activos', icon: Activity, count: 48 },
        { name: 'Scans', href: '/servicios/ciberseguridad/panel/csirt/scans', icon: Activity, count: 234 },
        { name: 'Reportes', href: '/servicios/ciberseguridad/panel/csirt/reportes', icon: FileText, count: 89 },
    ];

    return (
        <ServicePanel
            title="CSIRT - Equipo de Respuesta a Incidentes"
            breadcrumbs={[
                { label: 'Servicios', href: '/dashboard' },
                { label: 'Ciberseguridad', href: '/servicios/ciberseguridad' },
                { label: 'Panel', href: '/servicios/ciberseguridad/panel' },
                { label: 'CSIRT', href: '/servicios/ciberseguridad/panel/csirt' }
            ]}
            headerActions={
                <button className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors">
                    + Nuevo Incidente
                </button>
            }
        >
            <div className="space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        const colorClasses = {
                            red: 'text-red-400',
                            green: 'text-green-400',
                            blue: 'text-blue-400',
                            yellow: 'text-yellow-400'
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

                {/* Quick Links */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {quickLinks.map((link, index) => {
                        const Icon = link.icon;
                        return (
                            <Link
                                key={index}
                                href={link.href}
                                className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all transform hover:scale-105"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <Icon className="w-8 h-8 text-red-400" />
                                    <span className="text-2xl font-bold text-white">{link.count}</span>
                                </div>
                                <h3 className="text-white font-semibold">{link.name}</h3>
                            </Link>
                        );
                    })}
                </div>

                {/* Active Incidents */}
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                    <h2 className="text-2xl font-bold text-white mb-6">Incidentes Activos</h2>
                    <div className="space-y-3">
                        {incidents.map((incident, index) => (
                            <div
                                key={index}
                                className="p-4 bg-black/30 rounded-lg border border-white/10 hover:bg-white/5 transition-all cursor-pointer"
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-white font-semibold">{incident.id}</h3>
                                            <span className={`px-2 py-1 rounded text-xs font-semibold ${incident.severity === 'critical'
                                                ? 'bg-red-500/20 text-red-300 border border-red-500/50'
                                                : incident.severity === 'high'
                                                    ? 'bg-orange-500/20 text-orange-300 border border-orange-500/50'
                                                    : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/50'
                                                }`}>
                                                {incident.severity.toUpperCase()}
                                            </span>
                                        </div>
                                        <p className="text-gray-300 mb-2">{incident.title}</p>
                                        <div className="flex items-center gap-4 text-sm text-gray-400">
                                            <span className="flex items-center gap-1">
                                                <Users className="w-4 h-4" />
                                                {incident.assignee}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-4 h-4" />
                                                Hace {incident.time}
                                            </span>
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 rounded text-sm ${incident.status === 'Resuelto'
                                        ? 'bg-green-500/20 text-green-300'
                                        : 'bg-blue-500/20 text-blue-300'
                                        }`}>
                                        {incident.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Link
                        href="/servicios/ciberseguridad/panel/csirt/incidentes"
                        className="mt-4 block text-center text-blue-400 hover:text-blue-300 transition-colors"
                    >
                        Ver todos los incidentes →
                    </Link>
                </div>
            </div>
        </ServicePanel>
    );
}
