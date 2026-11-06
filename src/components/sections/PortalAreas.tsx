"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Shield, Brain, GraduationCap, ArrowRight } from "lucide-react";
import CyberLaptopScene from "../3d/CyberLaptop";
import CyberBrainScene from "../3d/CyberBrain";
import CyberGradCapScene from "../3d/CyberGradCap";

const PortalAreas = () => {
    const modules = [
        {
            title: "CIBERSEGURIDAD",
            description: "Protección avanzada, servicios SOC/CSIRT y defensa proactiva.",
            icon: <Shield className="w-12 h-12 text-white" />,
            link: "/cybersecurity",
            color: "cyan",
            bg: "bg-gradient-to-br from-cyan-500/20 to-blue-600/20"
        },
        {
            title: "INTELIGENCIA ARTIFICIAL",
            description: "Soluciones de IA, automatización y agentes inteligentes.",
            icon: <Brain className="w-12 h-12 text-white" />,
            link: "/ai",
            color: "purple",
            bg: "bg-gradient-to-br from-purple-500/20 to-pink-600/20"
        },
        {
            title: "AKADEMY",
            description: "Academia NUMU: Formación especializada y certificaciones.",
            icon: <GraduationCap className="w-12 h-12 text-white" />,
            link: "/education",
            color: "emerald",
            bg: "bg-gradient-to-br from-emerald-500/20 to-teal-600/20"
        }
    ];

    const [hoveredCard, setHoveredCard] = useState<string | null>(null);

    return (
        <section id="areas" className="py-24 bg-background relative">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <span className="text-gray-400 font-mono tracking-widest text-sm uppercase">Nuestras Divisiones</span>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mt-4 mb-2 tracking-tight">
                        ÁREAS DE NEGOCIO
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
                    {modules.map((module, index) => (
                        <Link
                            href={module.link}
                            key={module.title}
                            className="block group h-full"
                            onMouseEnter={() => setHoveredCard(module.title)}
                            onMouseLeave={() => setHoveredCard(null)}
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="relative h-full overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-500 group-hover:-translate-y-2 group-hover:border-white/20"
                            >
                                {/* DYNAMIC BACKGROUNDS */}
                                <div className="absolute inset-0 z-0 opacity-50 group-hover:opacity-100 transition-opacity duration-500">
                                    {module.title === "CIBERSEGURIDAD" && (
                                        <CyberLaptopScene hovered={hoveredCard === "CIBERSEGURIDAD"} />
                                    )}
                                    {module.title === "INTELIGENCIA ARTIFICIAL" && (
                                        <CyberBrainScene hovered={hoveredCard === "INTELIGENCIA ARTIFICIAL"} />
                                    )}
                                    {module.title === "AKADEMY" && (
                                        <CyberGradCapScene hovered={hoveredCard === "AKADEMY"} />
                                    )}
                                    {/* Overlay to ensure text readability */}
                                    <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-colors duration-500" />
                                </div>


                                <div className="relative z-10 p-10 h-full flex flex-col justify-between min-h-[350px]">
                                    <div>
                                        <div className="mb-8 p-4 bg-white/10 rounded-2xl w-fit backdrop-blur-md border border-white/10 group-hover:scale-110 transition-transform duration-500">
                                            {module.icon}
                                        </div>

                                        <h2 className="text-2xl font-bold text-white mb-4 tracking-tight relative z-10">{module.title}</h2>
                                        <p className="text-gray-400 group-hover:text-gray-200 transition-colors text-lg leading-relaxed relative z-10">
                                            {module.description}
                                        </p>
                                    </div>

                                    <div className="mt-8 flex items-center text-white font-medium tracking-wide text-sm uppercase group-hover:gap-4 gap-2 transition-all relative z-10">
                                        Acceder <ArrowRight className="w-4 h-4" />
                                    </div>
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PortalAreas;
