'use client';

import { ArrowRight, CheckCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { ReactNode } from 'react';

interface Feature {
    icon: ReactNode;
    title: string;
    description: string;
}

interface ServiceLandingProps {
    title: string;
    subtitle: string;
    description: string;
    heroGradient: string; // e.g., "from-blue-600 to-cyan-600"
    features: Feature[];
    benefits: string[];
    useCases: { title: string; description: string }[];
    panelLink: string;
    panelButtonText?: string;
}

export default function ServiceLanding({
    title,
    subtitle,
    description,
    heroGradient,
    features,
    benefits,
    useCases,
    panelLink,
    panelButtonText = "Acceder al Panel"
}: ServiceLandingProps) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            {/* Hero Section */}
            <section className={`relative overflow-hidden bg-gradient-to-r ${heroGradient} py-20`}>
                <div className="absolute inset-0 bg-black/20"></div>

                {/* Back Button */}
                <div className="absolute top-6 left-6 z-20">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 rounded-lg text-white text-sm font-medium transition-all hover:scale-105"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Volver al Dashboard
                    </Link>
                </div>

                <div className="relative max-w-7xl mx-auto px-6 text-center">
                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 animate-fade-in">
                        {title}
                    </h1>
                    <p className="text-xl md:text-2xl text-white/90 mb-6">
                        {subtitle}
                    </p>
                    <p className="text-lg text-white/80 max-w-3xl mx-auto mb-8">
                        {description}
                    </p>
                    <Link
                        href={panelLink}
                        className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl"
                    >
                        {panelButtonText}
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-4xl font-bold text-white text-center mb-12">
                        Características Principales
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all transform hover:scale-105"
                            >
                                <div className="text-blue-400 mb-4">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-400">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-20 px-6 bg-black/30">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-4xl font-bold text-white text-center mb-12">
                        Beneficios
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        {benefits.map((benefit, index) => (
                            <div
                                key={index}
                                className="flex items-start gap-3 bg-white/5 backdrop-blur-lg border border-white/10 rounded-lg p-4"
                            >
                                <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                                <p className="text-gray-300">{benefit}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Use Cases Section */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-4xl font-bold text-white text-center mb-12">
                        Casos de Uso
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {useCases.map((useCase, index) => (
                            <div
                                key={index}
                                className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6"
                            >
                                <h3 className="text-xl font-semibold text-white mb-3">
                                    {useCase.title}
                                </h3>
                                <p className="text-gray-400">
                                    {useCase.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className={`py-20 px-6 bg-gradient-to-r ${heroGradient}`}>
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl font-bold text-white mb-6">
                        ¿Listo para comenzar?
                    </h2>
                    <p className="text-xl text-white/90 mb-8">
                        Accede al panel y comienza a utilizar nuestros servicios
                    </p>
                    <Link
                        href={panelLink}
                        className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl"
                    >
                        {panelButtonText}
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </section>
        </div>
    );
}
