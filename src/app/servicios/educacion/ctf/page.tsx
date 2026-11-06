'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ServicePanel from '@/components/services/ServicePanel';
import {
    Trophy, Flag, Users, Target, Award, Clock,
    TrendingUp, Zap, Shield, Code, Lock, Server, Building2, BookOpen, Loader2
} from 'lucide-react';
import Link from 'next/link';

export default function CTFPanelPage() {
    const router = useRouter();
    const [stats, setStats] = useState<any>(null);
    const [programs, setPrograms] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/ctf/dashboard');
                if (res.ok) {
                    const data = await res.json();
                    setStats(data.stats);
                    setPrograms(data.programs);
                }
            } catch (error) {
                console.error("Failed to fetch CTF data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const iconMap: Record<string, any> = {
        Shield, Building2, BookOpen, Users, Trophy, Flag, Target, Award, Zap, Code, Lock, Server
    };

    const dashboardStats = [
        { label: 'Desafíos Activos', value: stats?.activeChallenges || 0, icon: Flag, color: 'red', trend: '+8 nuevos' },
        { label: 'Participantes', value: stats?.participants || 0, icon: Users, color: 'blue', trend: '+32 esta semana' },
        { label: 'Flags Capturadas', value: stats?.flagsCaptured || 0, icon: Trophy, color: 'yellow', trend: '+156 hoy' },
        { label: 'Competencias', value: stats?.competitions || 0, icon: Award, color: 'purple', trend: '3 próximas' },
    ];

    const handleProgramClick = (programId: string) => {
        router.push(`/servicios/educacion/ctf/${programId}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-blue-900 text-white p-8 flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
            </div>
        );
    }

    return (
        <ServicePanel
            title="Panel CTF - Capture The Flag"
            breadcrumbs={[
                { label: 'Servicios', href: '/dashboard' },
                { label: 'AKADEMY', href: '/servicios/educacion' },
                { label: 'CTF', href: '/servicios/educacion/ctf' }
            ]}
            headerActions={
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors shadow-lg shadow-red-900/20 font-medium text-sm flex items-center gap-2">
                        <Flag className="w-4 h-4" /> Nuevo Desafío
                    </button>
                    <button className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors shadow-lg shadow-purple-900/20 font-medium text-sm flex items-center gap-2">
                        <Trophy className="w-4 h-4" /> Crear Competencia
                    </button>
                </div>
            }
        >
            <div className="space-y-8">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {dashboardStats.map((stat, index) => {
                        const Icon = stat.icon;
                        const colorClass = stat.color === 'red' ? 'text-red-400' :
                            stat.color === 'blue' ? 'text-blue-400' :
                                stat.color === 'yellow' ? 'text-yellow-400' : 'text-purple-400';
                        return (
                            <div
                                key={index}
                                className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all group"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <Icon className={`w-8 h-8 ${colorClass} group-hover:scale-110 transition-transform`} />
                                    <span className={`text-3xl font-bold ${colorClass} font-mono`}>
                                        {stat.value}
                                    </span>
                                </div>
                                <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                                <p className="text-green-400 text-xs flex items-center gap-1">
                                    <TrendingUp className="w-3 h-3" /> {stat.trend}
                                </p>
                            </div>
                        );
                    })}
                </div>

                {/* CTF Programs Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <Flag className="w-6 h-6 text-green-400" />
                        <h2 className="text-3xl font-bold text-white">CTF (GENERAL)</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {programs.map((program) => {
                            // Resolve icon from string name or default
                            const Icon = iconMap[program.icon] || Shield;

                            return (
                                <div
                                    key={program.id}
                                    onClick={() => handleProgramClick(program.id)}
                                    className="group relative overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all hover:scale-[1.01] hover:shadow-2xl hover:shadow-green-500/10 cursor-pointer"
                                >
                                    {/* Background Gradient */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${program.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

                                    {/* Icon Background */}
                                    <div className={`absolute top-4 right-4 p-3 rounded-xl bg-gradient-to-br ${program.color} opacity-20 group-hover:opacity-30 transition-opacity`}>
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>

                                    {/* Content */}
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-3 mb-6">
                                            <Icon className="w-6 h-6 text-green-400" />
                                            <h3 className="text-xl font-bold text-white group-hover:text-green-400 transition-colors">{program.name}</h3>
                                        </div>

                                        {/* Stats */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-3xl font-bold text-white font-mono">{program.participants}</p>
                                                <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">Participantes</p>
                                            </div>
                                            <div>
                                                <p className="text-3xl font-bold text-white font-mono">{program.challenges}</p>
                                                <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">Desafíos</p>
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
