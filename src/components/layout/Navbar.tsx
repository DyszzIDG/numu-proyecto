"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import clsx from "clsx";
import { Menu, X, User } from "lucide-react";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const { data: session, status } = useSession();

    const navLinks = [
        { name: "Inicio", href: "/" },
        { name: "Acerca de", href: "#about" },
        { name: "Servicios", href: "#services" },
        { name: "Noticias", href: "#news" },
        { name: "Contacto", href: "#contact" },
    ];

    return (
        <nav className="fixed top-6 left-0 right-0 z-50 mx-auto max-w-7xl px-4">
            <div className="rounded-2xl border border-white/10 bg-black/50 backdrop-blur-xl transition-all duration-300">
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex-shrink-0 cursor-pointer">
                            <Link href="/">
                                <img
                                    src="/logos/logo-NUMUGROUP-blanco (2) (1) - copia.png"
                                    alt="NUMU GROUP"
                                    className="h-10 w-auto opacity-90 hover:opacity-100 transition-opacity"
                                />
                            </Link>
                        </div>

                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-8">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        className={clsx(
                                            "relative text-sm font-medium tracking-wide transition-colors duration-300 hover:text-white",
                                            pathname === link.href ? "text-white" : "text-gray-400"
                                        )}
                                    >
                                        {link.name}
                                        {pathname === link.href && (
                                            <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-cyber-primary shadow-[0_0_10px_#6366f1]" />
                                        )}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className="hidden md:flex items-center gap-3">
                            <Link href="/cybersecurity">
                                <button className="group relative overflow-hidden rounded-lg border border-white/10 px-6 py-2 transition-all hover:border-cyber-primary/50 hover:bg-cyber-primary/10">
                                    <span className="relative z-10 text-xs font-medium uppercase tracking-wider text-white group-hover:text-cyber-primary">
                                        Portal Cliente
                                    </span>
                                </button>
                            </Link>

                            {status === "loading" ? (
                                <div className="px-6 py-2">
                                    <div className="w-20 h-4 bg-white/10 rounded animate-pulse" />
                                </div>
                            ) : session ? (
                                <Link href="/profile">
                                    <button className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 px-6 py-2 transition-all hover:from-blue-600 hover:to-cyan-600 hover:scale-105">
                                        <span className="relative z-10 text-xs font-medium uppercase tracking-wider text-white flex items-center gap-2">
                                            <User className="w-4 h-4" />
                                            Mi Perfil
                                        </span>
                                    </button>
                                </Link>
                            ) : (
                                <Link href="/auth/login">
                                    <button className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-2 transition-all hover:from-purple-600 hover:to-pink-600 hover:scale-105">
                                        <span className="relative z-10 text-xs font-medium uppercase tracking-wider text-white">
                                            Login / Registro
                                        </span>
                                    </button>
                                </Link>
                            )}
                        </div>

                        <div className="md:hidden">
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="text-gray-400 hover:text-white focus:outline-none"
                            >
                                {isOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile menu */}
                {isOpen && (
                    <div className="md:hidden border-t border-white/10 bg-black/90 backdrop-blur-xl rounded-b-2xl">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-white/5"
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <Link
                                href="/cybersecurity"
                                onClick={() => setIsOpen(false)}
                                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-white/5"
                            >
                                Portal Cliente
                            </Link>
                            {session ? (
                                <Link
                                    href="/profile"
                                    onClick={() => setIsOpen(false)}
                                    className="block px-3 py-2 rounded-md text-base font-medium text-blue-400 hover:text-blue-300 hover:bg-white/5"
                                >
                                    Mi Perfil
                                </Link>
                            ) : (
                                <Link
                                    href="/auth/login"
                                    onClick={() => setIsOpen(false)}
                                    className="block px-3 py-2 rounded-md text-base font-medium text-purple-400 hover:text-purple-300 hover:bg-white/5"
                                >
                                    Login / Registro
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
