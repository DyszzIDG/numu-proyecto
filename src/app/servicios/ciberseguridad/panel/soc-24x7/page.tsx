'use client';

import ServicePanel from '@/components/services/ServicePanel';
import { Eye, Activity, AlertTriangle, Shield, TrendingUp, Clock, Target, Zap } from 'lucide-react';

export default function SOC24x7PanelPage() {
    const stats = [
        { label: 'Eventos Monitoreados', value: '456', icon: Activity, color: 'blue' },
        { label: 'Amenazas Detectadas', value: '8', icon: AlertTriangle, color: 'red' },
        { label: 'Tiempo de Respuesta', value: '< 5min', icon: Clock, color: 'green' },
        { label: 'Sistemas Monitoreados', value: '48', icon: Shield, color: 'purple' },
    ];

    const threats = [
        { time: '14:32', type: 'Malware', severity: 'high', source: '192.168.1.45', status: 'Bloqueado' },
        { time: '14:15', type: 'Phishing', severity: 'medium', source: 'email@suspicious.com', status: 'En análisis' },
        { time: '13:58', type: 'DDoS Attempt', severity: 'high', source: '203.45.67.89', status: 'Mitigado' },
        { time: '13:42', type: 'Brute Force', severity: 'medium', source: '10.0.0.23', status: 'Bloqueado' },
    ];

    const monitoredSystems = [
        { name: 'Firewall Principal', status: 'Operational', uptime: '99.9%', events: 234 },
        { name: 'IDS/IPS', status: 'Operational', uptime: '99.8%', events: 156 },
        { name: 'Email Gateway', status: 'Warning', uptime: '98.5%', events: 89 },
        { name: 'Web Application Firewall', status: 'Operational', uptime: '100%', events: 67 },
    ];

    return (
        <ServicePanel
            title="SOC 24x7 - Centro de Operaciones de Seguridad"
            breadcrumbs={[
                { label: 'Servicios', href: '/dashboard' },
                { label: 'Ciberseguridad', href: '/servicios/ciberseguridad' },
                { label: 'Panel', href: '/servicios/ciberseguridad/panel' },
                { label: 'SOC 24x7', href: '/servicios/ciberseguridad/panel/soc-24x7' }
            ]}
        >
            <div className="space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        const colorClasses = {
                            blue: 'text-blue-400',
                            red: 'text-red-400',
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

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Threats Detection */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                            <h2 className="text-2xl font-bold text-white mb-6">Amenazas Detectadas</h2>
                            <div className="space-y-3">
                                {threats.map((threat, index) => (
                                    <div
                                        key={index}
                                        className="p-4 bg-black/30 rounded-lg border border-white/10"
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-white font-semibold">{threat.type}</h3>
                                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${threat.severity === 'high'
                                                            ? 'bg-red-500/20 text-red-300 border border-red-500/50'
                                                            : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/50'
                                                        }`}>
                                                        {threat.severity.toUpperCase()}
                                                    </span>
                                                </div>
                                                <p className="text-gray-400 text-sm mb-1">Origen: {threat.source}</p>
                                                <p className="text-gray-500 text-xs">{threat.time}</p>
                                            </div>
                                            <span className={`px-3 py-1 rounded text-sm ${threat.status === 'Bloqueado' || threat.status === 'Mitigado'
                                                    ? 'bg-green-500/20 text-green-300'
                                                    : 'bg-yellow-500/20 text-yellow-300'
                                                }`}>
                                                {threat.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Monitored Systems */}
                        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                            <h2 className="text-2xl font-bold text-white mb-6">Sistemas Monitoreados</h2>
                            <div className="space-y-3">
                                {monitoredSystems.map((system, index) => (
                                    <div
                                        key={index}
                                        className="p-4 bg-black/30 rounded-lg border border-white/10"
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <h3 className="text-white font-semibold">{system.name}</h3>
                                            <span className={`px-3 py-1 rounded text-sm ${system.status === 'Operational'
                                                    ? 'bg-green-500/20 text-green-300'
                                                    : 'bg-yellow-500/20 text-yellow-300'
                                                }`}>
                                                {system.status}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <p className="text-gray-400">Uptime</p>
                                                <p className="text-white font-semibold">{system.uptime}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-400">Eventos Hoy</p>
                                                <p className="text-white font-semibold">{system.events}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Real-time Monitoring */}
                        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <Activity className="w-6 h-6 text-blue-400 animate-pulse" />
                                Monitoreo en Tiempo Real
                            </h3>
                            <div className="space-y-3">
                                <div className="p-3 bg-black/30 rounded-lg">
                                    <p className="text-gray-400 text-sm">Eventos/min</p>
                                    <p className="text-2xl font-bold text-blue-400">23</p>
                                </div>
                                <div className="p-3 bg-black/30 rounded-lg">
                                    <p className="text-gray-400 text-sm">Alertas Activas</p>
                                    <p className="text-2xl font-bold text-yellow-400">8</p>
                                </div>
                                <div className="p-3 bg-black/30 rounded-lg">
                                    <p className="text-gray-400 text-sm">Analistas Online</p>
                                    <p className="text-2xl font-bold text-green-400">4</p>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                            <h3 className="text-xl font-bold text-white mb-4">Acciones Rápidas</h3>
                            <div className="space-y-2">
                                <button className="w-full p-3 bg-black/30 hover:bg-white/10 border border-white/10 rounded-lg text-left text-white transition-colors flex items-center gap-3">
                                    <Target className="w-5 h-5 text-red-400" />
                                    <span>Crear Alerta</span>
                                </button>
                                <button className="w-full p-3 bg-black/30 hover:bg-white/10 border border-white/10 rounded-lg text-left text-white transition-colors flex items-center gap-3">
                                    <Shield className="w-5 h-5 text-blue-400" />
                                    <span>Bloquear IP</span>
                                </button>
                                <button className="w-full p-3 bg-black/30 hover:bg-white/10 border border-white/10 rounded-lg text-left text-white transition-colors flex items-center gap-3">
                                    <Zap className="w-5 h-5 text-yellow-400" />
                                    <span>Escaneo Manual</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ServicePanel>
    );
}
