import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserProfile } from "@/lib/profile";
import { redirect } from "next/navigation";
import { User, Mail, Shield, Award, Calendar, ExternalLink, Github, Linkedin, Globe } from "lucide-react";
import NeonCard from "@/components/ui/NeonCard";
import GlassCard from "@/components/ui/GlassCard";
import CyberButton from "@/components/ui/CyberButton";


export default async function ProfilePage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        redirect("/auth/login");
    }

    const profile = await getUserProfile(session.user.id);
    const initials = (profile?.user.name?.[0] || session.user.email?.[0] || "?").toUpperCase();

    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            {/* Header Section */}
            <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-3xl rounded-full opacity-50 pointer-events-none" />

                <NeonCard glowColor="magenta" className="flex flex-col md:flex-row items-center md:items-start gap-8 p-8 relative z-10">
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-600 to-purple-700 p-1">
                            <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-4xl font-bold text-white relative overflow-hidden">
                                {/* Avatar Image Placeholder or Initials */}
                                {initials}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            </div>
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-black rounded-full p-2 border border-white/20">
                            <div className="w-4 h-4 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e] animate-pulse" />
                        </div>
                    </div>

                    <div className="flex-1 text-center md:text-left space-y-4">
                        <div>
                            <h1 className="text-4xl font-bold text-white tracking-tight mb-2">
                                {profile?.user.name || "Usuario"}
                            </h1>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-sm">
                                <span className="flex items-center gap-2 text-gray-400 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                                    <Mail className="w-3 h-3" /> {profile?.user.email}
                                </span>
                                <span className="text-gray-500">|</span>
                                <span className="text-blue-400 font-mono">ID: {profile?.id?.slice(-8).toUpperCase()}</span>
                                <span className="text-gray-500">|</span>
                                <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-xs border border-purple-500/30 uppercase tracking-wide">
                                    {session.user.role || "MEMBER"}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
                            <CyberButton variant="primary" className="text-xs py-2 px-4">
                                Editar Perfil
                            </CyberButton>
                            <CyberButton variant="outline" className="text-xs py-2 px-4">
                                Ver Público
                            </CyberButton>
                        </div>
                    </div>
                </NeonCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Info Column */}
                <div className="lg:col-span-2 space-y-6">
                    <GlassCard className="p-6 h-full">
                        <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                            <User className="w-5 h-5 text-cyan-400" />
                            <h3 className="text-lg font-bold text-white uppercase tracking-wider">Bio</h3>
                        </div>
                        <p className="text-gray-300 leading-relaxed">
                            {profile?.bio || "Sin biografía definida. Edita tu perfil para añadir una descripción sobre tus roles y objetivos en NUMU."}
                        </p>

                        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                                <div className="text-xs text-gray-500 uppercase mb-1">Ubicación</div>
                                <div className="text-white">{profile?.location || "N/A"}</div>
                            </div>
                            <div className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                                <div className="text-xs text-gray-500 uppercase mb-1">Se unió</div>
                                <div className="text-white">{profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "Reciente"}</div>
                            </div>
                        </div>
                    </GlassCard>
                </div>

                {/* Stats / Social Column */}
                <div className="space-y-6">
                    <NeonCard glowColor="cyan" className="p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <Shield className="w-5 h-5 text-blue-400" />
                            <h3 className="text-lg font-bold text-white uppercase tracking-wider">Redes</h3>
                        </div>
                        <div className="space-y-3">
                            {profile?.website && (
                                <a href={profile.website} target="_blank" className="flex items-center justify-between p-3 rounded-lg bg-black/40 border border-white/10 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all text-sm group">
                                    <span className="text-gray-400 group-hover:text-blue-400 flex items-center gap-2"><Globe className="w-3 h-3" /> Website</span>
                                    <ExternalLink className="w-3 h-3 text-gray-600 group-hover:text-blue-400" />
                                </a>
                            )}
                            {profile?.github && (
                                <a href={profile.github} target="_blank" className="flex items-center justify-between p-3 rounded-lg bg-black/40 border border-white/10 hover:border-purple-500/50 hover:bg-purple-500/5 transition-all text-sm group">
                                    <span className="text-gray-400 group-hover:text-purple-400 flex items-center gap-2"><Github className="w-3 h-3" /> GitHub</span>
                                    <ExternalLink className="w-3 h-3 text-gray-600 group-hover:text-purple-400" />
                                </a>
                            )}
                            {profile?.linkedin && (
                                <a href={profile.linkedin} target="_blank" className="flex items-center justify-between p-3 rounded-lg bg-black/40 border border-white/10 hover:border-blue-600/50 hover:bg-blue-600/5 transition-all text-sm group">
                                    <span className="text-gray-400 group-hover:text-blue-600 flex items-center gap-2"><Linkedin className="w-3 h-3" /> LinkedIn</span>
                                    <ExternalLink className="w-3 h-3 text-gray-600 group-hover:text-blue-600" />
                                </a>
                            )}
                            {!profile?.website && !profile?.github && !profile?.linkedin && (
                                <div className="text-center py-4 text-gray-500 text-sm italic">
                                    No hay redes conectadas
                                </div>
                            )}
                        </div>
                    </NeonCard>

                    <GlassCard className="p-6 bg-gradient-to-b from-green-900/10 to-transparent">
                        <div className="flex items-center gap-3 mb-4 text-green-400">
                            <Calendar className="w-5 h-5" />
                            <h3 className="font-bold uppercase tracking-wider text-sm">Racha Activa</h3>
                        </div>
                        <div className="flex items-end justify-between">
                            <div className="text-4xl font-bold text-white">1 <span className="text-sm font-normal text-gray-400">día</span></div>
                            <div className="flex gap-1">
                                {[1, 0, 0, 0, 0].map((active, i) => (
                                    <div key={i} className={`w-2 h-6 rounded-sm ${active ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-white/10'}`} />
                                ))}
                            </div>
                        </div>
                    </GlassCard>
                </div>
            </div>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Nivel Seguridad", value: "Elite", color: "text-blue-400", border: "border-blue-500/30" },
                    { label: "Cursos Completos", value: "0", color: "text-purple-400", border: "border-purple-500/30" },
                    { label: "CTF Score", value: "0", color: "text-red-400", border: "border-red-500/30" },
                    { label: "Reputación", value: "Novato", color: "text-yellow-400", border: "border-yellow-500/30" },
                ].map((stat, idx) => (
                    <div key={idx} className={`bg-black/40 border ${stat.border} p-4 rounded-xl backdrop-blur-sm flex flex-col items-center justify-center text-center group hover:bg-white/5 transition-colors`}>
                        <span className="text-xs text-gray-500 uppercase tracking-widest mb-1">{stat.label}</span>
                        <span className={`text-xl font-bold ${stat.color} group-hover:scale-110 transition-transform`}>{stat.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
