'use client';

import { useState } from 'react';
import ServicePanel from '@/components/services/ServicePanel';
import { Server, Monitor, Smartphone, HardDrive, Wifi, Search, Plus } from 'lucide-react';

export default function ActivosPage() {
    const [filter, setFilter] = useState('all');

    const stats = [
        { label: 'Total Activos', value: '156', color: 'blue' },
        { label: 'Servidores', value: '24', color: 'purple' },
        { label: 'Endpoints', value: '98', color: 'green' },
        { label: 'Dispositivos Red', value: '34', color: 'yellow' },
    ];

    const assets = [
        {
            id: 'SRV-001',
            name: 'Servidor Web Principal',
            type: 'server',
            ip: '192.168.1.10',
            os: 'Ubuntu 22.04 LTS',
            status: 'active',
            criticality: 'high',
            lastScan: '2024-01-08 14:30',
            vulnerabilities: 3
        },
        {
            id: 'SRV-002',
            name: 'Base de Datos Producción',
            type: 'server',
            ip: '192.168.1.11',
            os: 'CentOS 8',
            status: 'active',
            criticality: 'critical',
            lastScan: '2024-01-08 12:15',
            vulnerabilities: 1
        },
        {
            id: 'WKS-045',
            name: 'Workstation Finanzas',
            type: 'endpoint',
            ip: '192.168.2.45',
            os: 'Windows 11 Pro',
            status: 'active',
            criticality: 'medium',
            lastScan: '2024-01-08 10:00',
            vulnerabilities: 0
        },
        {
            id: 'NET-001',
            name: 'Firewall Principal',
            type: 'network',
            ip: '192.168.1.1',
            os: 'pfSense 2.7',
            status: 'active',
            criticality: 'critical',
            lastScan: '2024-01-08 16:00',
            vulnerabilities: 0
        },
        {
            id: 'MOB-012',
            name: 'iPhone CEO',
            type: 'mobile',
            ip: '192.168.3.12',
            os: 'iOS 17.2',
            status: 'active',
            criticality: 'high',
            lastScan: '2024-01-07 18:30',
            vulnerabilities: 0
        },
    ];

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'server': return Server;
            case 'endpoint': return Monitor;
            case 'mobile': return Smartphone;
            case 'network': return Wifi;
            default: return HardDrive;
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'server': return 'text-purple-400';
            case 'endpoint': return 'text-blue-400';
            case 'mobile': return 'text-green-400';
            case 'network': return 'text-yellow-400';
            default: return 'text-gray-400';
        }
    };

    const getCriticalityColor = (criticality: string) => {
        switch (criticality) {
            case 'critical': return 'bg-red-500/20 text-red-300 border-red-500/50';
            case 'high': return 'bg-orange-500/20 text-orange-300 border-orange-500/50';
            case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50';
            case 'low': return 'bg-blue-500/20 text-blue-300 border-blue-500/50';
            default: return 'bg-gray-500/20 text-gray-300 border-gray-500/50';
        }
    };

    const getStatusColor = (status: string) => {
        return status === 'active' ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-300';
    };

    return (
        <ServicePanel
            title="Gestión de Activos"
            breadcrumbs={[
                { label: 'Servicios', href: '/dashboard' },
                { label: 'Ciberseguridad', href: '/servicios/ciberseguridad' },
                { label: 'Panel', href: '/servicios/ciberseguridad/panel' },
                { label: 'CSIRT', href: '/servicios/ciberseguridad/panel/csirt' },
                { label: 'Activos', href: '/servicios/ciberseguridad/panel/csirt/activos' }
            ]}
            headerActions={
                <button className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Registrar Activo
                </button>
            }
        >
            <div className="space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {stats.map((stat, index) => {
                        const colorClasses = {
                            blue: 'text-blue-400',
                            purple: 'text-purple-400',
                            green: 'text-green-400',
                            yellow: 'text-yellow-400'
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

                {/* Filters */}
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Buscar activos..."
                                className="w-full pl-10 pr-4 py-2 bg-black/30 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setFilter('all')}
                                className={`px-4 py-2 rounded-lg transition-colors ${filter === 'all'
                                        ? 'bg-green-500 text-white'
                                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                    }`}
                            >
                                Todos
                            </button>
                            <button
                                onClick={() => setFilter('server')}
                                className={`px-4 py-2 rounded-lg transition-colors ${filter === 'server'
                                        ? 'bg-green-500 text-white'
                                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                    }`}
                            >
                                Servidores
                            </button>
                            <button
                                onClick={() => setFilter('endpoint')}
                                className={`px-4 py-2 rounded-lg transition-colors ${filter === 'endpoint'
                                        ? 'bg-green-500 text-white'
                                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                    }`}
                            >
                                Endpoints
                            </button>
                        </div>
                    </div>
                </div>

                {/* Assets List */}
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                    <h2 className="text-2xl font-bold text-white mb-6">Inventario de Activos</h2>
                    <div className="space-y-4">
                        {assets.map((asset) => {
                            const Icon = getTypeIcon(asset.type);
                            const iconColor = getTypeColor(asset.type);
                            return (
                                <div
                                    key={asset.id}
                                    className="p-5 bg-black/30 rounded-lg border border-white/10 hover:bg-white/5 transition-all cursor-pointer"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`p-3 bg-white/5 rounded-lg ${iconColor}`}>
                                            <Icon className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-white font-semibold text-lg">{asset.name}</h3>
                                                <span className="px-2 py-1 bg-gray-500/20 text-gray-300 rounded text-xs">
                                                    {asset.id}
                                                </span>
                                                <span className={`px-2 py-1 rounded text-xs font-semibold border ${getCriticalityColor(asset.criticality)}`}>
                                                    {asset.criticality.toUpperCase()}
                                                </span>
                                                <span className={`px-3 py-1 rounded text-sm ${getStatusColor(asset.status)}`}>
                                                    {asset.status === 'active' ? 'Activo' : 'Inactivo'}
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-4 gap-4 text-sm">
                                                <div>
                                                    <p className="text-gray-500 text-xs">IP Address</p>
                                                    <p className="text-white">{asset.ip}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500 text-xs">Sistema Operativo</p>
                                                    <p className="text-white">{asset.os}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500 text-xs">Último Escaneo</p>
                                                    <p className="text-white">{asset.lastScan}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500 text-xs">Vulnerabilidades</p>
                                                    <p className={asset.vulnerabilities > 0 ? 'text-red-400 font-semibold' : 'text-green-400'}>
                                                        {asset.vulnerabilities}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </ServicePanel>
    );
}
