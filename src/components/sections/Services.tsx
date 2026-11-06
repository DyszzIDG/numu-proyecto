"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NeonCard from "../ui/NeonCard";
import CyberButton from "../ui/CyberButton";
import { Shield, ArrowRight, Activity, Search, Network, AlertTriangle, FileText, X } from "lucide-react";

const services = [
    {
        id: "csirt",
        icon: <Shield className="w-10 h-10 text-cyber-primary" />,
        title: "CSIRT",
        description: "Centro de Operaciones y Respuesta a Incidentes de Seguridad 24/7. Gestión integral de amenazas y respuesta coordinada.",
        glow: "cyan",
        link: "/csirt/operations"
    },
    {
        id: "soc",
        icon: <Activity className="w-10 h-10 text-cyber-accent" />,
        title: "SOC 24/7",
        description: "Centro de Operaciones de Seguridad con monitoreo continuo. Visibilidad completa de tu infraestructura las 24 horas.",
        glow: "magenta",
        link: "/servicios/soc-24-7"
    },
    {
        id: "scanning",
        icon: <Search className="w-10 h-10 text-cyber-secondary" />,
        title: "Escaneo",
        description: "Análisis y escaneo de vulnerabilidades. Identificación proactiva de brechas de seguridad en tu infraestructura.",
        glow: "green",
        link: "/dashboard/unified-scan"
    },
    {
        id: "others",
        icon: <Network className="w-10 h-10 text-cyber-primary" />,
        title: "Otros",
        description: "Servicios adicionales de ciberseguridad. Soluciones personalizadas para necesidades específicas.",
        glow: "cyan",
        link: "/dashboard"
    }
] as const;

