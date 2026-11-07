"use client";

import React from "react";
import CSIRTModuleLayout from "@/components/csirt/CSIRTModuleLayout";
import { ShieldAlert, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import NeonCard from "@/components/ui/NeonCard";
import GlassCard from "@/components/ui/GlassCard";

const stats = [
    { label: "Incidentes Activos", value: "3", color: "text-red-400", icon: AlertTriangle },
    { label: "Tiempo de Respuesta", value: "12m", color: "text-yellow-400", icon: Clock },
    { label: "Resueltos (24h)", value: "15", color: "text-green-400", icon: CheckCircle },
];


export default function IncidentsPage() {
    const [stats, setStats] = React.useState({
        active: 0,
        critical: 0,
        high: 0,
        total: 0
    });
    const [incidents, setIncidents] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [statsRes, incidentsRes] = await Promise.all([
                fetch('/api/csirt/incidents/stats'),
                fetch('/api/csirt/incidents')
            ]);

            if (statsRes.ok) setStats(await statsRes.json());
            if (incidentsRes.ok) setIncidents(await incidentsRes.json());
        } catch (error) {
            console.error('Failed to fetch incidents:', error);
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        { label: "Incidentes Activos", value: stats.active.toString(), color: "text-red-400", icon: AlertTriangle },
        { label: "Críticos", value: stats.critical.toString(), color: "text-red-500", icon: ShieldAlert },
        { label: "Alta Prioridad", value: stats.high.toString(), color: "text-orange-400", icon: AlertTriangle },
    ];

    return (
        <CSIRTModuleLayout
            title="Gestión de Incidentes"
            description="Centro de comando para la respuesta y mitigación de amenazas activas."
            icon={ShieldAlert}
            iconColor="text-red-400"
        >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {statCards.map((stat, idx) => {
                    const Icon = stat.icon;
                    return (
                        <NeonCard key={idx} glowColor={idx === 1 ? "magenta" : "cyan"} className="flex items-center justify-between p-6">
                            <div>
                                <p className="text-xs text-gray-400 uppercase tracking-widest">{stat.label}</p>
                                <h3 className="text-3xl font-bold text-white mt-2">{stat.value}</h3>
                            </div>
                            <Icon className={`w-8 h-8 ${stat.color} opacity-50`} />
                        </NeonCard>
                    )
                })}
            </div>

            <GlassCard className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white">Feed de Incidentes en Tiempo Real</h3>
                    <button
                        onClick={fetchData}
                        className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-gray-300 transition-colors"
                    >
                        Actualizar
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-10 text-gray-400">Cargando incidentes...</div>
                ) : incidents.length === 0 ? (
                    <div className="text-center py-10">
                        <div className="w-16 h-16 rounded-full bg-green-900/20 border border-green-500/20 flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-8 h-8 text-green-500" />
                        </div>
                        <p className="text-gray-400">No hay incidentes activos. ¡Buen trabajo!</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {incidents.map((incident) => (
                            <div key={incident.id} className="p-4 bg-black/20 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${incident.priority === 'critical' ? 'bg-red-500/20 text-red-400' :
                                                    incident.priority === 'high' ? 'bg-orange-500/20 text-orange-400' :
                                                        'bg-blue-500/20 text-blue-400'
                                                }`}>
                                                {incident.priority}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {new Date(incident.createdAt).toLocaleString()}
                                            </span>
                                        </div>
                                        <h4 className="text-white font-medium">{incident.title}</h4>
                                        <p className="text-sm text-gray-400 mt-1 line-clamp-2">{incident.description}</p>
                                    </div>
                                    <div className="px-3 py-1 bg-white/5 rounded text-xs text-gray-300">
                                        {incident.status}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </GlassCard>
        </CSIRTModuleLayout>
    );
}
