"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Search, Cloud, Activity, Terminal, Eye, Users, FileText, ChevronRight } from "lucide-react";

const solutionCategories = [
    {
        id: "strategic",
        title: "Consultoría Estratégica",
        icon: <FileText className="w-6 h-6" />,
        items: [
            "Plan Estratégico de Ciberseguridad",
            "Master Plan de Ciberseguridad",
            "Cumplimiento Normativo (ISO, GDPR, ENS)",
            "Evaluación de Riesgos",
            "Evaluación de Riesgos IoT",
            "Implementación del Esquema Nacional de Seguridad"
        ]
    },
    {
        id: "testing",
        title: "Evaluación y Pruebas",
        icon: <Search className="w-6 h-6" />,
        items: [
            "Evaluación de Vulnerabilidades",
            "Pruebas de Penetración",
            "Pruebas de Phishing",
            "Evaluación de Seguridad (General)",
            "Modelado de Amenazas",
            "Auditorías de Cumplimiento"
        ]
    },
    {
        id: "impl",
        title: "Implementación e Integración",
        icon: <Shield className="w-6 h-6" />,
        items: [
            "Políticas de Seguridad",
            "Soluciones de Seguridad (Firewalls, IDS/IPS, SIEM)",
            "Seguridad en la Nube (AWS, Azure, GCP)",
            "Gestión de Identidad y Acceso (IAM)"
        ]
    },
    {
        id: "managed",
        title: "Servicios Gestionados (MSS)",
        icon: <Activity className="w-6 h-6" />,
        items: [
            "Detección y Respuesta Gestionadas (MDR)",
            "SOC Gestionado",
            "Gestión de Vulnerabilidades Gestionada",
            "Gestión de Riesgos de Terceros",
            "Gestión de Identidad Digital"
        ]
    },
    {
        id: "incident",
        title: "Respuesta a Incidentes",
        icon: <Terminal className="w-6 h-6" />,
        items: [
            "Planificación de Respuesta a Incidentes",
            "Respuesta a Brechas de Seguridad",
            "Análisis Forense Digital",
            "Búsqueda de Amenazas (Threat Hunting)",
            "Planificación de Continuidad del Negocio"
        ]
    },
    {
        id: "intel",
        title: "Inteligencia de Amenazas",
        icon: <Eye className="w-6 h-6" />,
        items: [
            "Brand Intelligence",
            "Threat Intelligence",
            "Inteligencia de Seguridad Internacional",
            "Inteligencia de Terceros",
            "Inteligencia de Identidad"
        ]
    },
    {
        id: "training",
        title: "Formación y Concienciación",
        icon: <Users className="w-6 h-6" />,
        items: [
            "Formación en Concienciación sobre Seguridad",
            "Programas de Formación para Empleados"
        ]
    }
];

const PortalSolutions = () => {
    const [selectedCategory, setSelectedCategory] = useState(solutionCategories[0]);

    return (
        <section id="solutions" className="py-24 bg-background relative">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <span className="text-cyber-primary font-mono tracking-widest text-sm uppercase">Nuestras Soluciones</span>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mt-4 mb-4 tracking-tight">
                        Democratizando la <span className="text-cyber-secondary">Ciberseguridad Premium</span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        Para Grandes Organizaciones y su Cadena de Valor.
                    </p>
                </motion.div>

                <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto h-[600px]">
                    {/* Sidebar / List */}
                    <div className="lg:w-1/3 flex flex-col space-y-2 overflow-y-auto pr-2 custom-scrollbar">
                        {solutionCategories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category)}
                                className={`flex items-center p-4 rounded-xl transition-all duration-300 text-left group border ${selectedCategory.id === category.id
                                    ? "bg-white/10 border-cyber-primary text-white shadow-[0_0_20px_rgba(99,102,241,0.2)]"
                                    : "bg-transparent border-transparent hover:bg-white/5 text-gray-400 hover:text-white"
                                    }`}
                            >
                                <span className={`${selectedCategory.id === category.id ? "text-cyber-primary" : "text-gray-500 group-hover:text-cyber-primary transition-colors"}`}>
                                    {category.icon}
                                </span>
                                <span className="ml-4 font-bold flex-1 tracking-tight">{category.title}</span>
                                {selectedCategory.id === category.id && (
                                    <ChevronRight className="w-5 h-5 text-cyber-primary animate-pulse" />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Content Area */}
                    <div className="lg:w-2/3 h-full">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={selectedCategory.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                className="bg-white/5 border border-white/10 rounded-3xl p-10 h-full backdrop-blur-md relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-96 h-96 bg-cyber-primary/10 rounded-full blur-[100px] -mr-32 -mt-32" />

                                <div className="relative z-10">
                                    <div className="flex items-center mb-10">
                                        <div className="p-4 bg-cyber-primary/20 rounded-2xl text-cyber-primary mr-6 border border-cyber-primary/30">
                                            {React.cloneElement(selectedCategory.icon as React.ReactElement, { className: "w-10 h-10" })}
                                        </div>
                                        <h3 className="text-3xl font-bold text-white tracking-tight">{selectedCategory.title}</h3>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                        {selectedCategory.items.map((item, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                className="flex items-start group"
                                            >
                                                <div className="w-2 h-2 mt-2.5 rounded-full bg-cyber-secondary mr-4 flex-shrink-0 group-hover:scale-125 transition-transform" />
                                                <span className="text-gray-300 text-lg group-hover:text-white transition-colors">{item}</span>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PortalSolutions;
