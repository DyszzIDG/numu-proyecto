import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserProfile } from "@/lib/profile";
import { redirect } from "next/navigation";
import NeonCard from "@/components/ui/NeonCard";
import GlassCard from "@/components/ui/GlassCard";
import CyberButton from "@/components/ui/CyberButton";
import SettingsForm from "@/components/profile/SettingsForm";
import { Settings, User, Globe, Github, Linkedin, Save, Bell, Shield, Eye } from "lucide-react";

export default async function SettingsPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        redirect("/auth/login");
    }

    const profile = await getUserProfile(session.user.id);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center gap-4 border-b border-white/10 pb-6">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                    <Settings className="w-8 h-8 text-gray-400" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight uppercase">
                        Configuración
                    </h1>
                    <p className="text-sm text-gray-500 font-mono mt-1">
                        Gestión de Perfil Global
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Navigation / Quick Toggles */}
                <div className="space-y-6">
                    <NeonCard glowColor="magenta" className="p-6">
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <Shield className="w-5 h-5 text-purple-400" /> Privacidad
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-300">Perfil Público</span>
                                <div className="w-10 h-6 rounded-full bg-green-500/20 border border-green-500/50 relative cursor-pointer">
                                    <div className="absolute right-1 top-1 w-4 h-4 rounded-full bg-green-400 shadow-[0_0_10px_#4ade80]" />
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-300">Mostrar Email</span>
                                <div className="w-10 h-6 rounded-full bg-white/5 border border-white/10 relative cursor-pointer">
                                    <div className="absolute left-1 top-1 w-4 h-4 rounded-full bg-gray-500" />
                                </div>
                            </div>
                        </div>
                    </NeonCard>

                    <GlassCard className="p-6">
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <Bell className="w-5 h-5 text-yellow-400" /> Notificaciones
                        </h3>
                        <div className="space-y-4">
                            {['Email Updates', 'Security Alerts', 'Marketing'].map((item) => (
                                <div key={item} className="flex items-center justify-between">
                                    <span className="text-sm text-gray-300">{item}</span>
                                    <div className="w-4 h-4 rounded border border-white/20 bg-white/5 cursor-pointer hover:border-blue-400" />
                                </div>
                            ))}
                        </div>
                    </GlassCard>
                </div>

                {/* Right Column: Edit Form */}
                <div className="lg:col-span-2">
                    <GlassCard className="p-8">
                        <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-2">
                            <User className="w-6 h-6 text-blue-400" /> Información Personal
                        </h3>

                        <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs text-gray-500 uppercase tracking-wider font-bold ml-1">Nombre Display</label>
                                    <input
                                        type="text"
                                        defaultValue={profile?.user.name || ""}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs text-gray-500 uppercase tracking-wider font-bold ml-1">Ubicación</label>
                                    <input
                                        type="text"
                                        defaultValue={profile?.location || ""}
                                        placeholder="Ej. Buenos Aires, Argentina"
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs text-gray-500 uppercase tracking-wider font-bold ml-1">Bio</label>
                                <textarea
                                    rows={4}
                                    defaultValue={profile?.bio || ""}
                                    placeholder="Cuéntanos sobre ti..."
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all resize-none"
                                />
                            </div>

                            <div className="pt-6 border-t border-white/10">
                                <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider flex items-center gap-2">
                                    <Globe className="w-4 h-4 text-cyan-400" /> Enlaces
                                </h4>
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Globe className="h-4 w-4 text-gray-500" />
                                        </div>
                                        <input type="text" defaultValue={profile?.website || ""} placeholder="Website URL" className="w-full pl-10 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-500/50" />
                                    </div>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Github className="h-4 w-4 text-gray-500" />
                                        </div>
                                        <input type="text" defaultValue={profile?.github || ""} placeholder="Github Profile" className="w-full pl-10 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500/50" />
                                    </div>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Linkedin className="h-4 w-4 text-gray-500" />
                                        </div>
                                        <input type="text" defaultValue={profile?.linkedin || ""} placeholder="LinkedIn Profile" className="w-full pl-10 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-600/50" />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end">
                                <CyberButton type="submit" variant="primary" className="w-full md:w-auto">
                                    <span className="flex items-center gap-2">
                                        <Save className="w-4 h-4" /> Guardar Cambios
                                    </span>
                                </CyberButton>
                            </div>
                        </form>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
}
