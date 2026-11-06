'use client';

import { useState } from 'react';
import ServicePanel from '@/components/services/ServicePanel';
import { AlertTriangle, Clock, Users, TrendingUp, Filter, Search, Plus } from 'lucide-react';

export default function IncidentesPage() {
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const stats = [
        { label: 'Activos', value: '3', color: 'red' },
        { label: 'En Progreso', value: '5', color: 'yellow' },
        { label: 'Resueltos (Mes)', value: '45', color: 'green' },
        { label: 'Tiempo Promedio', value: '2.5h', color: 'blue' },
    ];

    const incidents = [
        {
            id: 'INC-2024-045',
            title: 'Intento de acceso no autorizado a servidor de producción',
            severity: 'critical',
            status: 'active',
            assignee: 'Juan Pérez',
            created: '2024-01-08 14:30',
            updated: '2024-01-08 16:45',
            description: 'Múltiples intentos de acceso SSH desde IP desconocida'
        },
        {
            id: 'INC-2024-044',
            title: 'Malware detectado en endpoint del departamento de finanzas',
            severity: 'high',
            status: 'in-progress',
            assignee: 'María González',
            created: '2024-01-08 10:15',
            updated: '2024-01-08 15:20',
            description: 'Ransomware bloqueado por antivirus, análisis en curso'
        },
        {
            id: 'INC-2024-043',
            title: 'Campaña de phishing dirigida a empleados',
            severity: 'medium',
            status: 'in-progress',
            assignee: 'Carlos Mora',
            created: '2024-01-07 16:00',
            updated: '2024-01-08 09:30',
            description: 'Email sospechoso reportado por 5 usuarios'
        },
        {
            id: 'INC-2024-042',
            title: 'Fuga de datos detectada en aplicación web',
            severity: 'critical',
            status: 'resolved',
            assignee: 'Ana Torres',
            created: '2024-01-06 11:20',
            updated: '2024-01-07 18:45',
            description: 'Vulnerabilidad SQL injection explotada, parcheada'
        },
        {
            id: 'INC-2024-041',
            title: 'DDoS attack mitigado',
            severity: 'high',
            status: 'resolved',
            assignee: 'Luis Ramírez',
            created: '2024-01-05 08:30',
            updated: '2024-01-05 14:20',
            description: 'Ataque DDoS de 50Gbps bloqueado exitosamente'
        },
    ];

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'critical': return 'bg-red-500/20 text-red-300 border-red-500/50';
            case 'high': return 'bg-orange-500/20 text-orange-300 border-orange-500/50';
            case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50';
            case 'low': return 'bg-blue-500/20 text-blue-300 border-blue-500/50';
            default: return 'bg-gray-500/20 text-gray-300 border-gray-500/50';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-red-500/20 text-red-300';
            case 'in-progress': return 'bg-blue-500/20 text-blue-300';
            case 'resolved': return 'bg-green-500/20 text-green-300';
            default: return 'bg-gray-500/20 text-gray-300';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'active': return 'Activo';
            case 'in-progress': return 'En Progreso';
            case 'resolved': return 'Resuelto';
            default: return status;
        }
    };

    return (
        <ServicePanel
            title="Gestión de Incidentes"
            breadcrumbs={[
                { label: 'Servicios', href: '/dashboard' },
                { label: 'Ciberseguridad', href: '/servicios/ciberseguridad' },
                { label: 'Panel', href: '/servicios/ciberseguridad/panel' },
                { label: 'CSIRT', href: '/servicios/ciberseguridad/panel/csirt' },
                { label: 'Incidentes', href: '/servicios/ciberseguridad/panel/csirt/incidentes' }
            ]}
            headerActions={
                <button className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Nuevo Incidente
                </button>
            }
        >
            <div className="space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {stats.map((stat, index) => {
                        const colorClasses = {
                            red: 'text-red-400',
                            yellow: 'text-yellow-400',
                            green: 'text-green-400',
                            blue: 'text-blue-400'
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
                                placeholder="Buscar incidentes..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-black/30 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setFilter('all')}
                                className={`px-4 py-2 rounded-lg transition-colors ${filter === 'all'
                                        ? 'bg-red-500 text-white'
                                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                    }`}
                            >
                                Todos
                            </button>
                            <button
                                onClick={() => setFilter('active')}
                                className={`px-4 py-2 rounded-lg transition-colors ${filter === 'active'
                                        ? 'bg-red-500 text-white'
                                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                    }`}
                            >
                                Activos
                            </button>
                            <button
                                onClick={() => setFilter('resolved')}
                                className={`px-4 py-2 rounded-lg transition-colors ${filter === 'resolved'
                                        ? 'bg-red-500 text-white'
                                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                    }`}
                            >
                                Resueltos
                            </button>
                        </div>
                    </div>
                </div>

                {/* Incidents List */}
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                    <h2 className="text-2xl font-bold text-white mb-6">Incidentes</h2>
                    <div className="space-y-4">
                        {incidents.map((incident) => (
                            <div
                                key={incident.id}
                                className="p-5 bg-black/30 rounded-lg border border-white/10 hover:bg-white/5 transition-all cursor-pointer"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-white font-semibold">{incident.id}</h3>
                                            <span className={`px-2 py-1 rounded text-xs font-semibold border ${getSeverityColor(incident.severity)}`}>
                                                {incident.severity.toUpperCase()}
                                            </span>
                                            <span className={`px-3 py-1 rounded text-sm ${getStatusColor(incident.status)}`}>
                                                {getStatusLabel(incident.status)}
                                            </span>
                                        </div>
                                        <h4 className="text-white text-lg mb-2">{incident.title}</h4>
                                        <p className="text-gray-400 text-sm mb-3">{incident.description}</p>
                                        <div className="flex items-center gap-4 text-sm text-gray-400">
                                            <span className="flex items-center gap-1">
                                                <Users className="w-4 h-4" />
                                                {incident.assignee}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-4 h-4" />
                                                Creado: {incident.created}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <TrendingUp className="w-4 h-4" />
                                                Actualizado: {incident.updated}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </ServicePanel>
    );
}