const Services: React.FC = () => {
    const [activeId, setActiveId] = useState<string | null>(null);
    const [showDisclaimer, setShowDisclaimer] = useState(true);
    const [termsAccepted, setTermsAccepted] = useState(false);

    useEffect(() => {
        // Check if user has already accepted terms in this session
        const accepted = sessionStorage.getItem('termsAccepted');
        if (accepted === 'true') {
            setShowDisclaimer(false);
            setTermsAccepted(true);
        }
    }, []);

    const handleAcceptTerms = () => {
        sessionStorage.setItem('termsAccepted', 'true');
        setTermsAccepted(true);
        setShowDisclaimer(false);
    };

    const handleDeclineTerms = () => {
        window.location.href = '/';
    };

    return (
        <>
            {/* Disclaimer Modal */}
            <AnimatePresence>
                {showDisclaimer && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-cyber-dark border-2 border-cyber-primary/50 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl shadow-cyber-primary/20"
                        >
                            {/* Header */}
                            <div className="bg-gradient-to-r from-cyber-primary/20 to-cyber-secondary/20 border-b border-white/10 p-6">
                                <div className="flex items-center gap-3">
                                    <AlertTriangle className="w-8 h-8 text-yellow-400" />
                                    <h2 className="text-2xl font-bold text-white font-mono">AVISO IMPORTANTE</h2>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 overflow-y-auto max-h-[60vh]">
                                <div className="space-y-4 text-gray-300">
                                    <p className="text-lg font-semibold text-white">
                                        Términos y Condiciones de Uso - Servicios de Ciberseguridad
                                    </p>

                                    <div className="space-y-3 text-sm leading-relaxed">
                                        <p>
                                            Al acceder a esta sección de servicios de ciberseguridad, usted reconoce y acepta que:
                                        </p>

                                        <ul className="list-disc list-inside space-y-2 ml-4">
                                            <li>
                                                Los servicios presentados están destinados exclusivamente para uso autorizado y con fines legítimos de seguridad informática.
                                            </li>
                                            <li>
                                                El acceso y uso de estas herramientas debe realizarse únicamente sobre sistemas e infraestructuras para los cuales posee autorización expresa.
                                            </li>
                                            <li>
                                                Cualquier uso indebido, no autorizado o malicioso de estos servicios está estrictamente prohibido y puede resultar en acciones legales.
                                            </li>
                                            <li>
                                                La información y datos procesados a través de estos servicios serán tratados con estricta confidencialidad según nuestras políticas de privacidad.
                                            </li>
                                            <li>
                                                Usted es responsable de mantener la seguridad de sus credenciales de acceso y de todas las actividades realizadas bajo su cuenta.
                                            </li>
                                            <li>
                                                Los servicios se proporcionan "tal cual" y NUMU GROUP se reserva el derecho de modificar, suspender o discontinuar cualquier servicio sin previo aviso.
                                            </li>
                                        </ul>

                                        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mt-4">
                                            <p className="text-yellow-400 font-semibold flex items-center gap-2">
                                                <AlertTriangle className="w-5 h-5" />
                                                Advertencia de Seguridad
                                            </p>
                                            <p className="text-sm text-gray-300 mt-2">
                                                El uso inadecuado de herramientas de seguridad puede causar daños a sistemas y redes.
                                                Asegúrese de contar con las autorizaciones necesarias antes de proceder.
                                            </p>
                                        </div>

                                        <p className="text-xs text-gray-500 mt-4">
                                            Al hacer clic en "Acepto", confirma que ha leído, comprendido y acepta estos términos y condiciones.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="border-t border-white/10 p-6 bg-cyber-black/50">
                                <div className="flex gap-4 justify-end">
                                    <button
                                        onClick={handleDeclineTerms}
                                        className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/20 rounded-lg font-semibold transition-all text-gray-300 hover:text-white"
                                    >
                                        Rechazar
                                    </button>
                                    <button
                                        onClick={handleAcceptTerms}
                                        className="px-6 py-3 bg-gradient-to-r from-cyber-primary to-cyber-secondary hover:opacity-90 rounded-lg font-semibold transition-all shadow-lg shadow-cyber-primary/30"
                                    >
                                        Acepto los Términos
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Services Section - Only visible after accepting terms */}
            <section id="services" className={`py-24 relative bg-cyber-black min-h-screen flex flex-col justify-center ${!termsAccepted ? 'pointer-events-none opacity-50 blur-sm' : ''}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-mono font-bold text-white mb-6">
                            <span className="text-cyber-primary">/</span> NUESTRAS SOLUCIONES
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                            Selecciona una especialidad para desplegar información táctica.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {services.map((service) => (
                            <motion.div
                                key={service.id}
                                layout
                                onClick={() => setActiveId(activeId === service.id ? null : service.id)}
                                className="cursor-pointer"
                            >
                                <NeonCard
                                    glowColor={service.glow}
                                    className={`h-full transition-all duration-300 ${activeId === service.id ? 'ring-2 ring-white/20 scale-105 bg-cyber-gray/30' : 'hover:bg-cyber-gray/10'}`}
                                >
                                    <div className="flex flex-col items-center text-center p-4">
                                        <div className="mb-6 p-4 bg-cyber-black/50 rounded-full border border-white/5 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                                            {service.icon}
                                        </div>
                                        <h3 className="text-2xl font-bold text-white mb-2 font-mono tracking-wide">{service.title}</h3>

                                        <AnimatePresence>
                                            {activeId === service.id && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: "auto" }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="pt-4 border-t border-white/10 mt-4">
                                                        <p className="text-gray-300 mb-6 leading-relaxed">
                                                            {service.description}
                                                        </p>
                                                        <a href={service.link} onClick={(e) => e.stopPropagation()}>
                                                            <CyberButton className="w-full group">
                                                                <span className="mr-2">ACCEDER</span>
                                                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                            </CyberButton>
                                                        </a>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        {activeId !== service.id && (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="mt-2"
                                            >
                                                <span className="text-xs text-gray-500 font-mono">[ + DETALLES ]</span>
                                            </motion.div>
                                        )}
                                    </div>
                                </NeonCard>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
};

export default Services;
