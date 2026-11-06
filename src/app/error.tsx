'use client';

import React, { useEffect } from 'react';
import { AlertOctagon, RotateCcw, Home } from 'lucide-react';
import Link from 'next/link';

export default function ErrorBoundary({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Unhandled runtime error:', error);
    }, [error]);

    return (
        <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-white px-4 relative overflow-hidden font-mono">
            <div className="relative z-10 text-center max-w-lg border border-red-500/20 bg-zinc-950/80 backdrop-blur-md p-8 rounded-2xl shadow-[0_0_50px_rgba(239,68,68,0.15)]">
                <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-6 text-red-400">
                    <AlertOctagon className="w-8 h-8" />
                </div>

                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20 mb-4">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                    EXCEPTION_CAUGHT: SYSTEM_ANOMALY
                </div>

                <h1 className="text-2xl font-extrabold tracking-tight mb-2 text-white">
                    ERROR DE EJECUCIÓN
                </h1>

                <p className="text-zinc-400 text-sm mb-6 font-sans">
                    Se detectó un fallo inesperado al procesar la solicitud en el módulo de seguridad.
                </p>

                {error.message && (
                    <div className="text-left bg-black/60 border border-zinc-800 rounded-lg p-3 text-xs text-red-300 font-mono mb-6 overflow-x-auto max-h-32">
                        <code>{error.message}</code>
                    </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                    <button
                        onClick={() => reset()}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-red-500 hover:bg-red-600 text-white transition-all shadow-[0_0_20px_rgba(239,68,68,0.4)]"
                    >
                        <RotateCcw className="w-4 h-4" /> Reintentar
                    </button>
                    <Link
                        href="/"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 transition-colors"
                    >
                        <Home className="w-4 h-4" /> Inicio
                    </Link>
                </div>
            </div>
        </div>
    );
}
