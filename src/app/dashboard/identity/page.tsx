"use client";

import React from "react";
import CSIRTModuleLayout from "@/components/csirt/CSIRTModuleLayout";
import { UserCheck, Shield, Key } from "lucide-react";
import NeonCard from "@/components/ui/NeonCard";
import GlassCard from "@/components/ui/GlassCard";

export default function IdentityPage() {
    return (
        <CSIRTModuleLayout
            title="Protección de Identidad"
            description="Gestión de accesos, MFA y detección de fraudes de identidad."
            icon={UserCheck}
            iconColor="text-pink-400"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <GlassCard className="p-8 text-center">
                    <div className="w-20 h-20 rounded-full border-4 border-green-500 flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl font-bold text-green-500">98%</span>
                    </div>
                    <h3 className="text-white font-bold text-lg">Adopción MFA</h3>
                    <p className="text-gray-500 text-sm">Usuarios con doble factor activo.</p>
                </GlassCard>

                <GlassCard className="p-8 text-center">
                    <div className="w-20 h-20 rounded-full border-4 border-red-500 flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl font-bold text-red-500">5</span>
                    </div>
                    <h3 className="text-white font-bold text-lg">Intentos de Robo</h3>
                    <p className="text-gray-500 text-sm">Ataques de fuerza bruta bloqueados hoy.</p>
                </GlassCard>
            </div>
        </CSIRTModuleLayout>
    );
}
