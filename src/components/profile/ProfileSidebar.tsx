"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Shield, GraduationCap, Cpu, CreditCard, Settings, LogOut, ArrowLeft } from "lucide-react";
import clsx from "clsx";
import { motion } from "framer-motion";
import { signOut } from "next-auth/react";

const services = [
    { name: "General", href: "/profile", icon: User, color: "text-blue-400", glow: "shadow-[0_0_15px_rgba(59,130,246,0.3)]" },
    { name: "Ciberseguridad", href: "/profile/cybersecurity", icon: Shield, color: "text-cyan-400", glow: "shadow-[0_0_15px_rgba(6,182,212,0.3)]" },
    { name: "AKADEMY", href: "/profile/education", icon: GraduationCap, color: "text-purple-400", glow: "shadow-[0_0_15px_rgba(168,85,247,0.3)]" },
    { name: "Inteligencia Artificial", href: "/profile/ai", icon: Cpu, color: "text-emerald-400", glow: "shadow-[0_0_15px_rgba(16,185,129,0.3)]" },
    { name: "Financiero", href: "/profile/fintech", icon: CreditCard, color: "text-yellow-400", glow: "shadow-[0_0_15px_rgba(234,179,8,0.3)]" },
    { name: "Configuración", href: "/profile/settings", icon: Settings, color: "text-gray-400", glow: "shadow-none" },
];

export function ProfileSidebar() {
    const pathname = usePathname();

    return (
        <div className="w-72 h-full bg-black/40 backdrop-blur-xl border-r border-white/10 p-6 flex flex-col relative overflow-hidden">
            {/* Decorative background glow */}
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-blue-900/20 to-transparent pointer-events-none" />

            <div className="mb-10 px-2 relative z-10">
                <h2 className="text-2xl font-bold text-white tracking-wider flex items-center gap-2">
                    MI <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">PERFIL</span>
                </h2>
                <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest pl-0.5">Gestión Unificada</p>
            </div>

            <nav className="space-y-3 flex-1">
                {services.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <Link key={item.href} href={item.href} className="block relative group">
                            <div className={clsx(
                                "flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 relative z-10",
                                isActive
                                    ? `bg-white/5 border border-white/10 ${item.color} ${item.glow}`
                                    : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
                            )}>
                                <Icon className={clsx("w-5 h-5 transition-transform group-hover:scale-110", isActive ? item.color : "")} />
                                <span className="font-medium tracking-wide text-sm">{item.name}</span>

                                {isActive && (
                                    <motion.div
                                        layoutId="active-pill"
                                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-transparent via-current to-transparent opacity-80 rounded-r-full"
                                    />
                                )}
                            </div>
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-auto pt-6 border-t border-white/10 space-y-2">
                <Link
                    href="/dashboard"
                    className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors group"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-medium text-sm">Volver al Dashboard</span>
                </Link>

                <button
                    onClick={() => signOut({ callbackUrl: '/auth/login' })}
                    className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-400/80 hover:text-red-400 hover:bg-red-500/10 transition-colors group"
                >
                    <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-medium text-sm">Cerrar Sesión</span>
                </button>
            </div>
        </div>
    );
}
