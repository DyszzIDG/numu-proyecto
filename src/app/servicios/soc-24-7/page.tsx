'use client';

import { Shield, Clock, Globe, Users, CheckCircle, ArrowRight, Eye, Zap, Lock, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function SOC247GeneralPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-950/30 to-gray-900">
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-cyan-600/10" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

                <div className="relative max-w-7xl mx-auto px-8 py-24">
                    <div className="text-center space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full text-blue-400 text-sm font-medium">
                            <Clock className="w-4 h-4" />
                            <span>Protección Continua 24/7/365</span>
                        </div>

                        <h1 className="text-6xl font-bold text-white mb-6">
                            SOC 24/7
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mt-2">
                                Security Operations Center
                            </span>
                        </h1>

                        <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                            Centro de Operaciones de Seguridad de clase mundial que monitorea, detecta y responde
                            a amenazas cibernéticas las 24 horas del día, los 7 días de la semana.
                        </p>

                        <div className="flex items-center justify-center gap-4 pt-6">
                            <Link
                                href="/servicios/soc-24-7/panel"
                                className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-blue-500/50 flex items-center gap-2"
                            >
                                <Eye className="w-5 h-5" />
                                Acceder al Panel SOC
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                href="/contacto"
                                className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-semibold transition-all"
                            >
                                Solicitar Demo
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="max-w-7xl mx-auto px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <StatCard
                        icon={Clock}
                        value="24/7/365"
                        label="Monitoreo Continuo"
                        color="blue"
                    />
                    <StatCard
                        icon={Zap}
                        value="< 15 min"
                        label="Tiempo de Respuesta"
                        color="cyan"
                    />
                    <StatCard
                        icon={Shield}
                        value="99.9%"
                        label="Disponibilidad"
                        color="green"
                    />
                    <StatCard
                        icon={Users}
                        value="50+"
                        label="Analistas Certificados"
                        color="purple"
                    />
                </div>
            </section>

            {/* What is SOC Section */}
            <section className="max-w-7xl mx-auto px-8 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-4xl font-bold text-white mb-6">
                            ¿Qué es un SOC 24/7?
                        </h2>
                        <p className="text-gray-300 text-lg leading-relaxed mb-6">
                            Un Security Operations Center (SOC) es un equipo centralizado de profesionales de
                            ciberseguridad que monitorea, detecta, analiza y responde a incidentes de seguridad
                            utilizando una combinación de soluciones tecnológicas y un conjunto sólido de procesos.
                        </p>
                        <p className="text-gray-300 text-lg leading-relaxed">
                            Nuestro SOC opera las 24 horas del día, los 7 días de la semana, los 365 días del año,
                            proporcionando protección continua contra amenazas cibernéticas avanzadas.
                        </p>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
                        <h3 className="text-2xl font-bold text-white mb-6">Funciones Principales</h3>
                        <div className="space-y-4">
                            <FeatureItem text="Monitoreo continuo de eventos de seguridad" />
                            <FeatureItem text="Detección temprana de amenazas y anomalías" />
                            <FeatureItem text="Respuesta rápida a incidentes de seguridad" />
                            <FeatureItem text="Análisis forense y threat hunting" />
                            <FeatureItem text="Gestión de vulnerabilidades" />
                            <FeatureItem text="Reportes y cumplimiento normativo" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Capabilities Section */}
            <section className="max-w-7xl mx-auto px-8 py-16">
                <h2 className="text-4xl font-bold text-white text-center mb-12">
                    Capacidades del SOC
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <CapabilityCard
                        icon={Eye}
                        title="Monitoreo Continuo"
                        description="Vigilancia 24/7 de toda tu infraestructura con tecnología SIEM de última generación."
                        color="blue"
                    />
                    <CapabilityCard
                        icon={Zap}
                        title="Respuesta Rápida"
                        description="Tiempo de respuesta promedio menor a 15 minutos ante incidentes críticos."
                        color="yellow"
                    />
                    <CapabilityCard
                        icon={Shield}
                        title="Threat Hunting"
                        description="Búsqueda proactiva de amenazas ocultas en tu red antes de que causen daño."
                        color="red"
                    />
                    <CapabilityCard
                        icon={Lock}
                        title="Análisis Forense"
                        description="Investigación profunda de incidentes para determinar causa raíz y alcance."
                        color="purple"
                    />
                    <CapabilityCard
                        icon={TrendingUp}
                        title="Threat Intelligence"
                        description="Inteligencia de amenazas actualizada de fuentes globales en tiempo real."
                        color="cyan"
                    />
                    <CapabilityCard
                        icon={Globe}
                        title="Cobertura Global"
                        description="Protección multi-región con analistas distribuidos en diferentes zonas horarias."
                        color="green"
                    />
                </div>
            </section>

            {/* Technologies Section */}
            <section className="max-w-7xl mx-auto px-8 py-16">
                <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-2xl p-12">
                    <h2 className="text-4xl font-bold text-white text-center mb-12">
                        Tecnologías Utilizadas
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <TechBadge name="SIEM" description="Security Information and Event Management" />
                        <TechBadge name="IDS/IPS" description="Intrusion Detection/Prevention Systems" />
                        <TechBadge name="EDR" description="Endpoint Detection and Response" />
                        <TechBadge name="SOAR" description="Security Orchestration, Automation and Response" />
                        <TechBadge name="NDR" description="Network Detection and Response" />
                        <TechBadge name="TIP" description="Threat Intelligence Platform" />
                        <TechBadge name="UEBA" description="User and Entity Behavior Analytics" />
                        <TechBadge name="XDR" description="Extended Detection and Response" />
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="max-w-7xl mx-auto px-8 py-16">
                <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-12 text-center">
                    <h2 className="text-4xl font-bold text-white mb-4">
                        ¿Listo para proteger tu organización?
                    </h2>
                    <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                        Accede a nuestro panel SOC y comienza a monitorear tu infraestructura en tiempo real.
                    </p>
                    <Link
                        href="/servicios/soc-24-7/panel"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 hover:bg-gray-100 rounded-xl font-semibold transition-all shadow-lg"
                    >
                        <Eye className="w-5 h-5" />
                        Acceder al Panel SOC
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </section>
        </div>
    );
}

