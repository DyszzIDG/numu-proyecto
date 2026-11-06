"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, LucideIcon } from "lucide-react";
import CyberButton from "@/components/ui/CyberButton";

interface CSIRTModuleLayoutProps {
    title: string;
    description: string;
    icon: LucideIcon;
    iconColor?: string; // e.g. "text-cyan-400"
    backLink?: string;
    children: React.ReactNode;
}

export default function CSIRTModuleLayout({
    title,
    description,
    icon: Icon,
    iconColor = "text-cyan-400",
    backLink = "/dashboard",
    children
}: CSIRTModuleLayoutProps) {
    return (
        <div className="space-y-8 animate-in fade-in duration-500 p-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
                <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl bg-white/5 border border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.3)]`}>
                        <Icon className={`w-8 h-8 ${iconColor}`} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight uppercase">
                            {title}
                        </h1>
                        <p className="text-sm text-gray-400 mt-1">
                            {description}
                        </p>
                    </div>
                </div>

                <Link href={backLink}>
                    <CyberButton variant="outline" className="text-xs">
                        <ArrowLeft className="w-4 h-4 mr-2" /> VOLVER
                    </CyberButton>
                </Link>
            </div>

            {/* Content */}
            <div className="relative">
                {children}
            </div>
        </div>
    );
}
