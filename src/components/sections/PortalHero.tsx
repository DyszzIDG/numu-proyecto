"use client";
import React from "react";
import { motion } from "framer-motion";
import DynamicBackground from "../ui/DynamicBackground";

const PortalHero = () => {
    return (
        <section className="relative h-screen flex items-center justify-center bg-transparent overflow-hidden font-sans">
            {/* DynamicBackground removed to let MainScene show through */}

            {/* Ambient Glows - Kept for extra depth on top of dynamic background */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyber-primary/20 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyber-accent/20 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow" style={{ animationDelay: '2s' }} />

            <div className="relative z-10 container mx-auto px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                >
                    <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
                        <span className="text-sm font-medium text-cyber-secondary tracking-wide uppercase">
                            Orquestando el Futuro Digital
                        </span>
                    </div>

                    <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-white mb-6 drop-shadow-2xl">
                        NUMU <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-primary via-cyber-secondary to-cyber-accent">GROUP</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto font-light leading-relaxed">
                        Construimos, escalamos y transformamos negocios en la economía digital con tecnología de vanguardia.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2, duration: 1 }}
                    className="absolute bottom-10 left-0 right-0"
                >
                    <div className="flex flex-col items-center gap-4">
                        <span className="text-xs font-medium text-gray-500 tracking-[0.2em] uppercase">Scroll to explore</span>
                        <div className="w-[1px] h-12 bg-gradient-to-b from-gray-500 to-transparent"></div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default PortalHero;