function StatCard({ icon: Icon, value, label, color }: any) {
    const colorClasses: Record<string, string> = {
        blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
        cyan: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
        green: "bg-green-500/10 text-green-400 border-green-500/20",
        purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    };

    return (
        <div className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all backdrop-blur-sm group">
            <div className={`inline-flex p-3 rounded-lg ${colorClasses[color]} mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className="w-6 h-6" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-2">{value}</h3>
            <p className="text-gray-400 text-sm">{label}</p>
        </div>
    );
}

function FeatureItem({ text }: { text: string }) {
    return (
        <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <span className="text-gray-300">{text}</span>
        </div>
    );
}

function CapabilityCard({ icon: Icon, title, description, color }: any) {
    const colorClasses: Record<string, string> = {
        blue: "bg-blue-500/10 text-blue-400 border-blue-500/30",
        yellow: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
        red: "bg-red-500/10 text-red-400 border-red-500/30",
        purple: "bg-purple-500/10 text-purple-400 border-purple-500/30",
        cyan: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
        green: "bg-green-500/10 text-green-400 border-green-500/30",
    };

    return (
        <div className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all backdrop-blur-sm group">
            <div className={`inline-flex p-3 rounded-lg ${colorClasses[color]} mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
            <p className="text-gray-400 text-sm">{description}</p>
        </div>
    );
}

function TechBadge({ name, description }: { name: string; description: string }) {
    return (
        <div className="text-center group cursor-pointer">
            <div className="p-4 bg-white/5 border border-white/10 rounded-xl mb-2 group-hover:border-blue-500/30 group-hover:bg-blue-500/5 transition-all">
                <h4 className="text-lg font-bold text-white">{name}</h4>
            </div>
            <p className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors">{description}</p>
        </div>
    );
}
