"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, Building2, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function ClientLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError("Credenciales inválidas");
                setLoading(false);
            } else {
                router.push("/client");
                router.refresh();
            }
        } catch (error) {
            setError("Error al intentar iniciar sesión");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-blue-900 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black" />
            <div className="absolute inset-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            <div className="relative w-full max-w-md p-4">
                <div className="bg-black/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-10 shadow-2xl shadow-blue-500/20">
                    {/* Logo & Title */}
                    <div className="text-center mb-10">
                        <div className="flex justify-center mb-6">
                            <img
                                src="/logos/logotipo-NUMUGROUP (4).png"
                                alt="NUMU Group"
                                className="h-14 w-auto opacity-90"
                            />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
                            Portal de <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Cliente</span>
                        </h1>
                        <p className="text-gray-400 text-sm">
                            Accede a tus servicios y gestiona tu cuenta
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-3 text-red-400 text-sm">
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                {error}
                            </div>
                        )}

                        <div className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider ml-1">
                                    Email Corporativo
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                                    </div>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="block w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                                        placeholder="empresa@ejemplo.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider ml-1">
                                    Contraseña
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                                    </div>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="block w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" className="rounded border-white/20 bg-white/5 text-blue-500 focus:ring-blue-500/50" />
                                <span className="text-gray-400">Recordarme</span>
                            </label>
                            <Link href="/client/forgot-password" className="text-blue-400 hover:text-blue-300 transition-colors">
                                ¿Olvidaste tu contraseña?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full relative group overflow-hidden rounded-xl p-[2px] transition-all hover:scale-[1.02]"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500 opacity-100 group-hover:opacity-90 transition-opacity" />
                            <div className="relative bg-gradient-to-r from-blue-600 to-cyan-600 h-full rounded-xl flex items-center justify-center py-4 group-hover:from-blue-500 group-hover:to-cyan-500 transition-all duration-300">
                                <span className="font-bold text-white text-lg tracking-wide">
                                    {loading ? "Accediendo..." : "Iniciar Sesión"}
                                </span>
                            </div>
                        </button>

                        <div className="text-center text-sm pt-4 border-t border-white/10">
                            <p className="text-gray-400">
                                ¿Necesitas ayuda? {" "}
                                <Link href="/contact" className="text-blue-400 hover:text-blue-300 transition-colors font-medium">
                                    Contacta soporte
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>

                {/* Footer Note */}
                <div className="mt-8 text-center">
                    <p className="text-xs text-gray-600">
                        Acceso exclusivo para clientes de NUMU Group
                    </p>
                </div>
            </div>
        </div>
    );
}
