"use client";
import React from "react";
import Image from "next/image"; // Note: In a real scenario, we'd need valid images.
import NeonCard from "../ui/NeonCard";

const About: React.FC = () => {
    return (
        <section id="about" className="py-24 relative bg-cyber-dark overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-cyber-primary/5 blur-[100px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-mono font-bold text-white mb-6">
                            <span className="text-cyber-secondary">/</span> QUIÉNES SOMOS
                        </h2>

                        <div className="space-y-6 text-gray-300 leading-relaxed">
                            <p>
                                <strong className="text-white">NUMU</strong> es un atípico <span className="text-cyber-primary">"Venture Builder"</span> con base en Managua y establecido como Sociedad sin Ánimo de Lucro en 2018.
                            </p>
                            <p>
                                Nuestro mantra es <span className="italic text-cyber-secondary">"Premium, Asequible y con Impacto Social"</span>. Nos apasiona concebir, incubar y acelerar startups de base tecnológica, creando ecosistemas digitales y promoviendo el emprendimiento inclusivo.
                            </p>
                            <p>
                                Combinamos la agilidad de una startup con los estándares europeos de una corporación. Contamos con más de 25 años de experiencia en el sector TIC y Desarrollo.
                            </p>
                        </div>

                        <div className="mt-10 grid grid-cols-2 gap-4">
                            <div className="border border-cyber-gray p-4 rounded bg-cyber-black/40">
                                <h4 className="text-2xl font-mono font-bold text-white">25+</h4>
                                <p className="text-xs text-gray-500 uppercase">Años de Exp.</p>
                            </div>
                            <div className="border border-cyber-gray p-4 rounded bg-cyber-black/40">
                                <h4 className="text-2xl font-mono font-bold text-cyber-secondary">100+</h4>
                                <p className="text-xs text-gray-500 uppercase">Clientes</p>
                            </div>
                            <div className="border border-cyber-gray p-4 rounded bg-cyber-black/40">
                                <h4 className="text-2xl font-mono font-bold text-cyber-primary">20+</h4>
                                <p className="text-xs text-gray-500 uppercase">Alianzas</p>
                            </div>
                            <div className="border border-cyber-gray p-4 rounded bg-cyber-black/40">
                                <h4 className="text-2xl font-mono font-bold text-white">2018</h4>
                                <p className="text-xs text-gray-500 uppercase">Fundación</p>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <NeonCard glowColor="cyan" className="p-8 border-2 border-cyber-primary/20 bg-cyber-black/80">
                            <div className="space-y-4 font-mono text-sm">
                                <div className="flex justify-between border-b border-gray-800 pb-2">
                                    <span className="text-gray-500">ENTIDAD</span>
                                    <span className="text-white">NUMU GROUP</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-800 pb-2">
                                    <span className="text-gray-500">TIPO</span>
                                    <span className="text-white">VENTURE BUILDER</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-800 pb-2">
                                    <span className="text-gray-500">SEDE</span>
                                    <span className="text-cyber-primary">PANAMA CITY</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-800 pb-2">
                                    <span className="text-gray-500">ESTADO</span>
                                    <span className="text-cyber-secondary">ACTIVO</span>
                                </div>
                                <div className="pt-4">
                                    <p className="text-gray-400 mb-2">// MISIÓN</p>
                                    <p className="text-white">
                                        Desarrollar resiliencia y asegurar el Bienestar Digital presente y futuro de Latam.
                                    </p>
                                </div>
                            </div>
                        </NeonCard>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
