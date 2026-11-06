'use client';

import ServicePanel from '@/components/services/ServicePanel';
import { Radar, Play, CheckCircle, XCircle, Clock, Download } from 'lucide-react';

export default function ScansPage() {
    const stats = [
        { label: 'Total Escaneos', value: '234', color: 'blue' },
        { label: 'Completados', value: '198', color: 'green' },
        { label: 'En Progreso', value: '3', color: 'yellow' },
        { label: 'Fallidos', value: '33', color: 'red' },
    ];

    const scans = [
        {
            id: 'SCAN-2024-045',
            target: 'numu.group',
            tool: 'Nmap',
            type: 'Port Scan',
            status: 'completed',
            started: '2024-01-08 14:30',
            duration: '5m 23s',
            findings: 12
        },
        {
            id: 'SCAN-2024-044',
            target: '192.168.1.0/24',
            tool: 'Nikto',
            type: 'Web Vulnerability',
            status: 'running',
            started: '2024-01-08 16:00',
            duration: '2m 15s',
            findings: 0
        },
        {
            id: 'SCAN-2024-043',
            target: 'api.numu.group',
            tool: 'SQLMap',
            type: 'SQL Injection',
            status: 'completed',
            started: '2024-01-08 12:15',
            duration: '8m 42s',
            findings: 3
        },
        {
            id: 'SCAN-2024-042',
            target: 'portal.numu.group',
            tool: 'Dirb',
            type: 'Directory Bruteforce',
            status: 'failed',
            started: '2024-01-08 10:00',
            duration: '1m 05s',
            findings: 0
        },
        {
            id: 'SCAN-2024-041',
            target: '192.168.1.10',
            tool: 'Nmap',
            type: 'Vulnerability Scan',
            status: 'completed',
            started: '2024-01-07 18:30',
            duration: '12m 18s',
            findings: 8
        },
    ];

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed': return CheckCircle;
            case 'running': return Clock;
            case 'failed': return XCircle;
            default: return Radar;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-green-500/20 text-green-300';
            case 'running': return 'bg-blue-500/20 text-blue-300';
            case 'failed': return 'bg-red-500/20 text-red-300';
            default: return 'bg-gray-500/20 text-gray-300';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'completed': return 'Completado';
            case 'running': return 'En Progreso';
            case 'failed': return 'Fallido';
            default: return status;
        }
    };

    return (
        <ServicePanel
            title="Escaneos de Seguridad"
            breadcrumbs={[
                { label: 'Servicios', href: '/dashboard' },
                { label: 'Ciberseguridad', href: '/servicios/ciberseguridad' },
                { label: 'Panel', href: '/servicios/ciberseguridad/panel' },
                { label: 'CSIRT', href: '/servicios/ciberseguridad/panel/csirt' },
                { label: 'Scans', href: '/servicios/ciberseguridad/panel/csirt/scans' }
            ]}
            headerActions={
                <button className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors flex items-center gap-2">
                    <Play className="w-4 h-4" />
                    Nuevo Escaneo
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
                            red: 'text-red-400'
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

                {/* Scans List */}
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                    <h2 className="text-2xl font-bold text-white mb-6">Historial de Escaneos</h2>
                    <div className="space-y-4">
                        {scans.map((scan) => {
                            const StatusIcon = getStatusIcon(scan.status);
                            return (
                                <div
                                    key={scan.id}
                                    className="p-5 bg-black/30 rounded-lg border border-white/10 hover:bg-white/5 transition-all cursor-pointer"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-white font-semibold">{scan.id}</h3>
                                                <span className="px-2 py-1 bg-cyan-500/20 text-cyan-300 rounded text-xs">
                                                    {scan.tool}
                                                </span>
                                                <span className={`px-3 py-1 rounded text-sm flex items-center gap-2 ${getStatusColor(scan.status)}`}>
                                                    <StatusIcon className="w-4 h-4" />
                                                    {getStatusLabel(scan.status)}
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-5 gap-4 text-sm">
                                                <div>
                                                    <p className="text-gray-500 text-xs">Objetivo</p>
                                                    <p className="text-white font-mono">{scan.target}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500 text-xs">Tipo</p>
                                                    <p className="text-white">{scan.type}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500 text-xs">Iniciado</p>
                                                    <p className="text-white">{scan.started}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500 text-xs">Duración</p>
                                                    <p className="text-white">{scan.duration}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500 text-xs">Hallazgos</p>
                                                    <p className={scan.findings > 0 ? 'text-red-400 font-semibold' : 'text-green-400'}>
                                                        {scan.findings}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        {scan.status === 'completed' && (
                                            <button className="px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg transition-colors flex items-center gap-2">
                                                <Download className="w-4 h-4" />
                                                Descargar
                                            </button>
                                        )}
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
