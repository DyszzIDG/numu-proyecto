'use client';

import React, { useState } from 'react';
import CSIRTModuleLayout from '@/components/csirt/CSIRTModuleLayout';
import { Target, Shield, Activity, Zap, TrendingUp, Crosshair, Search, BrainCircuit } from 'lucide-react';
import NeonCard from '@/components/ui/NeonCard';
import GlassCard from '@/components/ui/GlassCard';
import AIScanForm from '@/components/dashboard/AIScanForm';

export default function ScanOperationsPage() {
    const [activeTeam, setActiveTeam] = useState<'red' | 'blue' | null>(null);

    return (
        <CSIRTModuleLayout
            title="Operaciones de Escaneo"
            description="Selecciona tu equipo para acceder a herramientas especializadas de seguridad ofensiva o defensiva."
            icon={Target}
            iconColor="text-red-500"
        >
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <GlassCard className="p-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs text-gray-400 uppercase">Escaneos Totales</p>
                            <h2 className="text-3xl font-bold text-white mt-1">127</h2>
                            <p className="text-xs text-gray-500 mt-1">+12 hoy</p>
                        </div>
                        <div className="p-2 bg-purple-500/20 rounded-lg">
                            <Activity className="w-5 h-5 text-purple-400" />
                        </div>
                    </div>
                </GlassCard>
                <GlassCard className="p-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs text-gray-400 uppercase">Eficiencia</p>
                            <h2 className="text-3xl font-bold text-white mt-1">94%</h2>
                            <p className="text-xs text-green-400 mt-1">+3% vs ayer</p>
                        </div>
                        <div className="p-2 bg-green-500/20 rounded-lg">
                            <TrendingUp className="w-5 h-5 text-green-400" />
                        </div>
                    </div>
                </GlassCard>
            </div>




        </CSIRTModuleLayout>
    );
}
