'use client';

import React from 'react';
import CSIRTModuleLayout from '@/components/csirt/CSIRTModuleLayout';
import { Radar, Activity, CheckCircle2, XCircle, List } from 'lucide-react';
import NeonCard from '@/components/ui/NeonCard';
import GlassCard from '@/components/ui/GlassCard';
import RecentScansTable from '@/components/dashboard/RecentScansTable';

export default function CSIRTScansPage() {
    return (
        <CSIRTModuleLayout
            title="Historial de Escaneos"
            description="Registro completo de ejecuciones de herramientas de seguridad y análisis."
            icon={Radar}
            iconColor="text-cyan-400"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <NeonCard glowColor="cyan" className="p-6">
                    <p className="text-xs text-gray-400 uppercase flex items-center gap-2">
                        <Activity className="w-4 h-4" /> Actividad
                    </p>
                    <h2 className="text-4xl font-bold text-white mt-2">Activo</h2>
                    <p className="text-green-400 text-sm mt-1">Docker Services Running</p>
                </NeonCard>
                <GlassCard className="p-6 flex flex-col justify-center">
                    <p className="text-xs text-gray-400 uppercase">Total Escaneos</p>
                    <h2 className="text-3xl font-bold text-white mt-2">128</h2>
                    <p className="text-xs text-gray-500 mt-1">+12 esta semana</p>
                </GlassCard>
                <GlassCard className="p-6 flex flex-col justify-center">
                    <p className="text-xs text-gray-400 uppercase flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500" /> Exitosos
                    </p>
                    <h2 className="text-3xl font-bold text-green-400 mt-2">115</h2>
                </GlassCard>
                <GlassCard className="p-6 flex flex-col justify-center">
                    <p className="text-xs text-gray-400 uppercase flex items-center gap-2">
                        <XCircle className="w-4 h-4 text-red-500" /> Fallidos
                    </p>
                    <h2 className="text-3xl font-bold text-red-400 mt-2">13</h2>
                </GlassCard>
            </div>

            <div className="space-y-6">
                {/* Filters or Actions could go here */}

                <div>
                    <h3 className="font-bold text-white mb-6 flex items-center gap-2">
                        <List className="w-5 h-5 text-gray-400" /> Registro de Ejecuciones
                    </h3>
                    <RecentScansTable />
                </div>
            </div>
        </CSIRTModuleLayout>
    );
}
