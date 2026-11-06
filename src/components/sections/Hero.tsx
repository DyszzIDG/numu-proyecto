"use client";
import React, { Suspense } from "react";
import { motion } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import CyberButton from "../ui/CyberButton";
import GlitchText from "../ui/GlitchText";
import Earth3D from "../ui/Earth3D";
import InteractiveGrid from "../ui/InteractiveGrid";

const Hero: React.FC = () => {
    return (
        <section className="relative w-full h-screen flex flex-col justify-center overflow-hidden bg-black/90">
            {/* Background 3D Layer */}
            <div className="absolute inset-0 z-0">
                <InteractiveGrid />
            </div>

            {/* Rotating Earth Overlay */}
            <div className="absolute right-[-10%] md:right-0 top-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-100 pointer-events-none z-0">
                <Canvas camera={{ position: [0, 0, 4] }}>
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} />
                    <Suspense fallback={null}>
                        <Earth3D />
                    </Suspense>
                </Canvas>
            </div>

            {/* Content Container */}
            <div className="container mx-auto px-4 z-10 relative">
                <div className="max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="mb-4"
                    >
                        <span className="text-cyber-secondary font-mono text-sm tracking-widest uppercase mb-2 block">
                            System Status: Secure_Connection_Established
                        </span>
                        <div className="h-1 w-20 bg-cyber-secondary/50 mb-6"></div>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-5xl md:text-7xl font-bold font-mono text-white mb-6 leading-tight"
                    >
                        <GlitchText text="CIBERSEGURIDAD" size="xl" />
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-primary to-white">
                            TRANSFORMACIÓN DIGITAL
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl font-light"
                    >
                        Premium, Asequible y con Impacto Social. Defendemos tus activos digitales e impulsamos el potencial de la Economía Digital en Latam.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="flex flex-wrap gap-4"
                    >
                        <CyberButton onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}>
                            Explorar Soluciones
                        </CyberButton>
                        <CyberButton variant="outline" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
                            Contáctanos
                        </CyberButton>
                        <a
                            href="/client/login"
                            className="px-8 py-3 border-2 border-cyan-400 text-cyan-400 font-bold rounded-lg hover:bg-cyan-400/10 transition-all duration-300 flex items-center gap-2 group"
                        >
                            <span>PORTAL CLIENTE</span>
                            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </a>
                    </motion.div>
                </div>
            </div>

            {/* Decorative localized elements */}
            <div className="absolute bottom-10 right-10 text-right hidden md:block">
                <p className="text-cyber-primary font-mono text-xs">LOC: PANAMA CITY [HQ]</p>
                <p className="text-gray-500 font-mono text-xs">LAT: 8.9824° N / LON: 79.5199° W</p>
            </div>
        </section>
    );
};

export default Hero;
