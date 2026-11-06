import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getOrCreateServiceProfile, getUserProfile } from "@/lib/profile";
import { redirect } from "next/navigation";
import { ServiceType } from "@prisma/client";
import { notFound } from "next/navigation";
import NeonCard from "@/components/ui/NeonCard";
import GlassCard from "@/components/ui/GlassCard";
import MoodleIntegration from "@/components/profile/MoodleIntegration";
import { Shield, GraduationCap, Cpu, CreditCard, Activity, Lock, Award, BarChart } from "lucide-react";

interface PageProps {
    params: {
        service: string;
    };
}

const serviceMap: Record<string, ServiceType> = {
    cybersecurity: "CYBERSECURITY",
    education: "EDUCATION",
    ai: "AI",
    fintech: "FINTECH",
};

const serviceConfig = {
    cybersecurity: { color: 'cyan', icon: Shield, title: 'Ciberseguridad', accent: 'text-cyan-400' },
    education: { color: 'magenta', icon: GraduationCap, title: 'AKADEMY', accent: 'text-purple-400' },
    ai: { color: 'green', icon: Cpu, title: 'Inteligencia Artificial', accent: 'text-emerald-400' },
    fintech: { color: 'magenta', icon: CreditCard, title: 'Financiero', accent: 'text-yellow-400' },
};


export default async function ServiceProfilePage({ params }: PageProps) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        redirect("/auth/login");
    }

    const serviceType = serviceMap[params.service];

    if (!serviceType) {
        if (params.service === 'settings') {
            return (
                <NeonCard className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-white mb-2">Configuración</h2>
                        <p className="text-gray-400">Ajustes del perfil global (Próximamente)</p>
                    </div>
                </NeonCard>
            );
        }
        return notFound();
    }

    // Ensure user profile exists
    const userProfile = await getUserProfile(session.user.id);
    if (!userProfile) {
        redirect("/profile");
    }

    const serviceProfile = await getOrCreateServiceProfile(userProfile.id, serviceType);
    const metadata = JSON.parse(serviceProfile.metadata || '{}');

    const config = serviceConfig[params.service as keyof typeof serviceConfig] || { color: 'cyan', icon: Activity, title: params.service, accent: 'text-blue-400' };
    const Icon = config.icon;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row items-center justify-between border-b border-white/10 pb-6 gap-4">
                <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl bg-white/5 border border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.5)]`}>
                        <Icon className={`w-8 h-8 ${config.accent}`} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight uppercase">
                            Perfil <span className={config.accent}>{config.title}</span>
                        </h1>
                        <p className="text-sm text-gray-500 font-mono mt-1">
                            System ID: {serviceProfile.id.slice(0, 8).toUpperCase()} // Status: ACTIVE
                        </p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs border border-green-500/20 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        Conectado
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                    {/* Stats / Info */}
                    <NeonCard glowColor={config.color as any}>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <BarChart className="w-4 h-4 text-gray-400" /> Estadísticas
                            </h3>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-black/40 rounded-xl text-center border border-white/5 group hover:border-white/20 transition-all">
                                <div className={`text-3xl font-bold ${config.accent} mb-1 group-hover:scale-110 transition-transform`}>0</div>
                                <div className="text-[10px] text-gray-500 uppercase tracking-widest">Nivel</div>
                            </div>
                            <div className="p-4 bg-black/40 rounded-xl text-center border border-white/5 group hover:border-white/20 transition-all">
                                <div className={`text-3xl font-bold ${config.accent} mb-1 group-hover:scale-110 transition-transform`}>0</div>
                                <div className="text-[10px] text-gray-500 uppercase tracking-widest">Puntos</div>
                            </div>
                            <div className="p-4 bg-black/40 rounded-xl text-center border border-white/5 group hover:border-white/20 transition-all col-span-2">
                                <div className="flex items-center justify-center gap-2 text-gray-300 mb-1">
                                    <Award className="w-4 h-4" /> <span className="font-bold">Principiante</span>
                                </div>
                                <div className="text-[10px] text-gray-500 uppercase tracking-widest">Rango Actual</div>
                            </div>
                        </div>
                    </NeonCard>

                    <GlassCard className="p-6">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <Lock className="w-4 h-4 text-gray-400" /> Metadata Raw
                        </h3>
                        <pre className="bg-black/80 p-4 rounded-lg text-xs text-green-400 overflow-auto font-mono max-h-40 custom-scrollbar border border-white/5">
                            {JSON.stringify(metadata, null, 2)}
                        </pre>
                    </GlassCard>
                </div>

                <div className="space-y-6">
                    {/* Dynamic Content */}
                    {serviceType === 'EDUCATION' ? (
                        <MoodleIntegration initialMetadata={metadata} userId={session.user.id} />
                    ) : (
                        <div className={`relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-black to-${config.accent.split('-')[1]}-950/20 min-h-[400px] flex flex-col items-center justify-center text-center p-8 group`}>
                            <div className="absolute inset-0 bg-grid-white/[0.03] pointer-events-none" />
                            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 ${config.accent.replace('text', 'bg')}/10 blur-[100px] rounded-full group-hover:bg-opacity-20 transition-all duration-700`} />

                            <div className="relative z-10 p-6 rounded-full bg-white/5 border border-white/10 mb-6 group-hover:scale-110 transition-transform duration-500">
                                <Icon className={`w-12 h-12 ${config.accent}`} />
                            </div>

                            <h3 className="relative z-10 text-2xl font-bold text-white mb-2">Módulo en Desarrollo</h3>
                            <p className="relative z-10 text-gray-400 max-w-sm">
                                Las herramientas avanzadas para el perfil de <strong className="text-white">{config.title}</strong> estarán disponibles pronto.
                            </p>

                            <button className="relative z-10 mt-8 px-6 py-2 rounded-full border border-white/20 hover:bg-white/10 transition-colors text-sm text-gray-300">
                                Notificar disponibilidad
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
