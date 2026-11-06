"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Settings,
    CreditCard,
    LifeBuoy,
    FileText,
    LogOut,
    Building2
} from "lucide-react";
import clsx from "clsx";
import { signOut } from "next-auth/react";

const navItems = [
    { name: "Dashboard", href: "/client", icon: LayoutDashboard },
    { name: "Mis Servicios", href: "/client/services", icon: Building2 },
    { name: "Facturación", href: "/client/billing", icon: CreditCard },
    { name: "Soporte", href: "/client/support", icon: LifeBuoy },
    { name: "Reportes", href: "/client/reports", icon: FileText },
    { name: "Configuración", href: "/client/settings", icon: Settings },
];

export function ClientSidebar() {
    const pathname = usePathname();

    return (
        <div className="fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-gray-900 to-black border-r border-white/10 flex flex-col">
            {/* Logo */}
            <div className="px-6 py-6 border-b border-white/10">
                <Link href="/client">
                    <img
                        src="/logos/logotipo-NUMUGROUP (4).png"
                        alt="NUMU"
                        className="h-8 w-auto opacity-90 hover:opacity-100 transition-opacity"
                    />
                </Link>
                <p className="text-xs text-gray-500 mt-2">Portal de Cliente</p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-3 py-6 space-y-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={clsx(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group text-sm font-medium",
                                isActive
                                    ? "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-white border border-blue-500/30 shadow-lg shadow-blue-500/10"
                                    : "text-gray-400 hover:text-white hover:bg-white/5"
                            )}
                        >
                            <Icon className={clsx("w-5 h-5 transition-colors", isActive ? "text-blue-400" : "text-gray-500 group-hover:text-white")} />
                            <span>{item.name}</span>
                            {isActive && (
                                <div className="ml-auto w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* User Info & Logout */}
            <div className="p-4 border-t border-white/10 space-y-3">
                <div className="px-3 py-2 rounded-lg bg-white/5">
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Empresa</p>
                    <p className="text-sm font-semibold text-white mt-1">Acme Corporation</p>
                </div>
                <button
                    onClick={() => signOut({ callbackUrl: '/client/login' })}
                    className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors text-sm font-medium"
                >
                    <LogOut className="w-5 h-5" />
                    <span>Cerrar Sesión</span>
                </button>
            </div>
        </div>
    );
}
