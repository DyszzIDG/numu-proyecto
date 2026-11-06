"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import { Activity, AlertTriangle, Search, Crosshair, ShieldAlert, Bug, Globe, FileText, Zap, Briefcase, Network, UserCheck, Code, Bot, ArrowLeft } from "lucide-react";
import CyberButton from "../../../components/ui/CyberButton";
import NeonCard from "../../../components/ui/NeonCard";

const serviceConfig: Record<string, { title: string; description: string; icon: React.ElementType; color: string }> = {
    monitoring: {
        title: "Monitoreo y Detección",
        description: "Dashboards en tiempo real y detección de anomalías. Visibilidad completa de tu infraestructura 24/7.",
        icon: Activity,
        color: "cyan"
    },
    // incidents handled by static route /dashboard/incidents if it exists, otherwise here.
    // forensics
    forensics: {
        title: "Forense Digital",
        description: "Laboratorio de análisis profundo y cadena de custodia. Investigación detallada de intrusiones y evidencias.",
        icon: Search,
        color: "magenta"
    },
    hunting: {
        title: "Threat Hunting",
        description: "Búsqueda proactiva de amenazas ocultas. Identificación de actores maliciosos antes de que ataquen.",
        icon: Crosshair,
        color: "cyan"
    },
    // vulnerabilities handled by static route /dashboard/vulnerabilities
    malware: {
        title: "Análisis de Malware",
        description: "Despiece seguro de código malicioso. Análisis estático y dinámico para entender el comportamiento de amenazas.",
        icon: Bug,
        color: "magenta"
    },
    osint: {
        title: "OSINT e Investigación",
        description: "Inteligencia de fuentes abiertas y reconocimiento. Recolección de datos públicos para perfilar amenazas.",
        icon: Globe,
        color: "cyan"
    },
    // reports -> dashboard/reportes matches static? No, link is reports. 
    reports: {
        title: "Reportes y Métricas",
        description: "KPIs del SOC y generación de informes. Visualización clara del estado de seguridad y cumplimiento.",
        icon: FileText,
        color: "green"
    },
    soar: {
        title: "Automatización SOAR",
        description: "Orquestación de seguridad y respuesta automatizada. Agiliza operaciones repetitivas y mejora tiempos de respuesta.",
        icon: Zap,
        color: "magenta"
    },
    risk: {
        title: "Seguridad Empresarial",
        description: "Gestión de riesgos corporativos y cumplimiento. Alineación con normas internacionales y políticas internas.",
        icon: Briefcase,
        color: "cyan"
    },
    infrastructure: { // Link was infrastructure
        title: "Infraestructura y Red",
        description: "Seguridad perimetral y topología. Protección robusta para tu red y activos críticos.",
        icon: Network,
        color: "green"
    },
    identity: {
        title: "Protección de Identidad",
        description: "IAM Security y detección de credenciales. Asegura el acceso y previene el robo de identidades.",
        icon: UserCheck,
        color: "magenta"
    },
    appsec: {
        title: "App Protection",
        description: "Seguridad en el ciclo de vida de desarrollo. DevSecOps y protección de aplicaciones web.",
        icon: Code,
        color: "cyan"
    },
    ai: {
        title: "IA y Automatización",
        description: "Next-gen security con modelos LLM. Potencia tu seguridad con inteligencia artificial avanzada.",
        icon: Bot,
        color: "green"
    }
};

export default function ServiceDashboard() {
    const params = useParams();
    const router = useRouter();
    const serviceId = params.serviceId as string;
    const config = serviceConfig[serviceId];

    if (!config) {
        return (
            <div className="min-h-screen bg-cyber-black text-white flex flex-col items-center justify-center">
                <h1 className="text-4xl font-bold mb-4">404 - Módulo no encontrado</h1>
                <p className="text-gray-400 mb-8">El módulo solicitado "{serviceId}" no existe o no está disponible.</p>
                <CyberButton onClick={() => router.push("/cybersecurity")}>
                    <ArrowLeft className="mr-2" /> Volver
                </CyberButton>
            </div>
        );
    }

    const Icon = config.icon;

    return (
        <div className="min-h-screen bg-cyber-black text-white p-8">
            <header className="mb-12 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg bg-${config.color}-500/10 border border-${config.color}-500/20`}>
                        <Icon className={`w-8 h-8 text-${config.color}-400`} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">{config.title}</h1>
                        <p className="text-gray-400 text-sm">{config.description}</p>
                    </div>
                </div>
                <CyberButton variant="outline" onClick={() => router.push("/cybersecurity")}>
                    <ArrowLeft className="w-4 h-4 mr-2" /> Volver
                </CyberButton>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Placeholder Cards for the Dashboard */}
                <NeonCard className="h-64 flex items-center justify-center p-6 border-dashed border-2 border-white/10 bg-transparent">
                    <div className="text-center text-gray-500">
                        <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <h3 className="text-xl font-bold mb-2">Panel Principal</h3>
                        <p>Visualización de datos en tiempo real (En Desarrollo)</p>
                    </div>
                </NeonCard>
                <NeonCard className="h-64 flex items-center justify-center p-6 border-dashed border-2 border-white/10 bg-transparent">
                    <div className="text-center text-gray-500">
                        <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <h3 className="text-xl font-bold mb-2">Reportes Recientes</h3>
                        <p>No hay datos disponibles para mostrar.</p>
                    </div>
                </NeonCard>
                <NeonCard className="h-64 flex items-center justify-center p-6 border-dashed border-2 border-white/10 bg-transparent">
                    <div className="text-center text-gray-500">
                        <Zap className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <h3 className="text-xl font-bold mb-2">Acciones Rápidas</h3>
                        <p>Configuración de herramientas y escaneos.</p>
                    </div>
                </NeonCard>
            </div>
        </div>
    );
}
