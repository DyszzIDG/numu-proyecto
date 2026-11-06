'use client';

import { Shield, Crosshair, ArrowRight, Zap, Eye } from 'lucide-react';
import Link from 'next/link';

interface TeamSelectorProps {
    showStats?: boolean;
}

export default function TeamSelector({ showStats = true }: TeamSelectorProps) {
    const teams = [
        {
            id: 'red',
            name: 'Red Team',
            subtitle: 'Operaciones Ofensivas',
            description: 'Pentesting, explotación y simulación de ataques',
            icon: Crosshair,
            color: {
                primary: 'from-red-600 to-rose-600',
                glow: 'shadow-[0_0_40px_rgba(220,38,38,0.4)]',
                border: 'border-red-500/30',
                bg: 'bg-red-500/10',
                text: 'text-red-400',
                hover: 'hover:border-red-500/60 hover:shadow-[0_0_60px_rgba(220,38,38,0.6)]'
            },
            stats: [
                { label: 'Escaneos Activos', value: '5' },
                { label: 'Vulnerabilidades', value: '23' },
                { label: 'Última Actividad', value: '2m' }
            ],
            tools: ['Nmap', 'Nikto', 'SQLMap', 'Hydra', 'OWASP ZAP'],
            href: '/dashboard/escaneo/red-team'
        },
        {
            id: 'blue',
            name: 'Blue Team',
            subtitle: 'Operaciones Defensivas',
            description: 'Monitoreo, detección y respuesta a incidentes',
            icon: Shield,
            color: {
                primary: 'from-blue-600 to-cyan-600',
                glow: 'shadow-[0_0_40px_rgba(37,99,235,0.4)]',
                border: 'border-blue-500/30',
                bg: 'bg-blue-500/10',
                text: 'text-blue-400',
                hover: 'hover:border-blue-500/60 hover:shadow-[0_0_60px_rgba(37,99,235,0.6)]'
            },
            stats: [
                { label: 'Alertas Activas', value: '12' },
                { label: 'Sistemas Monitoreados', value: '48' },
                { label: 'Score Seguridad', value: '85%' }
            ],
            tools: ['Lynis', 'AIDE', 'Fail2Ban', 'Snort', 'Wazuh'],
            href: '/dashboard/escaneo/blue-team'
        }
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {teams.map((team) => {
                const Icon = team.icon;
                return (
                    <Link
                        key={team.id}
                        href={team.href}
                        className="group block"
                    >
                        <div className={`
                            relative overflow-hidden rounded-2xl border-2 ${team.color.border} ${team.color.bg}
                            backdrop-blur-xl transition-all duration-500 ${team.color.hover}
                            transform hover:-translate-y-2 cursor-pointer
                        `}>
                            {/* Animated Background Gradient */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${team.color.primary} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

                            {/* Glow Effect */}
                            <div className={`absolute -inset-1 bg-gradient-to-r ${team.color.primary} opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-500`} />

                            <div className="relative p-8">
                                {/* Header */}
                                <div className="flex items-start justify-between mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className={`
                                            p-4 rounded-xl ${team.color.bg} border ${team.color.border}
                                            group-hover:scale-110 transition-transform duration-500
                                            ${team.color.glow}
                                        `}>
                                            <Icon className={`w-8 h-8 ${team.color.text}`} />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-white mb-1">
                                                {team.name}
                                            </h3>
                                            <p className="text-sm text-gray-400 font-medium">
                                                {team.subtitle}
                                            </p>
                                        </div>
                                    </div>
                                    <ArrowRight className={`w-6 h-6 ${team.color.text} opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-2 transition-all duration-500`} />
                                </div>

                                {/* Description */}
                                <p className="text-gray-300 mb-6">
                                    {team.description}
                                </p>

                                {/* Stats */}
                                {showStats && (
                                    <div className="grid grid-cols-3 gap-4 mb-6">
                                        {team.stats.map((stat, idx) => (
                                            <div key={idx} className="bg-black/30 rounded-lg p-3 border border-white/5">
                                                <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
                                                <p className={`text-lg font-bold ${team.color.text}`}>{stat.value}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Tools Preview */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <Zap className={`w-4 h-4 ${team.color.text}`} />
                                        <span className="text-sm font-semibold text-gray-300">Herramientas Disponibles</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {team.tools.map((tool, idx) => (
                                            <span
                                                key={idx}
                                                className={`
                                                    px-3 py-1.5 rounded-lg text-xs font-medium
                                                    ${team.color.bg} ${team.color.text} border ${team.color.border}
                                                    group-hover:border-opacity-60 transition-all
                                                `}
                                            >
                                                {tool}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Action Button */}
                                <div className="mt-6 pt-6 border-t border-white/10">
                                    <div className={`
                                        flex items-center justify-center gap-2 py-3 rounded-lg
                                        bg-gradient-to-r ${team.color.primary}
                                        text-white font-semibold
                                        group-hover:shadow-lg transition-all duration-500
                                    `}>
                                        <Eye className="w-5 h-5" />
                                        <span>Abrir Panel {team.name}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}
