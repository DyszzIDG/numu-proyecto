'use client';

import { useState, useEffect } from 'react';
import { Shield, AlertTriangle, Activity, TrendingUp, Clock, ArrowLeft, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { mockIncidents, mockEvents, mockMetrics, generateRandomEvent, type SOCIncident, type SOCEvent } from '@/lib/mock/soc-mock-data';

export default function SOC247PanelPage() {
    const [incidents, setIncidents] = useState<SOCIncident[]>(mockIncidents);
    const [events, setEvents] = useState<SOCEvent[]>(mockEvents);
    const [metrics, setMetrics] = useState(mockMetrics);
    const [selectedIncident, setSelectedIncident] = useState<SOCIncident | null>(null);

    // Simulate real-time event updates
    useEffect(() => {
        const interval = setInterval(() => {
            const newEvent = generateRandomEvent();
            setEvents(prev => [newEvent, ...prev].slice(0, 50));

            // Update metrics
            setMetrics(prev => ({
                ...prev,
                eventsPerSecond: Math.floor(Math.random() * 2000) + 1000,
                activeAlerts: Math.floor(Math.random() * 50) + 10
            }));
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-950/20 to-gray-900 p-8">
            <div className="max-w-[1800px] mx-auto space-y-8">
                {/* Header */}
                <div>
                    <Link
                        href="/servicios/soc-24-7"
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Volver a Información del SOC
                    </Link>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 shadow-[0_0_30px_rgba(37,99,235,0.3)]">
                                <Shield className="w-10 h-10 text-blue-400" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold text-white mb-2">
                                    SOC 24/7 - Panel Operativo
                                </h1>
                                <p className="text-gray-400 text-lg">
                                    Monitoreo y gestión de seguridad en tiempo real
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-lg">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-green-400 font-semibold">Operativo</span>
                            </div>
                            <button className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors">
                                <RefreshCw className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Metrics Dashboard */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
                    <MetricCard
                        title="Eventos/Seg"
                        value={metrics.eventsPerSecond.toLocaleString()}
                        icon={Activity}
                        color="blue"
                        trend="+12%"
                    />
                    <MetricCard
                        title="Alertas Activas"
                        value={metrics.activeAlerts.toString()}
                        icon={AlertTriangle}
                        color="yellow"
                        trend="+3"
                    />
                    <MetricCard
                        title="Incidentes Abiertos"
                        value={metrics.openIncidents.toString()}
                        icon={Shield}
                        color="red"
                        trend="-2"
                    />
                    <MetricCard
                        title="Sistemas Monitoreados"
                        value={metrics.systemsMonitored.toString()}
                        icon={TrendingUp}
                        color="green"
                        trend="100%"
                    />
                    <MetricCard
                        title="Amenazas Bloqueadas"
                        value={metrics.threatsBlocked.toLocaleString()}
                        icon={Shield}
                        color="purple"
                        trend="+156"
                    />
                    <MetricCard
                        title="Tiempo de Respuesta"
                        value={metrics.avgResponseTime}
                        icon={Clock}
                        color="cyan"
                        trend="-3 min"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Incidents List */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
                            <h2 className="text-2xl font-bold text-white mb-6">Incidentes Activos</h2>
                            <div className="space-y-3">
                                {incidents.map((incident) => (
                                    <IncidentCard
                                        key={incident.id}
                                        incident={incident}
                                        isSelected={selectedIncident?.id === incident.id}
                                        onClick={() => setSelectedIncident(incident)}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Event Stream */}
                        <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
                            <h2 className="text-2xl font-bold text-white mb-6">Stream de Eventos en Tiempo Real</h2>
                            <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar">
                                {events.map((event) => (
                                    <EventItem key={event.id} event={event} />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Incident Details / Threat Map */}
                    <div className="space-y-6">
                        {selectedIncident ? (
                            <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-bold text-white">Detalles del Incidente</h2>
                                    <button
                                        onClick={() => setSelectedIncident(null)}
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >
                                        ✕
                                    </button>
                                </div>
                                <IncidentDetails incident={selectedIncident} />
                            </div>
                        ) : (
                            <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
                                <h2 className="text-xl font-bold text-white mb-4">Selecciona un Incidente</h2>
                                <p className="text-gray-400 text-sm">
                                    Haz clic en un incidente para ver sus detalles completos
                                </p>
                            </div>
                        )}

                        {/* Quick Stats */}
                        <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
                            <h2 className="text-xl font-bold text-white mb-4">Estadísticas Rápidas</h2>
                            <div className="space-y-3">
                                <QuickStat label="Incidentes Críticos" value="2" color="red" />
                                <QuickStat label="Incidentes Altos" value="3" color="orange" />
                                <QuickStat label="Incidentes Medios" value="5" color="yellow" />
                                <QuickStat label="Incidentes Bajos" value="8" color="blue" />
                            </div>
                        </div>

                        {/* System Health */}
                        <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
                            <h2 className="text-xl font-bold text-white mb-4">Salud del Sistema</h2>
                            <div className="space-y-3">
                                <HealthBar label="SIEM" percentage={98} />
                                <HealthBar label="IDS/IPS" percentage={100} />
                                <HealthBar label="EDR" percentage={95} />
                                <HealthBar label="Firewall" percentage={100} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function MetricCard({ title, value, icon: Icon, color, trend }: any) {
    const colorClasses: Record<string, string> = {
        blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
        yellow: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
        red: "bg-red-500/10 text-red-400 border-red-500/20",
        green: "bg-green-500/10 text-green-400 border-green-500/20",
        purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
        cyan: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    };

    return (
        <div className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all backdrop-blur-sm group">
            <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg ${colorClasses[color]} group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5" />
                </div>
            </div>
            <p className="text-gray-400 text-sm mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-white mb-1">{value}</h3>
            <p className="text-xs text-gray-500">{trend}</p>
        </div>
    );
}

function IncidentCard({ incident, isSelected, onClick }: { incident: SOCIncident; isSelected: boolean; onClick: () => void }) {
    const severityColors = {
        critical: 'bg-red-500/20 text-red-400 border-red-500/30',
        high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
        medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        low: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    };

    const statusColors = {
        open: 'bg-blue-500/20 text-blue-400',
        investigating: 'bg-yellow-500/20 text-yellow-400',
        contained: 'bg-orange-500/20 text-orange-400',
        resolved: 'bg-green-500/20 text-green-400'
    };

    return (
        <button
            onClick={onClick}
            className={`w-full p-4 rounded-lg border-2 transition-all text-left ${isSelected
                    ? 'bg-blue-500/20 border-blue-500/60'
                    : 'bg-black/20 border-white/5 hover:border-white/10'
                }`}
        >
            <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${severityColors[incident.severity]}`}>
                        {incident.severity.toUpperCase()}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${statusColors[incident.status]}`}>
                        {incident.status}
                    </span>
                </div>
                <span className="text-xs text-gray-500">{incident.id}</span>
            </div>
            <h3 className="text-white font-semibold mb-1">{incident.title}</h3>
            <p className="text-sm text-gray-400 mb-2">{incident.description}</p>
            <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Asignado a: {incident.assignedTo}</span>
                <span>{new Date(incident.createdAt).toLocaleTimeString()}</span>
            </div>
        </button>
    );
}

function EventItem({ event }: { event: SOCEvent }) {
    const severityColors = {
        critical: 'border-l-red-500 bg-red-500/5',
        high: 'border-l-orange-500 bg-orange-500/5',
        medium: 'border-l-yellow-500 bg-yellow-500/5',
        low: 'border-l-blue-500 bg-blue-500/5',
        info: 'border-l-gray-500 bg-gray-500/5'
    };

    return (
        <div className={`p-3 rounded-lg border-l-4 ${severityColors[event.severity]} bg-black/20`}>
            <div className="flex items-start justify-between mb-1">
                <span className="text-xs font-mono text-gray-500">
                    {event.timestamp.toLocaleTimeString()}
                </span>
                <span className="text-xs text-gray-400">{event.type}</span>
            </div>
            <p className="text-sm text-white">{event.message}</p>
            <p className="text-xs text-gray-500 mt-1">Source: {event.source}</p>
        </div>
    );
}

function IncidentDetails({ incident }: { incident: SOCIncident }) {
    return (
        <div className="space-y-4">
            <div>
                <h3 className="text-sm text-gray-400 mb-1">Título</h3>
                <p className="text-white font-semibold">{incident.title}</p>
            </div>
            <div>
                <h3 className="text-sm text-gray-400 mb-1">Descripción</h3>
                <p className="text-white text-sm">{incident.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <h3 className="text-sm text-gray-400 mb-1">Severidad</h3>
                    <p className="text-white capitalize">{incident.severity}</p>
                </div>
                <div>
                    <h3 className="text-sm text-gray-400 mb-1">Estado</h3>
                    <p className="text-white capitalize">{incident.status}</p>
                </div>
            </div>
            <div>
                <h3 className="text-sm text-gray-400 mb-1">Asignado a</h3>
                <p className="text-white">{incident.assignedTo}</p>
            </div>
            <div>
                <h3 className="text-sm text-gray-400 mb-1">Sistemas Afectados</h3>
                <div className="flex flex-wrap gap-2">
                    {incident.affectedSystems.map((system, idx) => (
                        <span key={idx} className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded text-xs">
                            {system}
                        </span>
                    ))}
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                    <h3 className="text-gray-400 mb-1">Creado</h3>
                    <p className="text-white">{new Date(incident.createdAt).toLocaleString()}</p>
                </div>
                <div>
                    <h3 className="text-gray-400 mb-1">Actualizado</h3>
                    <p className="text-white">{new Date(incident.updatedAt).toLocaleString()}</p>
                </div>
            </div>
        </div>
    );
}

function QuickStat({ label, value, color }: { label: string; value: string; color: string }) {
    const colorClasses: Record<string, string> = {
        red: 'text-red-400',
        orange: 'text-orange-400',
        yellow: 'text-yellow-400',
        blue: 'text-blue-400'
    };

    return (
        <div className="flex items-center justify-between p-3 rounded-lg bg-black/20">
            <span className="text-sm text-gray-400">{label}</span>
            <span className={`text-lg font-bold ${colorClasses[color]}`}>{value}</span>
        </div>
    );
}

function HealthBar({ label, percentage }: { label: string; percentage: number }) {
    const color = percentage >= 95 ? 'bg-green-500' : percentage >= 80 ? 'bg-yellow-500' : 'bg-red-500';

    return (
        <div>
            <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">{label}</span>
                <span className="text-white font-semibold">{percentage}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
                <div className={`${color} h-2 rounded-full transition-all`} style={{ width: `${percentage}%` }} />
            </div>
        </div>
    );
}
