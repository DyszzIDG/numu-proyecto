"use client";

import React from "react";
import Link from "next/link";
import { Globe, Shield, Award } from "lucide-react";

const Footer = () => {
    const cities = [
        "Madrid", "Managua", "Buenos Aires", "Bogotá",
        "Panamá City", "San Salvador", "Santo Domingo",
        "Quito", "Washington D.C."
    ];

    const certifications = [
        { name: "FIRST", icon: Shield },
        { name: "CSIRT.uy", icon: Shield },
        { name: "AENOR ISO 27001", icon: Award },
        { name: "AENOR ISO 9001", icon: Award },
        { name: "EID Lab", icon: Globe }
    ];

    return (
        <footer className="relative border-t border-white/5 bg-black/40 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Logo */}
                <div className="flex justify-center mb-8">
                    <img
                        src="/logos/logotipo-NUMUGROUP (4).png"
                        alt="NUMU Group"
                        className="h-10 w-auto opacity-80"
                    />
                </div>

                {/* Membresías y Referencias */}
                <div className="mb-12">
                    <h3 className="text-center text-sm font-semibold text-cyber-primary mb-6 tracking-widest uppercase">
                        Membresías y Referencias
                    </h3>
                    <div className="flex flex-wrap justify-center gap-4">
                        {certifications.map((cert, idx) => {
                            const Icon = cert.icon;
                            return (
                                <div
                                    key={idx}
                                    className="px-4 py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors flex items-center gap-2"
                                >
                                    <Icon className="w-4 h-4 text-cyber-primary" />
                                    <span className="text-xs text-gray-300">{cert.name}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Presencia Global */}
                <div className="mb-12">
                    <h3 className="text-center text-sm font-semibold text-white mb-6 tracking-wide flex items-center justify-center gap-2">
                        <Globe className="w-5 h-5 text-cyber-primary" />
                        PRESENCIA GLOBAL
                    </h3>
                    <div className="flex flex-wrap justify-center gap-3">
                        {cities.map((city, idx) => (
                            <div
                                key={idx}
                                className="px-3 py-1.5 rounded border border-white/5 bg-black/40 text-xs text-gray-400 hover:text-white hover:border-cyber-primary/30 transition-colors"
                            >
                                {city}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Copyright */}
                <div className="text-center pt-8 border-t border-white/5">
                    <p className="text-xs text-gray-500">
                        © 2025 NUMU Group. Todos los derechos reservados.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
