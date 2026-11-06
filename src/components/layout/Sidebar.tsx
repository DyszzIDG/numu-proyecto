"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
    LayoutDashboard,
    ShieldAlert,
    Bug,
    Server,
    FileText,
    LogOut,
    Wrench,
    Radar,
    Shield,
    Building2,
    UserCog,
    Sparkles,
    BarChart3,
    Briefcase,
    Layers
} from "lucide-react";
import clsx from "clsx";

interface NavItem {
    name: string;
    href: string;
    icon: any;
    roles?: string[];
}

interface NavSection {
    title?: string;
    items: NavItem[];
}

const navSections: NavSection[] = [
    {
        title: "GESTIÓN",
        items: [
            { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
            { name: "Incidentes", href: "/dashboard/incidents", icon: ShieldAlert },
            { name: "Vulnerabilidades", href: "/dashboard/vulnerabilities", icon: Bug },
        ]
    },
    {
        title: "ANÁLISIS",
        items: [
            { name: "Threat Hunting", href: "/dashboard/threat-hunting", icon: Radar },
            { name: "Forense Digital", href: "/dashboard/forensics", icon: FileText },
            { name: "Malware", href: "/dashboard/malware", icon: Shield },
        ]
    },
    {
        title: "OPERACIONES",
        items: [
            { name: "Monitoreo", href: "/dashboard/monitoring", icon: BarChart3 },
            { name: "SOAR", href: "/dashboard/soar", icon: Sparkles },
            { name: "Infraestructura", href: "/dashboard/infrastructure", icon: Server },
        ]
    },
    {
        title: "HERRAMIENTAS",
        items: [
            { name: "OSINT", href: "/dashboard/osint", icon: Wrench },
            { name: "Unified Scan", href: "/dashboard/unified-scan", icon: Sparkles },
            { name: "Reportes", href: "/dashboard/global-reports", icon: Layers },
        ]
    }
];

export function Sidebar() {
    const pathname = usePathname();
    const { data: session } = useSession();

    return (
        <div className="fixed left-0 top-0 h-screen w-64 bg-black/40 backdrop-blur-xl border-r border-white/10 flex flex-col">
            {/* Logo Header */}
            <div className="px-6 py-6 border-b border-white/10">
                <img
                    src="/logos/logotipo-NUMUGROUP (4).png"
                    alt="NUMU CSIRT"
                    className="h-8 w-auto opacity-90"
                />
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
                {navSections.map((section, idx) => {
                    return (
                        <div key={idx}>
                            {section.title && (
                                <div className="px-3 mb-2">
                                    <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">
                                        {section.title}
                                    </span>
                                </div>
                            )}
                            <div className="space-y-1">
                                {section.items.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = pathname === item.href;

                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={clsx(
                                                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 group text-sm",
                                                isActive
                                                    ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                                    : "text-gray-400 hover:text-white hover:bg-white/5"
                                            )}
                                        >
                                            <Icon className={clsx("w-4 h-4 transition-colors", isActive ? "text-blue-400" : "text-gray-500 group-hover:text-white")} />
                                            <span className="font-medium">{item.name}</span>
                                            {isActive && (
                                                <div className="ml-auto w-1 h-1 rounded-full bg-blue-400 shadow-[0_0_4px_rgba(96,165,250,0.8)]" />
                                            )}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-white/10 bg-black/20">
                <button
                    onClick={() => signOut({ callbackUrl: '/auth/login' })}
                    className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors text-sm"
                >
                    <LogOut className="w-4 h-4" />
                    <span className="font-medium">Cerrar Sesión</span>
                </button>
            </div>
        </div>
    );
}
