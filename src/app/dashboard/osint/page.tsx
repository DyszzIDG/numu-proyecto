"use client";

import React from "react";
import CSIRTModuleLayout from "@/components/csirt/CSIRTModuleLayout";
import { Globe, Search, UserCheck, MapPin } from "lucide-react";
import NeonCard from "@/components/ui/NeonCard";
import GlassCard from "@/components/ui/GlassCard";
import CyberButton from "@/components/ui/CyberButton";

export default function OSINTPage() {
    return (
        <CSIRTModuleLayout
            title="OSINT e Investigación"
            description="Inteligencia de fuentes abiertas y reconocimiento digital."
            icon={Globe}
            iconColor="text-blue-500"
        >
            <div className="max-w-3xl mx-auto">
                <NeonCard glowColor="cyan" className="p-8 mb-8">
                    <h2 className="text-2xl font-bold text-white mb-6 text-center">Búsqueda Unificada</h2>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Email, IP, Dominio, Usuario..."
                            className="flex-1 bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                        />
                        <CyberButton>Investigar</CyberButton>
                    </div>
                    <div className="flex justify-center gap-4 mt-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><Search className="w-3 h-3" /> Breach Data</span>
                        <span className="flex items-center gap-1"><UserCheck className="w-3 h-3" /> Social Media</span>
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> Geolocation</span>
                    </div>
                </NeonCard>
            </div>
        </CSIRTModuleLayout>
    );
}
