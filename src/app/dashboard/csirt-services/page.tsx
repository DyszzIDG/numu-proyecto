'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    Shield, Search, Lock, Globe,
    Wifi, Database, FileCode, Terminal,
    AlertTriangle, Server, Eye, Crosshair
} from 'lucide-react';
import Link from 'next/link';

export default function CSIRTServicesPage() {
    const services = [
        {
            category: "Escaneo y Reconocimiento",
            tools: [
                { name: "Nmap Vulnerability Scan", icon: Wifi, description: "Escaneo de puertos y detección de versiones.", href: "/dashboard/tools/nmap", status: "Active" },
                { name: "Nikto Web Scanner", icon: Globe, description: "Escáner de vulnerabilidades web (XSS, SQLi).", href: "/dashboard/tools/nikto", status: "Active" },
                { name: "Shodan Intelligence", icon: Search, description: "Búsqueda de dispositivos expuestos en Internet.", href: "/dashboard/tools/shodan", status: "Integrated" }
            ]
        },
        {
            category: "Análisis y Forense",
            tools: [
                { name: "Malware Sandbox", icon: FileCode, description: "Análisis seguro de archivos sospechosos.", href: "/dashboard/tools/sandbox", status: "Beta" },
                { name: "Log Analyzer (SIEM)", icon: Database, description: "Correlación de eventos de seguridad.", href: "/dashboard/csirt-overview", status: "Active" },
                { name: "Forensic Timeline", icon: Clock, description: "Reconstrucción cronológica de incidentes.", href: "#", status: "Manual" }
            ]
        },
        {
            category: "Defensa Activa",
            tools: [
                { name: "Firewall Manager", icon: Shield, description: "Gestión de reglas y bloqueo de IPs.", href: "#", status: "Active" },
                { name: "Threat Hunting", icon: Crosshair, description: "Búsqueda proactiva de amenazas.", href: "/dashboard/csirt-advanced", status: "Active" },
                { name: "Vulnerability Patching", icon: Lock, description: "Gestión de parches y actualizaciones.", href: "/dashboard/vulnerabilities", status: "Scheduled" }
            ]
        }
    ];

    return (
        <div className="p-6 space-y-8 bg-slate-50 min-h-screen text-slate-900">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Servicios y Herramientas CSIRT</h1>
                <p className="text-slate-500 mt-2">Catálogo de capacidades operativas y herramientas de seguridad disponibles.</p>
            </div>

            {services.map((section, idx) => (
                <div key={idx} className="space-y-4">
                    <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800">
                        <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                        {section.category}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {section.tools.map((tool, tIdx) => (
                            <Link key={tIdx} href={tool.href} className="group block">
                                <Card className="h-full border-slate-200 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer bg-white group-hover:-translate-y-1">
                                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                                        <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-blue-50 text-slate-600 group-hover:text-blue-600 transition-colors">
                                            <tool.icon className="w-5 h-5" />
                                        </div>
                                        <span className={`text-xs px-2 py-1 rounded-full border font-medium
                                            ${tool.status === 'Active' ? 'bg-green-50 text-green-600 border-green-200' :
                                                tool.status === 'Beta' ? 'bg-purple-50 text-purple-600 border-purple-200' :
                                                    'bg-slate-50 text-slate-500 border-slate-200'}`}>
                                            {tool.status}
                                        </span>
                                    </CardHeader>
                                    <CardContent>
                                        <CardTitle className="text-lg font-bold text-slate-800 group-hover:text-blue-700 transition-colors mb-2">
                                            {tool.name}
                                        </CardTitle>
                                        <CardDescription className="text-slate-500">
                                            {tool.description}
                                        </CardDescription>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

// Importing Clock specifically since it was used but missed in top import
import { Clock } from 'lucide-react';
