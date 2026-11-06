'use client';

import React from 'react';
import ToolSelector from '@/components/tools/ToolSelector';

export default function ToolsCatalogPage() {
    return (
        <div className="p-6 space-y-6 bg-slate-950 min-h-screen text-slate-100">
            <div>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
                    Catálogo de Herramientas
                </h1>
                <p className="text-slate-400 mt-2">
                    Seleccione una herramienta para iniciar operaciones de escaneo o análisis.
                </p>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                <ToolSelector />
            </div>
        </div>
    );
}
