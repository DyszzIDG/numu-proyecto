"use client";
import React, { useState } from "react";
import { Globe, Award, ShieldCheck, MapPin, Phone, Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const PortalTrust = () => {
    const [selectedCity, setSelectedCity] = useState<string | null>(null);

    const countries = [
        "Madrid", "Managua", "Buenos Aires", "Bogotá",
        "Panama City", "San Salvador", "Santo Domingo",
        "Quito", "Washington D.C."
    ];

    const memberships = [
        { name: "FIRST", icon: <ShieldCheck /> },
        { name: "CSIRT.es", icon: <ShieldCheck /> },
        { name: "AENOR ISO 27001", icon: <Award /> },
        { name: "AENOR ISO 9001", icon: <Award /> },
        { name: "BID Lab", icon: <Globe /> },
    ];

    return (
        <section className="py-24 bg-background border-t border-white/5 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                {/* Certifications / Memberships */}
                <div className="text-center mb-24">
                    <h2 className="text-sm font-bold text-cyber-secondary mb-10 uppercase tracking-[0.2em]">
                        Membresías y Referencias
                    </h2>
                    <div className="flex flex-wrap justify-center gap-6">
                        {memberships.map((item, idx) => (
                            <div key={idx} className="group flex items-center gap-3 border border-white/5 bg-white/5 px-8 py-4 rounded-xl hover:border-cyber-primary/30 hover:bg-cyber-primary/5 transition-all duration-300">
                                <span className="text-gray-400 group-hover:text-cyber-primary transition-colors">{item.icon}</span>
                                <span className="text-gray-300 font-medium group-hover:text-white transition-colors">{item.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Presence */}
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-white mb-12 flex items-center justify-center gap-4">
                        <Globe className="text-cyber-secondary w-8 h-8" />
                        <span className="tracking-tight">PRESENCIA GLOBAL</span>
                    </h2>

                    <div className="flex flex-wrap justify-center gap-3 max-w-5xl mx-auto mb-12">
                        {countries.map((city, index) => (
                            <button
                                key={index}
                                onClick={() => setSelectedCity(city)}
                                className={`px-5 py-2.5 rounded-lg border transition-all duration-300 font-mono text-sm ${selectedCity === city
                                        ? "bg-cyber-secondary/20 border-cyber-secondary text-white shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                                        : "bg-white/5 text-gray-400 border-white/5 hover:border-cyber-secondary/50 hover:text-cyber-secondary hover:bg-cyber-secondary/5"
                                    }`}
                            >
                                {city}
                            </button>
                        ))}
                    </div>

                    <AnimatePresence mode="wait">
                        {selectedCity && (
                            <motion.div
                                key={selectedCity}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="max-w-md mx-auto"
                            >
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-cyber-secondary/10 rounded-full blur-[40px] -mr-16 -mt-16" />

                                    <div className="relative z-10 text-left">
                                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                            <MapPin className="text-cyber-secondary w-5 h-5" />
                                            {selectedCity} HQ
                                        </h3>
                                        <div className="space-y-3 text-gray-400 text-sm">
                                            <p className="flex items-center gap-3">
                                                <Phone className="w-4 h-4 text-gray-500" />
                                                +XX (XXX) XXX-XXXX
                                            </p>
                                            <p className="flex items-center gap-3">
                                                <Mail className="w-4 h-4 text-gray-500" />
                                                contact.{selectedCity.toLowerCase().replace(" ", "").replace(".", "")}@numugroup.com
                                            </p>
                                            <p className="pl-7 text-xs text-gray-500">
                                                * Dirección corporativa disponible bajo solicitud.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
};

export default PortalTrust;
