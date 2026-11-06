"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Globe, Github, Linkedin, Save, Loader2 } from "lucide-react";
import CyberButton from "@/components/ui/CyberButton";
import GlassCard from "@/components/ui/GlassCard";
import { toast } from "sonner"; // Assuming sonner is installed as referenced in package.json

interface SettingsFormProps {
    initialData: {
        name?: string | null;
        bio?: string | null;
        location?: string | null;
        website?: string | null;
        github?: string | null;
        linkedin?: string | null;
    }
}

export default function SettingsForm({ initialData }: SettingsFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: initialData.name || "",
        bio: initialData.bio || "",
        location: initialData.location || "",
        website: initialData.website || "",
        github: initialData.github || "",
        linkedin: initialData.linkedin || "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                toast.success("Perfil actualizado correctamente");
                router.refresh(); // Refresh server components to show new data
            } else {
                toast.error("Error al actualizar perfil");
            }
        } catch (error) {
            toast.error("Error de conexión");
        } finally {
            setLoading(false);
        }
    };

    return (
        <GlassCard className="p-8">
            <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-2">
                <User className="w-6 h-6 text-blue-400" /> Información Personal
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs text-gray-500 uppercase tracking-wider font-bold ml-1">Nombre Display</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs text-gray-500 uppercase tracking-wider font-bold ml-1">Ubicación</label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="Ej. Buenos Aires, Argentina"
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs text-gray-500 uppercase tracking-wider font-bold ml-1">Bio</label>
                    <textarea
                        rows={4}
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
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
                            <input
                                type="text"
                                name="website"
                                value={formData.website}
                                onChange={handleChange}
                                placeholder="Website URL"
                                className="w-full pl-10 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-500/50 focus:outline-none focus:ring-0 transition-all"
                            />
                        </div>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Github className="h-4 w-4 text-gray-500" />
                            </div>
                            <input
                                type="text"
                                name="github"
                                value={formData.github}
                                onChange={handleChange}
                                placeholder="Github Profile"
                                className="w-full pl-10 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500/50 focus:outline-none focus:ring-0 transition-all"
                            />
                        </div>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Linkedin className="h-4 w-4 text-gray-500" />
                            </div>
                            <input
                                type="text"
                                name="linkedin"
                                value={formData.linkedin}
                                onChange={handleChange}
                                placeholder="LinkedIn Profile"
                                className="w-full pl-10 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-600/50 focus:outline-none focus:ring-0 transition-all"
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-4 flex justify-end">
                    <CyberButton type="submit" variant="primary" className="w-full md:w-auto" disabled={loading}>
                        <span className="flex items-center gap-2">
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            {loading ? "Guardando..." : "Guardar Cambios"}
                        </span>
                    </CyberButton>
                </div>
            </form>
        </GlassCard>
    );
}
