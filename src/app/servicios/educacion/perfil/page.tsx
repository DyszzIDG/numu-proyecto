'use client';

import ServicePanel from '@/components/services/ServicePanel';
import { User, Award, BookOpen, Trophy, Shield, Clock, Calendar, Badge, Download, ExternalLink, Mail, Phone, MapPin } from 'lucide-react';
import Image from 'next/image';

export default function AkademyProfilePage() {

    const studentInfo = {
        name: "Iván Usuario",
        role: "Estudiante Avanzado",
        id: "AKD-2024-8892",
        email: "ivan@akademy.edu",
        joinedDate: "Marzo 2024",
        level: "Nivel 4 - Especialista",
        avatar: "/avatars/user-avatar.png" // Placeholder, will fallback if not found
    };

    const achievements = [
        { title: "Defensor Activo", icon: Shield, color: "text-blue-400", bg: "bg-blue-500/10" },
        { title: "Top 100 CTF", icon: Trophy, color: "text-yellow-400", bg: "bg-yellow-500/10" },
        { title: "10 Cursos Completados", icon: BookOpen, color: "text-purple-400", bg: "bg-purple-500/10" },
        { title: "Certificado CEH", icon: Award, color: "text-green-400", bg: "bg-green-500/10" },
    ];

    const certificates = [
        {
            id: "CERT-001",
            title: "Fundamentos de Ciberseguridad",
            date: "15 Ene 2025",
            score: "98%",
            url: "#"
        },
        {
            id: "CERT-002",
            title: "Ethical Hacking: Enumeración",
            date: "10 Dic 2024",
            score: "100%",
            url: "#"
        },
        {
            id: "CERT-003",
            title: "Seguridad en Redes Corporativas",
            date: "25 Nov 2024",
            score: "95%",
            url: "#"
        },
    ];

    return (
        <ServicePanel
            title="Mi Perfil Akademy"
            breadcrumbs={[
                { label: 'Servicios', href: '/dashboard' },
                { label: 'Educación', href: '/servicios/educacion' },
                { label: 'Panel', href: '/servicios/educacion/panel' },
                { label: 'Perfil', href: '/servicios/educacion/perfil' }
            ]}
        >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: ID Card style */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-blue-600 to-cyan-600 opacity-20" />

                        <div className="relative z-10">
                            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full p-1 mb-4 shadow-xl shadow-blue-900/40">
                                <div className="w-full h-full bg-gray-900 rounded-full flex items-center justify-center overflow-hidden">
                                    <User className="w-16 h-16 text-gray-400" />
                                </div>
                            </div>

                            <h2 className="text-2xl font-bold text-white mb-1">{studentInfo.name}</h2>
                            <p className="text-cyan-400 font-medium mb-4">{studentInfo.role}</p>

                            <div className="bg-white/5 rounded-xl p-4 text-left space-y-3">
                                <div className="flex justify-between border-b border-white/5 pb-2">
                                    <span className="text-gray-400 text-sm">ID Estudiante</span>
                                    <span className="text-white text-sm font-mono">{studentInfo.id}</span>
                                </div>
                                <div className="flex justify-between border-b border-white/5 pb-2">
                                    <span className="text-gray-400 text-sm">Email</span>
                                    <span className="text-white text-sm truncate max-w-[150px]">{studentInfo.email}</span>
                                </div>
                                <div className="flex justify-between border-b border-white/5 pb-2">
                                    <span className="text-gray-400 text-sm">Miembro desde</span>
                                    <span className="text-white text-sm">{studentInfo.joinedDate}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400 text-sm">Nivel</span>
                                    <span className="text-green-400 text-sm font-bold">{studentInfo.level}</span>
                                </div>
                            </div>

                            <button className="w-full mt-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-gray-300 transition-colors flex items-center justify-center gap-2">
                                <Badge className="w-4 h-4" />
                                Generar Credencial
                            </button>
                        </div>
                    </div>

                    <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <Trophy className="w-5 h-5 text-yellow-500" />
                            Logros Destacados
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            {achievements.map((achievement, idx) => {
                                const Icon = achievement.icon;
                                return (
                                    <div key={idx} className={`p-3 rounded-xl border border-white/5 ${achievement.bg} flex flex-col items-center text-center gap-2`}>
                                        <Icon className={`w-8 h-8 ${achievement.color}`} />
                                        <span className="text-xs font-semibold text-gray-300 leading-tight">{achievement.title}</span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>

                {/* Right Column: Progress & Certs */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Progress Stats */}
                    <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                        <h3 className="text-xl font-bold text-white mb-6">Estadísticas de Aprendizaje</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <p className="text-gray-400 text-sm">Horas de Estudio</p>
                                <p className="text-3xl font-bold text-white font-mono">124h</p>
                                <div className="w-full bg-white/10 h-1.5 rounded-full">
                                    <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '70%' }}></div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <p className="text-gray-400 text-sm">Puntaje Promedio</p>
                                <p className="text-3xl font-bold text-white font-mono">94/100</p>
                                <div className="w-full bg-white/10 h-1.5 rounded-full">
                                    <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '94%' }}></div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <p className="text-gray-400 text-sm">Tareas Enviadas</p>
                                <p className="text-3xl font-bold text-white font-mono">45</p>
                                <div className="w-full bg-white/10 h-1.5 rounded-full">
                                    <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: '85%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Certifications Table */}
                    <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <Award className="w-6 h-6 text-purple-400" />
                                Certificaciones Obtenidas
                            </h3>
                            <button className="text-xs text-cyan-400 hover:text-cyan-300">Ver todas</button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-white/10 text-gray-500 text-sm">
                                        <th className="pb-3 pl-2 font-medium">Nombre de Certificación</th>
                                        <th className="pb-3 font-medium">Fecha</th>
                                        <th className="pb-3 font-medium">Puntaje</th>
                                        <th className="pb-3 pr-2 font-medium text-right">Acción</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {certificates.map((cert, idx) => (
                                        <tr key={idx} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                                            <td className="py-4 pl-2 text-white font-medium flex items-center gap-3">
                                                <div className="p-2 bg-purple-500/10 rounded-lg">
                                                    <Award className="w-4 h-4 text-purple-400" />
                                                </div>
                                                {cert.title}
                                            </td>
                                            <td className="py-4 text-gray-400">{cert.date}</td>
                                            <td className="py-4 text-green-400 font-bold">{cert.score}</td>
                                            <td className="py-4 pr-2 text-right">
                                                <button className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 ml-auto text-xs font-bold border border-cyan-500/20 px-3 py-1.5 rounded-lg hover:bg-cyan-500/10 transition-all">
                                                    <Download className="w-3 h-3" /> PDF
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </ServicePanel>
    );
}
