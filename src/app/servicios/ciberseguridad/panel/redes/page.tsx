'use client';

import ServicePanel from '@/components/services/ServicePanel';
import { Network, Server, Wifi, Activity, TrendingUp, AlertTriangle, CheckCircle, Zap } from 'lucide-react';

export default function RedesPanelPage() {
    const stats = [
        { label: 'Dispositivos Activos', value: '48', icon: Server, color: 'green' },
        { label: 'Uptime Promedio', value: '99.9%', icon: TrendingUp, color: 'blue' },
        { label: 'Uso de Ancho de Banda', value: '85%', icon: Activity, color: 'yellow' },
        { label: 'Alertas Activas', value: '5', icon: AlertTriangle, color: 'red' },
    ];

    const devices = [
        { name: 'Router Principal', ip: '192.168.1.1', status: 'online', uptime: '99.9%', bandwidth: '75%', type: 'Router' },
        { name: 'Switch Core', ip: '192.168.1.2', status: 'online', uptime: '100%', bandwidth: '82%', type: 'Switch' },
        { name: 'Firewall', ip: '192.168.1.3', status: 'online', uptime: '99.8%', bandwidth: '45%', type: 'Firewall' },
        { name: 'Access Point 1', ip: '192.168.1.10', status: 'warning', uptime: '98.5%', bandwidth: '92%', type: 'AP' },
        { name: 'Access Point 2', ip: '192.168.1.11', status: 'online', uptime: '99.7%', bandwidth: '78%', type: 'AP' },
        { name: 'Server 1', ip: '192.168.1.100', status: 'online', uptime: '100%', bandwidth: '65%', type: 'Server' },
    ];

    const networkAlerts = [
        { time: '15:23', device: 'Access Point 1', alert: 'Alto uso de ancho de banda', severity: 'warning' },
        { time: '14:45', device: 'Router Principal', alert: 'Picos de latencia detectados', severity: 'info' },
        { time: '13:30', device: 'Switch Core', alert: 'Puerto 24 desconectado', severity: 'warning' },
        { time: '12:15', device: 'Firewall', alert: 'Regla actualizada correctamente', severity: 'success' },
    ];

    const bandwidthUsage = [
        { service: 'Web Traffic', percentage: 35, color: 'blue' },
        { service: 'Video Conferencing', percentage: 25, color: 'purple' },
        { service: 'File Transfer', percentage: 20, color: 'green' },
        { service: 'Email', percentage: 10, color: 'yellow' },
        { service: 'Others', percentage: 10, color: 'gray' },
    ];

    return (
        <ServicePanel
            title="Gestión de Redes"
            breadcrumbs={[
                { label: 'Servicios', href: '/dashboard' },
                { label: 'Ciberseguridad', href: '/servicios/ciberseguridad' },
                { label: 'Panel', href: '/servicios/ciberseguridad/panel' },
                { label: 'Redes', href: '/servicios/ciberseguridad/panel/redes' }
            ]}
        >
            <div className="space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        const colorClasses = {
                            green: 'text-green-400',
                            blue: 'text-blue-400',
                            yellow: 'text-yellow-400',
                            red: 'text-red-400'
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
                    {/* Network Devices */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                            <h2 className="text-2xl font-bold text-white mb-6">Dispositivos de Red</h2>
                            <div className="space-y-3">
                                {devices.map((device, index) => (
                                    <div
                                        key={index}
                                        className="p-4 bg-black/30 rounded-lg border border-white/10"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <Network className="w-5 h-5 text-green-400" />
                                                    <h3 className="text-white font-semibold">{device.name}</h3>
                                                    <span className="px-2 py-1 bg-gray-500/20 text-gray-300 rounded text-xs">
                                                        {device.type}
                                                    </span>
                                                </div>
                                                <p className="text-gray-400 text-sm mb-2">IP: {device.ip}</p>
                                            </div>
                                            <span className={`px-3 py-1 rounded text-sm ${device.status === 'online'
                                                    ? 'bg-green-500/20 text-green-300'
                                                    : 'bg-yellow-500/20 text-yellow-300'
                                                }`}>
                                                {device.status}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <p className="text-gray-400">Uptime</p>
                                                <p className="text-white font-semibold">{device.uptime}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-400">Bandwidth</p>
                                                <p className="text-white font-semibold">{device.bandwidth}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Network Alerts */}
                        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                            <h2 className="text-2xl font-bold text-white mb-6">Alertas de Red</h2>
                            <div className="space-y-3">
                                {networkAlerts.map((alert, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-4 p-4 bg-black/30 rounded-lg border border-white/10"
                                    >
                                        <span className="text-gray-400 text-sm w-16">{alert.time}</span>
                                        <div className={`w-2 h-2 rounded-full ${alert.severity === 'warning' ? 'bg-yellow-400' :
                                                alert.severity === 'success' ? 'bg-green-400' : 'bg-blue-400'
                                            }`}></div>
                                        <div className="flex-1">
                                            <p className="text-white font-semibold">{alert.device}</p>
                                            <p className="text-gray-400 text-sm">{alert.alert}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Bandwidth Usage */}
                        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                            <h3 className="text-xl font-bold text-white mb-4">Uso de Ancho de Banda</h3>
                            <div className="space-y-4">
                                {bandwidthUsage.map((item, index) => (
                                    <div key={index}>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-gray-300 text-sm">{item.service}</span>
                                            <span className="text-white font-semibold text-sm">{item.percentage}%</span>
                                        </div>
                                        <div className="w-full bg-gray-700 rounded-full h-2">
                                            <div
                                                className={`bg-${item.color}-500 h-2 rounded-full transition-all`}
                                                style={{ width: `${item.percentage}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Network Health */}
                        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                            <h3 className="text-xl font-bold text-white mb-4">Salud de Red</h3>
                            <div className="space-y-3">
                                <div className="p-3 bg-black/30 rounded-lg">
                                    <p className="text-gray-400 text-sm">Latencia Promedio</p>
                                    <p className="text-2xl font-bold text-green-400">12ms</p>
                                </div>
                                <div className="p-3 bg-black/30 rounded-lg">
                                    <p className="text-gray-400 text-sm">Pérdida de Paquetes</p>
                                    <p className="text-2xl font-bold text-green-400">0.1%</p>
                                </div>
                                <div className="p-3 bg-black/30 rounded-lg">
                                    <p className="text-gray-400 text-sm">Throughput</p>
                                    <p className="text-2xl font-bold text-blue-400">850 Mbps</p>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                            <h3 className="text-xl font-bold text-white mb-4">Acciones Rápidas</h3>
                            <div className="space-y-2">
                                <button className="w-full p-3 bg-black/30 hover:bg-white/10 border border-white/10 rounded-lg text-left text-white transition-colors flex items-center gap-3">
                                    <Wifi className="w-5 h-5 text-blue-400" />
                                    <span>Escanear Red</span>
                                </button>
                                <button className="w-full p-3 bg-black/30 hover:bg-white/10 border border-white/10 rounded-lg text-left text-white transition-colors flex items-center gap-3">
                                    <Zap className="w-5 h-5 text-yellow-400" />
                                    <span>Reiniciar Dispositivo</span>
                                </button>
                                <button className="w-full p-3 bg-black/30 hover:bg-white/10 border border-white/10 rounded-lg text-left text-white transition-colors flex items-center gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-400" />
                                    <span>Test de Conectividad</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ServicePanel>
    );
}
