"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import DynamicBackground from "@/components/ui/DynamicBackground";
import EducationScene from "@/components/3d/EducationScene";
import Link from "next/link";
import { GraduationCap, Library, Flag, Globe, Building2, BookOpen, Shield, Users, ArrowLeft, Sparkles, TrendingUp } from "lucide-react";

const EducationPage = () => {
    const [activeSection, setActiveSection] = useState("IDLE");
    const router = useRouter();

    const handleNavigation = (path: string) => {
        console.log('Navigating to:', path);
        router.push(path);
    };

    return (
        <main className="min-h-screen bg-background text-foreground font-sans selection:bg-cyber-primary/30 relative overflow-hidden">
            <Navbar />

            {/* Animated Background Gradients */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>



            {/* 3D Background */}
            <div className="fixed inset-0 z-0">
                <EducationScene section={activeSection} />
            </div>

            {/* Content Layer */}
            <div className="relative z-10">
                {/* Hero Section */}
                <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 opacity-20"><DynamicBackground /></div>
                    <div className="container mx-auto px-4 relative z-10 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            onMouseEnter={() => setActiveSection("IDLE")}
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
                                <Sparkles className="w-4 h-4 text-emerald-400" />
                                <span className="text-emerald-400 text-sm font-medium">Plataforma Educativa de Vanguardia</span>
                            </div>

                            <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 tracking-tight">
                                AKADEMY
                            </h1>

                            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto font-light backdrop-blur-sm bg-black/30 p-6 rounded-2xl border border-white/5">
                                Capacitando a la próxima generación de profesionales en ciberseguridad y tecnología digital
                            </p>

                            <div className="flex items-center justify-center gap-8 mt-8">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-emerald-400">500+</div>
                                    <div className="text-sm text-gray-400">Estudiantes</div>
                                </div>
                                <div className="w-px h-12 bg-white/10" />
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-teal-400">50+</div>
                                    <div className="text-sm text-gray-400">Cursos</div>
                                </div>
                                <div className="w-px h-12 bg-white/10" />
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-cyan-400">95%</div>
                                    <div className="text-sm text-gray-400">Satisfacción</div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Content Sections */}
                <section className="py-24 relative">
                    <div className="container mx-auto px-4 max-w-6xl">

                        {/* CRECK */}
                        <motion.div
                            className="mb-24"
                            onMouseEnter={() => setActiveSection("CRECK")}
                            onClick={() => setActiveSection("CRECK")}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="relative group overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-black/60 via-black/40 to-black/60 backdrop-blur-md p-12 hover:border-emerald-500/50 transition-all duration-500 cursor-pointer">
                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 via-teal-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />

                                <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
                                    <div className="p-8 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 group-hover:scale-110 transition-transform duration-500">
                                        <GraduationCap className="w-16 h-16 text-emerald-400" />
                                    </div>
                                    <div className="text-center md:text-left flex-1">
                                        <h2 className="text-5xl font-bold text-white mb-4 group-hover:text-emerald-400 transition-colors">CRECK</h2>
                                        <p className="text-lg text-gray-300 leading-relaxed mb-4">
                                            <span className="font-semibold text-emerald-400">Cybersecurity Research Education Center Knowledge.</span> Un centro de excelencia dedicado a la investigación y difusión de conocimiento avanzado en seguridad informática.
                                        </p>
                                        <div className="flex items-center gap-2 text-sm text-emerald-400">
                                            <TrendingUp className="w-4 h-4" />
                                            <span>Centro de Investigación Líder</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                            {/* MOODLE */}
                            <motion.div
                                className="space-y-8"
                                onMouseEnter={() => setActiveSection("MOODLE")}
                                initial={{ opacity: 0, x: -40 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                            >
                                <div className="flex items-center gap-4 mb-6 backdrop-blur-md bg-gradient-to-r from-teal-500/10 to-transparent p-4 rounded-xl w-fit border border-teal-500/20">
                                    <Library className="w-8 h-8 text-teal-400" />
                                    <h2 className="text-3xl font-bold text-white tracking-tight">MOODLE</h2>
                                </div>

                                <div className="bg-gradient-to-br from-black/60 to-black/40 border border-white/10 rounded-2xl p-8 backdrop-blur-md hover:border-teal-500/30 transition-all duration-500 group">
                                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                        <BookOpen className="w-5 h-5 text-teal-500" /> General
                                    </h3>
                                    <div className="space-y-4">
                                        <div
                                            onClick={() => handleNavigation('/servicios/educacion/moodle/bid')}
                                            className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-teal-500/30 transition-all cursor-pointer group/item hover:bg-gradient-to-r hover:from-teal-500/10 hover:to-transparent"
                                        >
                                            <div className="p-2 bg-teal-500/10 rounded-lg group-hover/item:bg-teal-500/20 text-teal-400 transition-all">
                                                <Globe className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h4 className="text-white font-medium group-hover/item:text-teal-400 transition-colors">BID</h4>
                                                <p className="text-sm text-gray-500">Banco Interamericano de Desarrollo</p>
                                            </div>
                                        </div>

                                        <div
                                            onClick={() => handleNavigation('/servicios/educacion/moodle/universidad')}
                                            className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-teal-500/30 transition-all cursor-pointer group/item hover:bg-gradient-to-r hover:from-teal-500/10 hover:to-transparent"
                                        >
                                            <div className="p-2 bg-teal-500/10 rounded-lg group-hover/item:bg-teal-500/20 text-teal-400 transition-all">
                                                <Building2 className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h4 className="text-white font-medium group-hover/item:text-teal-400 transition-colors">Universidad</h4>
                                                <p className="text-sm text-gray-500">Programas Académicos</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* CTF */}
                            <motion.div
                                className="space-y-8"
                                onMouseEnter={() => setActiveSection("CTF")}
                                initial={{ opacity: 0, x: 40 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                            >
                                <div className="flex items-center gap-4 mb-6 backdrop-blur-md bg-gradient-to-r from-emerald-500/10 to-transparent p-4 rounded-xl w-fit border border-emerald-500/20">
                                    <Flag className="w-8 h-8 text-emerald-400" />
                                    <h2 className="text-3xl font-bold text-white tracking-tight">CTF (GENERAL)</h2>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    {[
                                        { title: "Ministerio Seguridad Panamá", icon: <Shield />, id: "ministerio-panama" },
                                        { title: "AHIBA Honduras", icon: <Building2 />, id: "ahiba-honduras" },
                                        { title: "ITSE Panamá", icon: <GraduationCap />, id: "itse-panama" },
                                        { title: "Otros", icon: <Users />, id: "otros" },
                                    ].map((item, i) => (
                                        <motion.div
                                            key={i}
                                            onClick={() => handleNavigation(`/servicios/educacion/moodle/${item.id}`)}
                                            className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-black/60 to-black/40 border border-white/5 hover:border-emerald-500/30 transition-all cursor-pointer group backdrop-blur-md hover:from-emerald-500/10 hover:to-transparent"
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: i * 0.1 }}
                                        >
                                            <div className="p-2 bg-emerald-500/10 rounded-lg group-hover:bg-emerald-500/20 text-emerald-400 transition-all">
                                                {React.cloneElement(item.icon as React.ReactElement, { className: "w-5 h-5" })}
                                            </div>
                                            <span className="text-gray-300 font-medium group-hover:text-emerald-400 transition-colors">{item.title}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>

                        </div>

                        {/* CTA Button */}
                        <motion.div
                            className="flex justify-center mt-20"
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <button
                                onClick={() => window.open('http://localhost:8080', '_blank')}
                                className="group relative px-12 py-6 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl font-bold text-white text-xl tracking-wider hover:scale-105 transition-all duration-300 shadow-[0_0_40px_rgba(16,185,129,0.4)] hover:shadow-[0_0_60px_rgba(16,185,129,0.6)] border border-white/20"
                            >
                                <div className="absolute inset-0 bg-white/20 blur-xl rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <span className="relative z-10 flex items-center gap-3">
                                    <GraduationCap className="w-6 h-6" />
                                    COMENZAR AHORA
                                    <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </span>
                            </button>
                        </motion.div>

                    </div>
                </section>
            </div>
        </main>
    );
};

export default EducationPage;
