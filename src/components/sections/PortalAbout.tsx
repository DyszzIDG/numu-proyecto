"use client";
import React from "react";
import { motion } from "framer-motion";

const PortalAbout = () => {
    return (
        <section id="about" className="py-24 bg-background relative overflow-hidden font-sans">
            {/* Ambient Background */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyber-primary/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyber-secondary/10 rounded-full blur-[120px]" />

            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="max-w-6xl mx-auto"
                >
                    <div className="text-center mb-20">
                        <span className="text-cyber-secondary font-mono tracking-widest text-sm uppercase">Quiénes Somos</span>
                        <h2 className="text-5xl md:text-6xl font-bold text-white mt-4 mb-6 tracking-tight">
                            "We are the <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-primary to-cyber-secondary">Good Guys</span>"
                        </h2>
                        <p className="text-xl text-gray-400 font-light">
                            Generando Bienestar Digital para nuestra comunidad
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-4">
                                    The Good Guys: <span className="text-cyber-primary">Los Guardianes del Bienestar Digital</span>
                                </h3>
                                <p className="text-gray-300 leading-relaxed text-lg">
                                    Somos el equipo que defiende los sueños, el trabajo y el futuro de Latinoamérica y el Caribe.
                                    No usamos capas ni espadas, pero tenemos algo más poderoso: conocimiento, ética y un compromiso
                                    inquebrantable con la justicia digital.
                                </p>
                            </div>

                            <ul className="space-y-4">
                                {[
                                    "Protegemos los activos que sostienen economías locales.",
                                    "Salvaguardamos los empleos que alimentan familias.",
                                    "Educamos a las comunidades para que nadie caiga en las trampas de la oscuridad.",
                                    "Somos la barrera entre el caos y la estabilidad, entre el miedo y la confianza."
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-cyber-secondary mt-2.5" />
                                        <span className="text-gray-400">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-cyber-primary to-cyber-secondary rounded-2xl opacity-20 blur-xl transform rotate-3" />
                            <div className="relative bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-10">
                                <h4 className="text-xl font-bold text-white mb-6">
                                    La Batalla que Libramos Todos los Días
                                </h4>
                                <p className="text-gray-400 mb-8 leading-relaxed">
                                    Cada ataque frustrado, cada estafa prevenida, cada empresa que sigue operando gracias a nuestra vigilancia… es una victoria.
                                    No solo para nosotros, sino para toda una región que merece crecer en un entorno digital seguro.
                                </p>

                                <div className="border-l-2 border-cyber-accent pl-6 py-2">
                                    <p className="text-gray-300 italic mb-4">
                                        "Los Atacantes pueden tener algoritmos maliciosos y tácticas engañosas, pero nosotros tenemos algo que ellos jamás tendrán:
                                    </p>
                                    <p className="text-cyber-accent font-bold text-lg">
                                        el propósito de hacer el bien."
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default PortalAbout;
