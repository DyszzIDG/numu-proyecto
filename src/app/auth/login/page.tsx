"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Mail, Shield, AlertCircle } from "lucide-react";
import Link from "next/link";
import CyberButton from '@/components/ui/CyberButton';

export default function UnifiedLoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/profile';

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
                router.push(callbackUrl);
                router.refresh();
            }
        } catch (error) {
            setError("Error al intentar iniciar sesión");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black" />
            <div className="absolute inset-0 bg-grid-white/[0.02]" />

            <div className="relative w-full max-w-md p-4">
                <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl shadow-blue-500/10">
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-6">
                            <img
                                src="/logos/logotipo-NUMUGROUP (4).png"
                                alt="NUMU Logo"
                                className="h-12 w-auto opacity-90 hover:opacity-100 transition-opacity"
                            />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
                            NUMU<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">CSIRT</span>
                        </h1>
                        <p className="text-gray-400 text-sm">
                            Acceso seguro al panel de operaciones
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400 text-sm">
                                <AlertCircle className="w-4 h-4" />
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider ml-1">Email</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-4 w-4 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                                    </div>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                                        placeholder="usuario@numu.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider ml-1">Contraseña</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-4 w-4 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                                    </div>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full relative group overflow-hidden rounded-xl p-[1px]"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-100 group-hover:opacity-90 transition-opacity" />
                            <div className="relative bg-black h-full rounded-xl flex items-center justify-center py-3 group-hover:bg-opacity-0 transition-all duration-300">
                                <span className="font-bold text-white group-hover:scale-105 transition-transform duration-300">
                                    {loading ? "Accediendo..." : "Iniciar Sesión"}
                                </span>
                            </div>
                        </button>

                        <div className="text-center text-sm">
                            <Link href="/auth/register" className="text-gray-400 hover:text-white transition-colors">
                                ¿No tienes cuenta? <span className="text-blue-400 hover:underline">Regístrate</span>
                            </Link>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center">
                    <p className="text-xs text-gray-500">
                        Acceso restringido a personal autorizado de NUMU
                    </p>
                    <p className="text-xs text-gray-600 mt-2">
                        Su IP ha sido registrada por seguridad
                    </p>
                </div>
            </div>
        </div>
    );
}
