'use client';

import { ArrowLeft, Home } from 'lucide-react';
import Link from 'next/link';
import { ReactNode } from 'react';

interface ServicePanelProps {
    title: string;
    breadcrumbs: { label: string; href: string }[];
    children: ReactNode;
    headerActions?: ReactNode;
}

export default function ServicePanel({
    title,
    breadcrumbs,
    children,
    headerActions
}: ServicePanelProps) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            {/* Header */}
            <div className="bg-white/5 backdrop-blur-lg border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    {/* Breadcrumbs */}
                    <div className="flex items-center gap-2 text-sm mb-3">
                        <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">
                            <Home className="w-4 h-4" />
                        </Link>
                        {breadcrumbs.map((crumb, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <span className="text-gray-600">/</span>
                                <Link
                                    href={crumb.href}
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    {crumb.label}
                                </Link>
                            </div>
                        ))}
                    </div>

                    {/* Title and Actions */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link
                                href="/dashboard"
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </Link>
                            <h1 className="text-3xl font-bold text-white">
                                {title}
                            </h1>
                        </div>
                        {headerActions && (
                            <div className="flex items-center gap-3">
                                {headerActions}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                {children}
            </div>
        </div>
    );
}
