"use client";
import React from "react";
import { motion } from "framer-motion";

const milestones = [
    {
        year: "2025",
        items: [
            {
                month: "Marzo",
                title: "Inicia Empleabilidad del Programa CREC",
                description: "Puente entre jóvenes graduados y mercados laborales para experiencia en Ciberseguridad."
            },
            {
                month: "Enero",
                title: "Establecimiento de NUMU en República Dominicana",
                description: "Expansión para brindar servicios de Ciberseguridad y Transformación Digital."
            }
        ]
    },
    {
        year: "2024",
        items: [
            {
                month: "Diciembre",
                title: "Aumenta la participación de mujeres jóvenes",
                description: "Certificación de 406 jóvenes (40% mujeres) en MSS/SOC y Hacking Ético con apoyo de BID Lab."
            },
            {
                month: "Diciembre",
                title: "Tercera Graduación en Panamá",
                description: "116 certificaciones con alcance nacional."
            },
            {
                month: "Junio",
                title: "Establecimiento en El Salvador",
                description: "Incorporación de NUMU S.A. y expansión del CREC."
            }
        ]
    },
    {
        year: "2023",
        items: [
            {
                month: "Junio",
                title: "Inicio construcción SOC",
                description: "Despliegue de Moderno SOC global para la región latinoamericana."
            }
        ]
    },
    {
        year: "2022",
        items: [
            {
                month: "Marzo",
                title: "Firma del Proyecto con BID Lab",
                description: "Acuerdo para despliegue del Centro Regional de Excelencia en Ciberseguridad (CREC)."
            }
        ]
    },
    {
        year: "2018",
        items: [
            {
                month: "Marzo",
                title: "Establecimiento de NUMU en Nicaragua",
                description: "Inauguración de NUMU Coworking & Tech Hub."
            }
        ]
    }
];

const PortalTimeline = () => {
    return (
        <section className="py-24 bg-black relative">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        RESULTADOS E <span className="text-cyan-400">HITOS</span>
                    </h2>
                    <p className="text-gray-400">Compromiso – Coherencia – Crecimiento</p>
                </motion.div>

                <div className="relative max-w-4xl mx-auto pl-8 border-l border-white/10">
                    {milestones.map((yearGroup, index) => (
                        <div key={index} className="mb-12 relative">
                            {/* Year Marker */}
                            <div className="absolute -left-[41px] top-0 bg-cyan-500/20 border border-cyan-500 text-cyan-400 font-bold rounded-full w-16 h-16 flex items-center justify-center text-sm shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                                {yearGroup.year}
                            </div>

                            <div className="ml-8 space-y-8 pt-2">
                                {yearGroup.items.map((item, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="relative p-6 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-colors"
                                    >
                                        <div className="text-sm text-cyan-400 font-mono mb-2 uppercase tracking-wider">{item.month}</div>
                                        <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                                        <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PortalTimeline;
