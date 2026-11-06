'use client';

import { useParams } from 'next/navigation';
import ServicePanel from '@/components/services/ServicePanel';
import {
    Flag, Trophy, Users, Target, Shield, CheckCircle2,
    AlertTriangle, Building2, BookOpen, Loader2
} from 'lucide-react';
import { useState, useEffect } from 'react';

export default function CTFProgramPage() {
    const params = useParams();
    const id = params.id as string;
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProgram = async () => {
            try {
                const res = await fetch(`/api/ctf/programs/${id}`);
                if (res.ok) {
                    const json = await res.json();
                    setData(json);
                }
            } catch (error) {
                console.error("Failed to fetch CTF program", error);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchProgram();
    }, [id]);

    const iconMap: Record<string, any> = {
        Shield, Building2, BookOpen, Users, Trophy, Flag, Target
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-blue-900 text-white p-8 flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
            </div>
        );
    }

    if (!data || !data.program) {
        return (
            <ServicePanel title="Programa no encontrado" breadcrumbs={[]}>
                <div className="text-center py-12">
                    <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-white">No se encontró el programa solicitado</h2>
                </div>
            </ServicePanel>
        );
    }

    const { program, challenges } = data;
    const Icon = iconMap[program.icon] || Flag;

    return (
        <ServicePanel
            title={program.name}
            breadcrumbs={[
                { label: 'Servicios', href: '/dashboard' },
                { label: 'Educación', href: '/servicios/educacion' },
                { label: 'CTF', href: '/servicios/educacion/ctf' },
                { label: program.name, href: `/servicios/educacion/ctf/${id}` }
            ]}
        >
            <div className="space-y-8">
                {/* Header Info */}
                <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 relative overflow-hidden">
                    <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-500/20 to-transparent rounded-full -mr-16 -mt-16 blur-3xl`} />

                    <div className="relative z-10">
                        <h2 className="text-2xl font-bold text-white mb-2">Descripción del Programa</h2>
                        <p className="text-gray-400 text-lg max-w-3xl">{program.description}</p>

                        <div className="flex gap-6 mt-6">
                            <div className="flex items-center gap-2 text-white bg-white/5 px-4 py-2 rounded-lg border border-white/5">
                                <Users className="w-5 h-5 text-blue-400" />
                                <span className="font-bold">{program.participants}</span>
                                <span className="text-sm text-gray-500">Participantes</span>
                            </div>
                            <div className="flex items-center gap-2 text-white bg-white/5 px-4 py-2 rounded-lg border border-white/5">
                                <Flag className="w-5 h-5 text-red-400" />
                                <span className="font-bold">{program.activeChallengesCount}</span>
                                <span className="text-sm text-gray-500">Desafíos Activos</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Challenges Grid */}
                <div>
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Target className="w-6 h-6 text-cyan-400" />
                        Desafíos Disponibles ({challenges.length})
                    </h3>

                    {challenges.length === 0 ? (
                        <div className="text-center py-12 bg-white/5 rounded-xl border border-white/10">
                            <Flag className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                            <p className="text-gray-400">No hay desafíos activos en este momento.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {challenges.map((challenge: any) => (
                                <div key={challenge.id} className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/5 transition-all group relative overflow-hidden">
                                    {challenge.solved && (
                                        <div className="absolute top-4 right-4 text-green-500">
                                            <CheckCircle2 className="w-6 h-6" />
                                        </div>
                                    )}

                                    <div className="mb-4">
                                        <span className={`text-xs font-bold px-2 py-1 rounded border uppercase ${challenge.difficulty === 'easy' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                                challenge.difficulty === 'medium' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                                                    challenge.difficulty === 'hard' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                                                        'bg-red-500/10 text-red-400 border-red-500/20'
                                            }`}>
                                            {challenge.difficulty}
                                        </span>
                                    </div>

                                    <h4 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                                        {challenge.title}
                                    </h4>

                                    <div className="flex items-center justify-between mt-6 text-sm">
                                        <span className="text-gray-500 uppercase text-xs font-bold">{challenge.category}</span>
                                        <span className="text-white font-mono font-bold text-lg">{challenge.points} pts</span>
                                    </div>

                                    <button className="w-full mt-6 py-2 bg-white/5 hover:bg-blue-600 hover:text-white border border-white/10 rounded-lg text-gray-300 transition-all font-medium">
                                        {challenge.solved ? 'Ver Solución' : 'Comenzar Desafío'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </ServicePanel>
    );
}
