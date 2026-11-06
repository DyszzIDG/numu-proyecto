import React from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft, Terminal } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-white px-4 relative overflow-hidden font-mono">
            {/* Ambient cyber grid glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-950/20 via-black/80 to-black pointer-events-none" />

            <div className="relative z-10 text-center max-w-lg border border-cyan-500/20 bg-zinc-950/80 backdrop-blur-md p-8 rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.15)]">
                <div className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto mb-6 text-cyan-400">
                    <ShieldAlert className="w-8 h-8" />
                </div>

                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20 mb-4">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    ERROR 404: HOST_UNREACHABLE
                </div>

                <h1 className="text-3xl font-extrabold tracking-tight mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">
                    OBJETIVO NO ENCONTRADO
                </h1>

                <p className="text-zinc-400 text-sm mb-6 font-sans">
                    La ruta o recurso solicitado no existe en la infraestructura de NUMU o fue relocalizado tras una auditoría de seguridad.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                    <Link
                        href="/"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-cyan-500 to-teal-500 text-black hover:opacity-95 transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                    >
                        <ArrowLeft className="w-4 h-4" /> Volver al Inicio
                    </Link>
                    <Link
                        href="/dashboard"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 transition-colors"
                    >
                        <Terminal className="w-4 h-4" /> Ir a Operaciones
                    </Link>
                </div>
            </div>
        </div>
    );
}
