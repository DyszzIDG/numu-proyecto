'use client';

import { useState, useEffect } from 'react';
import ServicePanel from '@/components/services/ServicePanel';
import { BookOpen, Trophy, Users, TrendingUp, Award, Calendar, ChevronRight, PlayCircle, Clock, Target, CheckCircle2, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function EducacionPanelPage() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [dashboardData, setDashboardData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setInterval(() => setCurrentDate(new Date()), 60000);
        fetchDashboardData();
        return () => clearInterval(timer);
    }, []);

    const fetchDashboardData = async () => {
        try {
            const res = await fetch('/api/lms/dashboard');
            if (res.ok) {
                const data = await res.json();
                setDashboardData(data);
            }
        } catch (error) {
            console.error("Failed to fetch dashboard data", error);
        } finally {
            setLoading(false);
        }
    };

    // Helper to format dates dynamically
    const getRelativeDate = (daysOffset: number) => {
        const date = new Date();
        date.setDate(date.getDate() + daysOffset);
        return {
            day: date.getDate().toString(),
            month: date.toLocaleString('es-ES', { month: 'short' }).toUpperCase().replace('.', ''),
            full: date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })
        };
    };

    const stats = [
        { label: 'Estudiantes Activos', value: dashboardData?.stats?.students || '...', icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
        { label: 'Cursos Disponibles', value: dashboardData?.stats?.courses || '...', icon: BookOpen, color: 'text-purple-400', bg: 'bg-purple-500/10' },
        { label: 'Certificaciones', value: dashboardData?.stats?.certifications || '0', icon: Award, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
        { label: 'Tasa de Completitud', value: `${dashboardData?.stats?.completion || 0}%`, icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-500/10' },
    ];

    const getPlatformStats = (slug: string) => {
        if (!dashboardData?.platforms) return null;
        const p = dashboardData.platforms[slug];
        if (!p) return null;
        return slug === 'moodle' ? `${p.courses} Cursos Activos` :
            slug === 'ctf' ? '45 Desafíos Disponibles' : // Dedicated CTF stat hardcoded for now or fetch from CTF specific
                `${p.students} Alumnos Inscritos`;
    };

    const platforms = [
        {
            id: 'moodle',
            slug: 'moodle', // Generic key
            name: 'Plataforma Moodle',
            description: 'Acceso centralizado a cursos corporativos y material didáctico.',
            icon: BookOpen,
            color: 'from-blue-500 to-cyan-500',
            link: '/servicios/educacion/moodle',
            stats: dashboardData?.stats?.courses ? `${dashboardData.stats.courses} Cursos Activos` : 'Cargando...'
        },
        {
            id: 'ctf',
            slug: 'ctf',
            name: 'Arena CTF',
            description: 'Entorno de simulación de ciberataques y defensa en tiempo real.',
            icon: Trophy,
            color: 'from-red-500 to-orange-500',
            link: '/servicios/educacion/ctf',
            stats: '45 Desafíos Disponibles'
        },
        {
            id: 'ministerio',
            slug: 'ministerio-panama',
            name: 'Ministerio Seguridad',
            description: 'Capacitación exclusiva para personal gubernamental.',
            icon: Users,
            color: 'from-green-500 to-emerald-500',
            link: '/servicios/educacion/moodle/ministerio-panama',
            stats: getPlatformStats('ministerio-panama') || 'Acceso Restringido'
        },
        {
            id: 'universidad',
            slug: 'universidad',
            name: 'Universidad',
            description: 'Programas de maestría y especialización técnica.',
            icon: Award,
            color: 'from-purple-500 to-pink-500',
            link: '/servicios/educacion/moodle/universidad',
            stats: getPlatformStats('universidad') || 'Inscripciones Abiertas'
        },
    ];

    const upcomingEvents = [
        { ...getRelativeDate(2), title: 'Competencia CTF Nacional', type: 'Evento', color: 'text-orange-400', time: '14:00 - 18:00' },
        { ...getRelativeDate(5), title: 'Webinar: Seguridad en IoT', type: 'Webinar', color: 'text-blue-400', time: '10:00 - 11:30' },
        { ...getRelativeDate(12), title: 'Examen de Certificación CEH', type: 'Examen', color: 'text-red-400', time: '09:00 - 13:00' },
    ];

    if (loading && !dashboardData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-blue-900 text-white p-8 flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
            </div>
        );
    }

    return (
        <ServicePanel
            title="Panel de Control AKADEMY"
            breadcrumbs={[
                { label: 'Servicios', href: '/dashboard' },
                { label: 'Educación', href: '/servicios/educacion' },
                { label: 'Panel', href: '/servicios/educacion/panel' }
            ]}
            headerActions={
                <Link href="/servicios/educacion/perfil">
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 rounded-lg text-white text-sm font-bold transition-all shadow-lg shadow-blue-900/20 hover:shadow-blue-500/30 hover:scale-105 active:scale-95">
                        <Users className="w-4 h-4" />
                        Mi Perfil Akademy
                    </button>
                </Link>
            }
        >
            <div className="space-y-8">

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <div key={index} className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex items-center gap-4 hover:border-white/20 transition-all group hover:bg-white/5">
                                <div className={`p-4 rounded-xl ${stat.bg} group-hover:scale-110 transition-transform`}>
                                    <Icon className={`w-6 h-6 ${stat.color}`} />
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
                                    <h4 className="text-2xl font-bold text-white mt-1 font-mono">{stat.value}</h4>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Main Platforms Grid */}
                <div>
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                        <Target className="w-6 h-6 text-cyan-400" />
                        Plataformas de Aprendizaje
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {platforms.map((platform) => {
                            const Icon = platform.icon;
                            return (
                                <Link key={platform.id} href={platform.link} className="group h-full block">
                                    <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 h-full hover:bg-white/5 hover:border-cyan-500/30 transition-all relative overflow-hidden group-hover:shadow-2xl group-hover:shadow-cyan-900/10">
                                        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${platform.color} opacity-5 blur-3xl rounded-full -mr-10 -mt-10 group-hover:opacity-15 transition-opacity`} />

                                        <div className="relative z-10 flex flex-col h-full">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${platform.color} p-3 group-hover:scale-110 transition-transform shadow-lg`}>
                                                    <Icon className="w-full h-full text-white" />
                                                </div>
                                                <div className="p-2 rounded-lg bg-white/5 border border-white/5 group-hover:bg-white/10 transition-colors">
                                                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-white" />
                                                </div>
                                            </div>

                                            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">{platform.name}</h3>
                                            <p className="text-sm text-gray-400 mb-6 flex-grow">{platform.description}</p>

                                            <div className="flex items-center gap-2 pt-4 border-t border-white/10">
                                                <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${platform.color}`} />
                                                <span className="text-xs font-semibold text-gray-300 font-mono tracking-wide">{platform.stats}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Active Courses (Dynamic) */}
                    <div className="lg:col-span-2 space-y-6">
                        <h2 className="text-xl font-bold text-white flex items-center gap-3">
                            <PlayCircle className="w-6 h-6 text-green-400" />
                            Continuar Aprendiendo
                        </h2>

                        {dashboardData?.activeCourses?.length > 0 ? (
                            <div className="space-y-4">
                                {dashboardData.activeCourses.map((course: any, idx: number) => (
                                    <div key={idx} className="bg-black/40 border border-white/10 rounded-2xl p-6 hover:bg-white/5 hover:border-white/20 transition-all flex flex-col md:flex-row gap-6 items-center group">
                                        {/* Progress Circle (could be added visual) - keeping layout clean */}
                                        <div className="flex-1 w-full">
                                            <div className="flex justify-between items-start mb-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="px-2 py-1 rounded bg-blue-500/20 text-blue-300 text-[10px] font-bold uppercase tracking-wider border border-blue-500/20">
                                                        En Curso
                                                    </span>
                                                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">{course.title}</h3>
                                                </div>
                                                <span className="text-xs text-gray-500 flex items-center gap-1 bg-white/5 px-2 py-1 rounded">
                                                    <Clock className="w-3 h-3" /> {course.lastAccess}
                                                </span>
                                            </div>

                                            <p className="text-sm text-gray-400 mb-4 flex items-center gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                                                {course.module}
                                            </p>

                                            <div className="space-y-2">
                                                <div className="flex justify-between text-xs font-medium">
                                                    <span className="text-gray-400">Progreso General ({course.completedModules}/{course.totalModules} Módulos)</span>
                                                    <span className="text-white font-mono">{course.progress}%</span>
                                                </div>
                                                <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden border border-white/5">
                                                    <div
                                                        className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all duration-1000 ease-out relative group-hover:shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                                                        style={{ width: `${course.progress}%` }}
                                                    />
                                                </div>
                                                <p className="text-xs text-gray-500 mt-2">
                                                    Siguiente lección: <span className="text-gray-300">{course.nextLesson}</span>
                                                </p>
                                            </div>
                                        </div>

                                        <div className="w-full md:w-auto flex flex-col gap-2">
                                            <Link href={`/servicios/educacion/moodle/course/${course.id}`}>
                                                <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 rounded-xl text-white text-sm font-bold whitespace-nowrap transition-all shadow-lg shadow-cyan-900/20 hover:shadow-cyan-500/20 hover:scale-105 active:scale-95 w-full md:w-auto">
                                                    Reanudar
                                                </button>
                                            </Link>
                                            <button className="px-8 py-2 bg-transparent hover:bg-white/5 text-gray-400 hover:text-white text-xs font-medium rounded-lg transition-colors w-full md:w-auto">
                                                Ver Temario
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center p-8 bg-black/20 rounded-xl border border-white/5">
                                <BookOpen className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                                <h3 className="text-gray-300 font-bold">No tienes cursos activos</h3>
                                <p className="text-gray-500 text-sm mt-1">Explora Moodle para inscribirte en nuevos programas.</p>
                                <Link href="/servicios/educacion/moodle" className="mt-4 inline-block px-6 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-cyan-400">
                                    Explorar Cursos
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Upcoming Calendar (Static for now, can be dynamic later) */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-white flex items-center gap-3">
                                <Calendar className="w-5 h-5 text-purple-400" />
                                Agenda
                            </h2>
                            <button className="text-xs text-cyan-400 hover:text-cyan-300 font-medium px-3 py-1 bg-cyan-500/10 rounded-full border border-cyan-500/20 transition-all hover:bg-cyan-500/20">
                                Ver calendario completo
                            </button>
                        </div>

                        <div className="bg-black/40 border border-white/10 rounded-2xl p-4 space-y-1">
                            {upcomingEvents.map((event, index) => (
                                <div key={index} className="p-4 hover:bg-white/5 rounded-xl transition-all group cursor-pointer border border-transparent hover:border-white/5">
                                    <div className="flex gap-4">
                                        <div className="flex flex-col items-center justify-center bg-white/5 px-4 py-2 rounded-xl min-w-[4rem] border border-white/5 group-hover:border-white/20 transition-colors">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{event.month}</span>
                                            <span className="text-2xl font-bold text-white font-mono">{event.day}</span>
                                        </div>
                                        <div className="flex-1 py-1">
                                            <div className="flex justify-between items-start">
                                                <h4 className="text-white font-bold text-sm line-clamp-2 mb-1 group-hover:text-cyan-400 transition-colors">
                                                    {event.title}
                                                </h4>
                                            </div>
                                            <p className={`text-xs ${event.color} font-bold mb-1 px-2 py-0.5 bg-white/5 rounded w-fit`}>
                                                {event.type}
                                            </p>
                                            <p className="text-xs text-gray-500 flex items-center gap-1 mt-2">
                                                <Clock className="w-3 h-3" /> {event.time}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </ServicePanel>
    );
}
