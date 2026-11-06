'use client';

import { useState } from 'react';
import ServicePanel from '@/components/services/ServicePanel';
import { Shield, AlertTriangle, TrendingDown, Filter, Search, Download } from 'lucide-react';

export default function VulnerabilidadesPage() {
    const [filter, setFilter] = useState('all');

    const stats = [
        { label: 'Total', value: '48', color: 'blue' },
        { label: 'Críticas', value: '12', color: 'red' },
        { label: 'Altas', value: '18', color: 'orange' },
        { label: 'Parcheadas', value: '23', color: 'green' },
    ];

    const vulnerabilities = [
        {
            id: 'CVE-2024-0001',
            title: 'SQL Injection en módulo de autenticación',
            severity: 'critical',
            cvss: 9.8,
            status: 'open',
            affected: 'Web Application v2.3',
            discovered: '2024-01-08',
            cwe: 'CWE-89'
        },
        {
            id: 'CVE-2024-0002',
            title: 'Cross-Site Scripting (XSS) en formulario de contacto',
            severity: 'high',
            cvss: 7.5,
            status: 'in-progress',
            affected: 'Portal Cliente v1.5',
            discovered: '2024-01-07',
            cwe: 'CWE-79'
        },
        {
            id: 'CVE-2024-0003',
            title: 'Exposición de información sensible en logs',
            severity: 'medium',
            cvss: 5.3,
            status: 'patched',
            affected: 'API Gateway v3.1',
            discovered: '2024-01-06',
            cwe: 'CWE-532'
        },
        {
            id: 'CVE-2024-0004',
            title: 'Buffer Overflow en servicio de procesamiento',
            severity: 'critical',
            cvss: 9.1,
            status: 'open',
            affected: 'Data Processor v2.0',
            discovered: '2024-01-05',
            cwe: 'CWE-120'
        },
        {
            id: 'CVE-2024-0005',
            title: 'Autenticación débil en panel administrativo',
            severity: 'high',
            cvss: 8.2,
            status: 'in-progress',
            affected: 'Admin Panel v1.8',
            discovered: '2024-01-04',
            cwe: 'CWE-287'
        },
    ];

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'critical': return { bg: 'bg-red-500/20', text: 'text-red-300', border: 'border-red-500/50' };
            case 'high': return { bg: 'bg-orange-500/20', text: 'text-orange-300', border: 'border-orange-500/50' };
            case 'medium': return { bg: 'bg-yellow-500/20', text: 'text-yellow-300', border: 'border-yellow-500/50' };
            case 'low': return { bg: 'bg-blue-500/20', text: 'text-blue-300', border: 'border-blue-500/50' };
            default: return { bg: 'bg-gray-500/20', text: 'text-gray-300', border: 'border-gray-500/50' };
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'open': return 'bg-red-500/20 text-red-300';
            case 'in-progress': return 'bg-blue-500/20 text-blue-300';
            case 'patched': return 'bg-green-500/20 text-green-300';
            default: return 'bg-gray-500/20 text-gray-300';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'open': return 'Abierta';
            case 'in-progress': return 'En Progreso';
            case 'patched': return 'Parcheada';
            default: return status;
        }
    };

    return (
        <ServicePanel
            title="Gestión de Vulnerabilidades"
            breadcrumbs={[
                { label: 'Servicios', href: '/dashboard' },
                { label: 'Ciberseguridad', href: '/servicios/ciberseguridad' },
                { label: 'Panel', href: '/servicios/ciberseguridad/panel' },
                { label: 'CSIRT', href: '/servicios/ciberseguridad/panel/csirt' },
                { label: 'Vulnerabilidades', href: '/servicios/ciberseguridad/panel/csirt/vulnerabilidades' }
            ]}
            headerActions={
                <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Exportar Reporte
                </button>
            }
        >
            <div className="space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {stats.map((stat, index) => {
                        const colorClasses = {
                            blue: 'text-blue-400',
                            red: 'text-red-400',
                            orange: 'text-orange-400',
                            green: 'text-green-400'
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
                                placeholder="Buscar vulnerabilidades..."
                                className="w-full pl-10 pr-4 py-2 bg-black/30 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setFilter('all')}
                                className={`px-4 py-2 rounded-lg transition-colors ${filter === 'all'
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                    }`}
                            >
                                Todas
                            </button>
                            <button
                                onClick={() => setFilter('critical')}
                                className={`px-4 py-2 rounded-lg transition-colors ${filter === 'critical'
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                    }`}
                            >
                                Críticas
                            </button>
                            <button
                                onClick={() => setFilter('open')}
                                className={`px-4 py-2 rounded-lg transition-colors ${filter === 'open'
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                    }`}
                            >
                                Abiertas
                            </button>
                        </div>
                    </div>
                </div>

                {/* Vulnerabilities List */}
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                    <h2 className="text-2xl font-bold text-white mb-6">Vulnerabilidades Detectadas</h2>
                    <div className="space-y-4">
                        {vulnerabilities.map((vuln) => {
                            const severityColors = getSeverityColor(vuln.severity);
                            return (
                                <div
                                    key={vuln.id}
                                    className="p-5 bg-black/30 rounded-lg border border-white/10 hover:bg-white/5 transition-all cursor-pointer"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-white font-semibold">{vuln.id}</h3>
                                                <span className={`px-2 py-1 rounded text-xs font-semibold border ${severityColors.bg} ${severityColors.text} ${severityColors.border}`}>
                                                    {vuln.severity.toUpperCase()}
                                                </span>
                                                <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs">
                                                    CVSS: {vuln.cvss}
                                                </span>
                                                <span className={`px-3 py-1 rounded text-sm ${getStatusColor(vuln.status)}`}>
                                                    {getStatusLabel(vuln.status)}
                                                </span>
                                            </div>
                                            <h4 className="text-white text-lg mb-2">{vuln.title}</h4>
                                            <div className="grid grid-cols-3 gap-4 text-sm text-gray-400">
                                                <div>
                                                    <p className="text-gray-500 text-xs">Sistema Afectado</p>
                                                    <p className="text-white">{vuln.affected}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500 text-xs">CWE</p>
                                                    <p className="text-white">{vuln.cwe}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500 text-xs">Descubierta</p>
                                                    <p className="text-white">{vuln.discovered}</p>
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
