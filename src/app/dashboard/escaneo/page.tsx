'use client';

import { Target, Swords, Activity, TrendingUp } from 'lucide-react';


export default function EscaneoPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-red-500/20 to-blue-500/20 border border-white/10">
                            <Target className="w-8 h-8 text-white" />
                        </div>
                    </div>
                    <h1 className="text-5xl font-bold text-white mb-2">
                        Operaciones de Escaneo
                    </h1>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                        Selecciona tu equipo para acceder a herramientas especializadas de seguridad ofensiva o defensiva
                    </p>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <StatsCard
                        title="Escaneos Totales"
                        value="127"
                        trend="+12 hoy"
                        icon={Activity}
                        color="purple"
                    />
                    <StatsCard
                        title="Red Team Activo"
                        value="5"
                        trend="En progreso"
                        icon={Swords}
                        color="red"
                    />
                    <StatsCard
                        title="Blue Team Activo"
                        value="12"
                        trend="Monitoreando"
                        icon={Target}
                        color="blue"
                    />
                    <StatsCard
                        title="Eficiencia"
                        value="94%"
                        trend="+3% vs ayer"
                        icon={TrendingUp}
                        color="green"
                    />
                </div>



                {/* Info Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <InfoCard
                        title="¿Qué es Red Team?"
                        description="El Red Team simula ataques reales para identificar vulnerabilidades antes que los atacantes. Incluye pentesting, explotación y reconocimiento."
                        color="red"
                    />
                    <InfoCard
                        title="¿Qué es Blue Team?"
                        description="El Blue Team se enfoca en defender, detectar y responder a amenazas. Incluye monitoreo, hardening y análisis de seguridad."
                        color="blue"
                    />
                </div>
            </div>
        </div>
    );
}

function StatsCard({ title, value, trend, icon: Icon, color }: any) {
    const colorClasses: Record<string, string> = {
        purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
        red: "bg-red-500/10 text-red-400 border-red-500/20",
        blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
        green: "bg-green-500/10 text-green-400 border-green-500/20",
    };

    return (
        <div className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all backdrop-blur-sm group">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <p className="text-gray-400 text-sm font-medium">{title}</p>
                    <h3 className="text-3xl font-bold mt-1 text-white">{value}</h3>
                </div>
                <div className={`p-3 rounded-lg ${colorClasses[color]} group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>
            <p className="text-sm text-gray-500">{trend}</p>
        </div>
    );
}

function InfoCard({ title, description, color }: { title: string; description: string; color: 'red' | 'blue' }) {
    const colorClasses = {
        red: {
            border: 'border-red-500/30',
            bg: 'bg-red-500/5',
            text: 'text-red-400',
            glow: 'shadow-[0_0_20px_rgba(220,38,38,0.2)]'
        },
        blue: {
            border: 'border-blue-500/30',
            bg: 'bg-blue-500/5',
            text: 'text-blue-400',
            glow: 'shadow-[0_0_20px_rgba(37,99,235,0.2)]'
        }
    };

    const colors = colorClasses[color];

    return (
        <div className={`p-6 rounded-xl border ${colors.border} ${colors.bg} backdrop-blur-sm hover:${colors.glow} transition-all`}>
            <h3 className={`text-lg font-bold ${colors.text} mb-3`}>{title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
        </div>
    );
}
