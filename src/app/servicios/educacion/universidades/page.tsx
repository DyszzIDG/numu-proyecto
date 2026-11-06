'use client';

import ServicePanel from '@/components/services/ServicePanel';
import {
    GraduationCap, Users, BookOpen, Award, TrendingUp,
    Building2, Calendar, FileText, Video, CheckCircle
} from 'lucide-react';

export default function UniversidadesPanelPage() {
    const stats = [
        { label: 'Universidades Asociadas', value: '8', icon: Building2, color: 'purple', trend: '+2 nuevas' },
        { label: 'Estudiantes Activos', value: '455', icon: Users, color: 'blue', trend: '+67 este semestre' },
        { label: 'Programas Conjuntos', value: '15', icon: BookOpen, color: 'green', trend: '+3 nuevos' },
        { label: 'Certificaciones', value: '89', icon: Award, color: 'yellow', trend: '+15 este mes' },
    ];

    const universities = [
        {
            id: '1',
            name: 'Universidad de Costa Rica (UCR)',
            students: 145,
            programs: 5,
            completion: 88,
            logo: '🎓',
            contact: 'Dr. José Ramírez',
            email: 'jose.ramirez@ucr.ac.cr'
        },
        {
            id: '2',
            name: 'Instituto Tecnológico de Costa Rica (TEC)',
            students: 123,
            programs: 4,
            completion: 92,
            logo: '🏛️',
            contact: 'Ing. María Solís',
            email: 'maria.solis@tec.ac.cr'
        },
        {
            id: '3',
            name: 'Universidad Nacional (UNA)',
            students: 98,
            programs: 3,
            completion: 85,
            logo: '📚',
            contact: 'Lic. Carlos Mora',
            email: 'carlos.mora@una.ac.cr'
        },
        {
            id: '4',
            name: 'Universidad Latina',
            students: 89,
            programs: 3,
            completion: 79,
            logo: '🎯',
            contact: 'MSc. Ana Torres',
            email: 'ana.torres@ulatina.ac.cr'
        },
    ];

    const programs = [
        {
            title: 'Especialización en Ciberseguridad',
            university: 'UCR',
            students: 45,
            duration: '1 año',
            level: 'Posgrado',
            nextIntake: '2026-02-01'
        },
        {
            title: 'Diplomado en Ethical Hacking',
            university: 'TEC',
            students: 38,
            duration: '6 meses',
            level: 'Diplomado',
            nextIntake: '2026-01-20'
        },
        {
            title: 'Maestría en Seguridad Informática',
            university: 'UNA',
            students: 32,
            duration: '2 años',
            level: 'Maestría',
            nextIntake: '2026-03-01'
        },
        {
            title: 'Certificación en Análisis Forense',
            university: 'U. Latina',
            students: 28,
            duration: '4 meses',
            level: 'Certificación',
            nextIntake: '2026-01-15'
        },
    ];

    const upcomingEvents = [
        { date: '2026-01-15', type: 'Inicio', event: 'Certificación en Análisis Forense - U. Latina', participants: 28 },
        { date: '2026-01-20', type: 'Inicio', event: 'Diplomado en Ethical Hacking - TEC', participants: 38 },
        { date: '2026-01-25', type: 'Webinar', event: 'Tendencias en Ciberseguridad 2026', participants: 150 },
        { date: '2026-02-01', type: 'Inicio', event: 'Especialización en Ciberseguridad - UCR', participants: 45 },
    ];

    return (
        <ServicePanel
            title="Panel de Universidades"
            breadcrumbs={[
                { label: 'Servicios', href: '/dashboard' },
                { label: 'Educación', href: '/servicios/educacion' },
                { label: 'Universidades', href: '/servicios/educacion/universidades' }
            ]}
            headerActions={
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors">
                        + Nueva Universidad
                    </button>
                    <button className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors">
                        + Nuevo Convenio
                    </button>
                </div>
            }
        >
            <div className="space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={index}
                                className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <Icon className={`w-8 h-8 text-${stat.color}-400`} />
                                    <span className={`text-3xl font-bold text-${stat.color}-400`}>
                                        {stat.value}
                                    </span>
                                </div>
                                <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                                <p className="text-green-400 text-xs">{stat.trend}</p>
                            </div>
                        );
                    })}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Universities */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                            <h2 className="text-2xl font-bold text-white mb-6">Universidades Asociadas</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {universities.map((university) => (
                                    <div
                                        key={university.id}
                                        className="p-5 bg-black/30 rounded-lg border border-white/10 hover:bg-white/5 transition-all"
                                    >
                                        <div className="flex items-start gap-3 mb-4">
                                            <span className="text-4xl">{university.logo}</span>
                                            <div className="flex-1">
                                                <h3 className="text-white font-semibold mb-1">{university.name}</h3>
                                                <p className="text-gray-400 text-sm mb-1">{university.contact}</p>
                                                <p className="text-gray-500 text-xs">{university.email}</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3 mb-3">
                                            <div className="p-2 bg-white/5 rounded">
                                                <p className="text-gray-400 text-xs">Estudiantes</p>
                                                <p className="text-white font-semibold">{university.students}</p>
                                            </div>
                                            <div className="p-2 bg-white/5 rounded">
                                                <p className="text-gray-400 text-xs">Programas</p>
                                                <p className="text-white font-semibold">{university.programs}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-gray-400 text-sm">Tasa de Completitud</span>
                                            <span className="text-green-400 font-semibold">{university.completion}%</span>
                                        </div>
                                        <div className="w-full bg-gray-700 rounded-full h-2">
                                            <div
                                                className="bg-purple-500 h-2 rounded-full transition-all"
                                                style={{ width: `${university.completion}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Programs */}
                        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                            <h2 className="text-2xl font-bold text-white mb-6">Programas Conjuntos</h2>
                            <div className="space-y-3">
                                {programs.map((program, index) => (
                                    <div
                                        key={index}
                                        className="p-4 bg-black/30 rounded-lg border border-white/10"
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex-1">
                                                <h3 className="text-white font-semibold mb-1">{program.title}</h3>
                                                <p className="text-gray-400 text-sm mb-2">{program.university}</p>
                                                <div className="flex items-center gap-4 text-xs text-gray-400">
                                                    <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded">
                                                        {program.level}
                                                    </span>
                                                    <span>{program.students} estudiantes</span>
                                                    <span>• {program.duration}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-400 pt-2 border-t border-white/10">
                                            <Calendar className="w-4 h-4" />
                                            Próximo inicio: {program.nextIntake}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Upcoming Events */}
                        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                            <h3 className="text-xl font-bold text-white mb-4">Próximos Eventos</h3>
                            <div className="space-y-3">
                                {upcomingEvents.map((event, index) => (
                                    <div
                                        key={index}
                                        className="p-4 bg-black/30 rounded-lg border border-white/10"
                                    >
                                        <div className="flex items-center gap-2 mb-2">
                                            <Calendar className="w-4 h-4 text-purple-400" />
                                            <span className="text-purple-400 text-sm font-semibold">
                                                {event.date}
                                            </span>
                                        </div>
                                        <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs mb-2 inline-block">
                                            {event.type}
                                        </span>
                                        <h4 className="text-white font-semibold mb-1 text-sm">{event.event}</h4>
                                        <p className="text-gray-400 text-xs">{event.participants} participantes</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                            <h3 className="text-xl font-bold text-white mb-4">Acciones Rápidas</h3>
                            <div className="space-y-2">
                                <button className="w-full p-3 bg-black/30 hover:bg-white/10 border border-white/10 rounded-lg text-left text-white transition-colors flex items-center gap-3">
                                    <FileText className="w-5 h-5 text-blue-400" />
                                    <span>Convenios Activos</span>
                                </button>
                                <button className="w-full p-3 bg-black/30 hover:bg-white/10 border border-white/10 rounded-lg text-left text-white transition-colors flex items-center gap-3">
                                    <Users className="w-5 h-5 text-green-400" />
                                    <span>Gestionar Estudiantes</span>
                                </button>
                                <button className="w-full p-3 bg-black/30 hover:bg-white/10 border border-white/10 rounded-lg text-left text-white transition-colors flex items-center gap-3">
                                    <Award className="w-5 h-5 text-yellow-400" />
                                    <span>Emitir Certificados</span>
                                </button>
                                <button className="w-full p-3 bg-black/30 hover:bg-white/10 border border-white/10 rounded-lg text-left text-white transition-colors flex items-center gap-3">
                                    <Video className="w-5 h-5 text-purple-400" />
                                    <span>Recursos Compartidos</span>
                                </button>
                            </div>
                        </div>

                        {/* Performance Summary */}
                        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                            <h3 className="text-xl font-bold text-white mb-4">Resumen General</h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-400 text-sm">Tasa de Graduación</span>
                                    <span className="text-green-400 font-semibold">86%</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-400 text-sm">Satisfacción</span>
                                    <span className="text-yellow-400 font-semibold">4.7/5.0</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-400 text-sm">Empleabilidad</span>
                                    <span className="text-blue-400 font-semibold">92%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ServicePanel>
    );
}
