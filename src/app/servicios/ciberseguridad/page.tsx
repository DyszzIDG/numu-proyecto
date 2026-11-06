"use client";

import { Shield, Eye, Network, Lock, AlertTriangle, Activity, ChevronRight, Users, Award, Clock, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function CiberseguridadPage() {
    const services = [
        {
            icon: Eye,
            title: "SOC 24x7",
            description: "Centro de Operaciones de Seguridad con monitoreo continuo de amenazas y eventos de seguridad en tiempo real.",
            features: ["Monitoreo 24/7", "Detección de amenazas", "Análisis de eventos", "Respuesta inmediata"]
        },
        {
            icon: Shield,
            title: "CSIRT",
            description: "Equipo de Respuesta a Incidentes de Seguridad Informática para gestión y mitigación de amenazas.",
            features: ["Gestión de incidentes", "Análisis forense", "Contención de amenazas", "Recuperación"]
        },
        {
            icon: Network,
            title: "Gestión de Redes",
            description: "Monitoreo y administración de infraestructura de red con análisis de tráfico y detección de anomalías.",
            features: ["Monitoreo de red", "Análisis de tráfico", "Detección de anomalías", "Optimización"]
        },
        {
            icon: Lock,
            title: "Análisis de Vulnerabilidades",
            description: "Escaneo y evaluación continua de vulnerabilidades en sistemas y aplicaciones.",
            features: ["Escaneo continuo", "Evaluación de riesgos", "Priorización", "Remediación"]
        },
        {
            icon: AlertTriangle,
            title: "Gestión de Incidentes",
            description: "Proceso estructurado para identificar, analizar y responder a incidentes de seguridad.",
            features: ["Identificación", "Clasificación", "Respuesta coordinada", "Documentación"]
        },
        {
            icon: Activity,
            title: "Inteligencia de Amenazas",
            description: "Análisis proactivo de amenazas emergentes y tendencias de ciberseguridad.",
            features: ["Threat hunting", "Análisis de tendencias", "Inteligencia OSINT", "Alertas tempranas"]
        }
    ];

    const stats = [
        { icon: Users, label: "Clientes Protegidos", value: "500+" },
        { icon: Shield, label: "Amenazas Bloqueadas", value: "1M+" },
        { icon: Clock, label: "Tiempo de Respuesta", value: "<15min" },
        { icon: Award, label: "Certificaciones", value: "ISO 27001" }
    ];

    const benefits = [
        "Protección continua 24/7 contra amenazas cibernéticas",
        "Reducción del tiempo de respuesta ante incidentes de seguridad",
        "Cumplimiento de normativas y estándares de seguridad",
        "Visibilidad completa de la postura de seguridad organizacional",
        "Equipo especializado de analistas de seguridad",
        "Reportes detallados y métricas de seguridad en tiempo real"
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-blue-900 text-white">
            {/* Hero Section */}
            <section className="relative py-32 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-cyan-600/20" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-block mb-6 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full">
                            <span className="text-blue-400 text-sm font-semibold">SEGURIDAD EMPRESARIAL</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                            Ciberseguridad
                        </h1>

                        <p className="text-2xl text-gray-300 mb-4 font-light">
                            Protección integral para tu infraestructura digital
                        </p>

                        <p className="text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed">
                            Servicios especializados de seguridad informática con monitoreo 24/7, respuesta a incidentes
                            y análisis de vulnerabilidades para mantener tu organización protegida contra las amenazas más avanzadas.
                        </p>

                        <div className="flex flex-wrap gap-4 justify-center mt-8">
                            <Link href="/cybersecurity">
                                <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-xl font-semibold transition-all hover:scale-105 shadow-lg shadow-blue-500/50">
                                    Explorar Soluciones
                                </button>
                            </Link>
                            <Link href="/contacto">
                                <button className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-semibold transition-all">
                                    Contactar Ventas
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-black/40 border-y border-white/10">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
                        {stats.map((stat, idx) => {
                            const Icon = stat.icon;
                            return (
                                <div key={idx} className="text-center">
                                    <Icon className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                                    <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                                    <div className="text-sm text-gray-400">{stat.label}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* What is Cybersecurity */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-4xl font-bold text-white mb-6 text-center">
                            ¿Qué es la Ciberseguridad?
                        </h2>
                        <div className="prose prose-invert max-w-none">
                            <p className="text-lg text-gray-300 leading-relaxed mb-6">
                                La <strong className="text-blue-400">ciberseguridad</strong> es la práctica de proteger sistemas, redes y programas
                                de ataques digitales. Estos ataques cibernéticos generalmente tienen como objetivo acceder, cambiar o destruir
                                información confidencial, extorsionar dinero a los usuarios o interrumpir los procesos comerciales normales.
                            </p>
                            <p className="text-lg text-gray-300 leading-relaxed mb-6">
                                En el mundo digital actual, la ciberseguridad es fundamental para proteger la información sensible de tu organización,
                                mantener la continuidad del negocio y preservar la confianza de tus clientes. Las amenazas evolucionan constantemente,
                                por lo que es crucial contar con un equipo especializado y herramientas avanzadas.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Grid */}
            <section className="py-20 bg-black/20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-white mb-4">Nuestros Servicios</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Soluciones integrales de ciberseguridad diseñadas para proteger tu organización
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {services.map((service, idx) => {
                            const Icon = service.icon;
                            return (
                                <div
                                    key={idx}
                                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all hover:shadow-xl hover:shadow-cyan-500/10 group"
                                >
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="p-3 bg-blue-500/10 rounded-xl group-hover:bg-blue-500/20 transition-colors">
                                            <Icon className="w-8 h-8 text-cyan-400" />
                                        </div>
                                        <h3 className="text-xl font-bold text-white">{service.title}</h3>
                                    </div>
                                    <p className="text-gray-400 mb-4 leading-relaxed">{service.description}</p>
                                    <ul className="space-y-2">
                                        {service.features.map((feature, fidx) => (
                                            <li key={fidx} className="flex items-center gap-2 text-sm text-gray-500">
                                                <ChevronRight className="w-4 h-4 text-blue-400" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Benefits */}
            <section className="py-20">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-white mb-4">Beneficios de Nuestros Servicios</h2>
                        <p className="text-gray-400">
                            Por qué elegir nuestras soluciones de ciberseguridad
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {benefits.map((benefit, idx) => (
                            <div key={idx} className="flex items-start gap-3 p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all">
                                <ChevronRight className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                                <span className="text-gray-300">{benefit}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border-y border-white/10">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-4xl font-bold text-white mb-4">
                        ¿Listo para proteger tu organización?
                    </h2>
                    <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                        Contacta con nuestro equipo de expertos para una evaluación personalizada de tus necesidades de ciberseguridad
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <Link href="/cybersecurity">
                            <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-xl font-semibold transition-all hover:scale-105 shadow-lg shadow-blue-500/50">
                                Ver Soluciones Disponibles
                            </button>
                        </Link>
                        <Link href="/contacto">
                            <button className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-semibold transition-all">
                                Solicitar Consultoría
                            </button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
