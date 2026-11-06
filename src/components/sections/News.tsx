"use client";
import React from "react";
import NeonCard from "../ui/NeonCard";
import CyberButton from "../ui/CyberButton";
import { Calendar, ArrowRight } from "lucide-react";

const newsItems = [
    {
        title: "NUMU Group en Cyber Security Bank & Government 2025",
        date: "01-12-2025",
        location: "República Dominicana",
        category: "EVENTO",
        excerpt: "Participación destacada en el evento líder de seguridad bancaria y gubernamental."
    },
    {
        title: "CyberWeek@LAC4 2025",
        date: "28-11-2025",
        location: "República Dominicana",
        category: "CONFERENCIA",
        excerpt: "Debatiendo el futuro de la ciberseguridad en Latinoamérica y el Caribe."
    },
    {
        title: "Ciberseguridad como Herramienta de Progreso Socioeconómico",
        date: "15-11-2025",
        location: "Punta Cana",
        category: "IMPACTO SOCIAL",
        excerpt: "Iniciativa para jóvenes de comunidades vulnerables mediante capacitación técnica."
    },
    {
        title: "Invitado de honor en el TIC DAY 2025",
        date: "10-11-2025",
        location: "República Dominicana",
        category: "RECONOCIMIENTO",
        excerpt: "NUMU Group reconocido por su aporte a la transformación digital regional."
    }
];

const News: React.FC = () => {
    return (
        <section id="news" className="py-24 bg-cyber-dark relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-mono font-bold text-white mb-2">
                            <span className="text-cyber-accent">/</span> ULTIMAS NOTICIAS
                        </h2>
                        <p className="text-gray-400">Actualidad y eventos de NUMU Group.</p>
                    </div>
                    <div className="mt-4 md:mt-0">
                        <CyberButton variant="outline" className="text-xs">
                            Ver todas las publicaciones
                        </CyberButton>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {newsItems.map((item, index) => (
                        <NeonCard key={index} glowColor={index % 2 === 0 ? "cyan" : "magenta"} className="group cursor-pointer">
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-xs font-mono text-cyber-primary px-2 py-1 border border-cyber-primary/30 rounded bg-cyber-primary/10">
                                    {item.category}
                                </span>
                                <span className="flex items-center text-xs text-gray-500 font-mono">
                                    <Calendar size={12} className="mr-2" />
                                    {item.date}
                                </span>
                            </div>

                            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyber-primary transition-colors">
                                {item.title}
                            </h3>

                            <p className="text-sm text-gray-400 mb-6">
                                {item.excerpt}
                            </p>

                            <div className="flex items-center text-cyber-secondary text-sm font-mono opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                                LEER MÁS <ArrowRight size={16} className="ml-2" />
                            </div>
                        </NeonCard>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default News;
