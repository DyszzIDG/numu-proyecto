"use client";
import React from "react";
import { motion } from "framer-motion";
import { Server, BrainCircuit, Lightbulb } from "lucide-react";

const services = [
    {
        icon: <Server className="w-8 h-8 text-cyan-400" />,
        title: "Infraestructura Segura",
        description: "Arquitecturas resilientes y auditoría continua."
    },
    {
        icon: <BrainCircuit className="w-8 h-8 text-purple-400" />,
        title: "Innovación con IA",
        description: "Automatización de procesos y análisis predictivo."
    },
    {
        icon: <Lightbulb className="w-8 h-8 text-emerald-400" />,
        title: "Desarrollo de Talento",
        description: "Formación especializada para equipos de alto rendimiento."
    }
];

const PortalServices = () => {
    return (
        <section id="services" className="py-24 bg-black relative">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                        NUESTROS <span className="text-gray-500">SERVICIOS</span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Un enfoque holístico para la excelencia tecnológica.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 }}
                            className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-center group"
                        >
                            <div className="inline-flex items-center justify-center p-4 rounded-full bg-black/50 mb-6 group-hover:scale-110 transition-transform">
                                {service.icon}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
                            <p className="text-gray-400">{service.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PortalServices;
