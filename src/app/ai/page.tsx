"use client";
import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import DynamicBackground from "@/components/ui/DynamicBackground";
import AIRobotScene from "@/components/3d/AIRobotScene"; // Import 3D Scene
import { Brain, Cpu, MessageSquare, Zap, Bot, Network } from "lucide-react";
import Link from "next/link";

const AIPage = () => {
    const [activeSection, setActiveSection] = useState("IDLE");

    return (
        <main className="min-h-screen bg-background text-foreground font-sans selection:bg-cyber-primary/30 relative">
            <Navbar />

            {/* 3D Background Layer - High Z-index but behind content, logic handled via pointer-events-none in component */}
            <div className="fixed inset-0 z-0">
                <AIRobotScene activeSection={activeSection} />
            </div>

            {/* Content Layer */}
            <div className="relative z-10">
                {/* Hero Section */}
                <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
                    {/* Dynamic Background blended with 3D */}
                    <div className="absolute inset-0 opacity-30"><DynamicBackground /></div>

                    <div className="container mx-auto px-4 relative z-10 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            onMouseEnter={() => setActiveSection("IDLE")} // Reset on hover title
                        >
                            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 tracking-tight">
                                INTELIGENCIA ARTIFICIAL
                            </h1>
                            <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light backdrop-blur-sm bg-black/30 p-4 rounded-xl border border-white/5">
                                Redefiniendo el futuro con Modelos de Lenguaje Avanzados y Agentes Autónomos.
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Content Sections */}
                <section className="py-24 relative">
                    <div className="container mx-auto px-4 max-w-6xl">

                        {/* LLM Section */}
                        <div
                            className="mb-32 transition-opacity duration-500"
                            onMouseEnter={() => setActiveSection("LLM")}
                            onClick={() => setActiveSection("LLM")}
                        >
                            <div className="flex items-center gap-4 mb-12 backdrop-blur-md bg-black/20 p-6 rounded-2xl border border-white/5 w-fit">
                                <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20">
                                    <Brain className="w-10 h-10 text-purple-400" />
                                </div>
                                <h2 className="text-4xl font-bold text-white tracking-tight">LLM (Large Language Models)</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="relative group overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md p-8 hover:border-purple-500/50 transition-all duration-500 hover:bg-black/60 cursor-pointer">
                                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <div className="relative z-10">
                                        <MessageSquare className="w-12 h-12 text-purple-400 mb-6" />
                                        <h3 className="text-2xl font-bold text-white mb-4">Generación de Contenido</h3>
                                        <p className="text-gray-400 leading-relaxed">
                                            Modelos capaces de generar texto, código y contenido creativo con una fluidez y coherencia indistinguibles del humano. Potencie su comunicación corporativa y desarrollo.
                                        </p>
                                    </div>
                                </div>

                                <div className="relative group overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md p-8 hover:border-purple-500/50 transition-all duration-500 hover:bg-black/60 cursor-pointer">
                                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <div className="relative z-10">
                                        <Network className="w-12 h-12 text-purple-400 mb-6" />
                                        <h3 className="text-2xl font-bold text-white mb-4">Análisis Semántico</h3>
                                        <p className="text-gray-400 leading-relaxed">
                                            Comprensión profunda de documentos, contratos y grandes volúmenes de datos no estructurados. Extraiga insights valiosos de sus repositorios de información.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* AGENTE Section */}
                        <div
                            onMouseEnter={() => setActiveSection("AGENT")}
                            onClick={() => setActiveSection("AGENT")}
                        >
                            <div className="flex items-center gap-4 mb-12 backdrop-blur-md bg-black/20 p-6 rounded-2xl border border-white/5 w-fit">
                                <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20">
                                    <Bot className="w-10 h-10 text-cyan-400" />
                                </div>
                                <h2 className="text-4xl font-bold text-white tracking-tight">AGENTE (Agentes Autónomos)</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[
                                    { title: "Automatización Cognitiva", icon: <Zap />, desc: "Agentes que ejecutan tareas complejas encadenando pensamientos y acciones." },
                                    { title: "Integración de Sistemas", icon: <Cpu />, desc: "Conexión fluida entre APIs, bases de datos y herramientas empresariales." },
                                    { title: "Toma de Decisiones", icon: <Bot />, desc: "Sistemas capaces de evaluar escenarios y tomar decisiones operativas en tiempo real." }
                                ].map((item, i) => (
                                    <div key={i} className="relative group overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md p-8 hover:border-cyan-500/50 transition-all duration-500 hover:bg-black/60 cursor-pointer">
                                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                        <div className="relative z-10">
                                            <div className="text-cyan-400 w-10 h-10 mb-6">{item.icon}</div>
                                            <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                                            <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </section>
            </div>
        </main>
    );
};

export default AIPage;
