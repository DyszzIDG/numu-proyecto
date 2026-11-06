'use client';

import ServicePanel from '@/components/services/ServicePanel';
import {
    Shield, Users, BookOpen, Award, TrendingUp,
    Clock, FileText, Video, Calendar, CheckCircle
} from 'lucide-react';

export default function MinisterioSeguridadPanelPage() {
    const stats = [
        { label: 'Funcionarios Activos', value: '89', icon: Users, color: 'blue', trend: '+12 este mes' },
        { label: 'Programas Especializados', value: '6', icon: Shield, color: 'red', trend: '2 nuevos' },
        { label: 'Certificaciones Emitidas', value: '45', icon: Award, color: 'yellow', trend: '+8 esta semana' },
        { label: 'Tasa de Aprobación', value: '94%', icon: TrendingUp, color: 'green', trend: '+3%' },
    ];

    const programs = [
        {
            id: '1',
            title: 'Ciberseguridad para Fuerzas del Orden',
            department: 'Policía Nacional',
            enrolled: 34,
            duration: '12 semanas',
            progress: 65,
            instructor: 'Cmdte. Roberto Vargas',
            nextSession: '2026-01-12 09:00'
        },
        {
            id: '2',
            title: 'Análisis Forense Digital',
            department: 'OIJ',
            enrolled: 28,
            duration: '10 semanas',
            progress: 80,
            instructor: 'Lic. Patricia Mora',
            nextSession: '2026-01-10 14:00'
        },
        {
            id: '3',
            title: 'Seguridad en Infraestructuras Críticas',
            department: 'Seguridad Pública',
            enrolled: 27,
            duration: '8 semanas',
            progress: 45,
            instructor: 'Ing. Carlos Jiménez',
            nextSession: '2026-01-11 10:00'
        },
    ];

    const departments = [
        { name: 'Policía Nacional', students: 34, courses: 3, completion: 85 },
        { name: 'OIJ', students: 28, courses: 2, completion: 92 },
        { name: 'Seguridad Pública', students: 27, courses: 2, completion: 78 },
    ];

    const upcomingSessions = [
        { date: '2026-01-10', time: '14:00', course: 'Análisis Forense Digital', topic: 'Recuperación de Datos', instructor: 'Lic. Patricia Mora' },
        { date: '2026-01-11', time: '10:00', course: 'Seguridad en Infraestructuras Críticas', topic: 'Protección de Sistemas SCADA', instructor: 'Ing. Carlos Jiménez' },
        { date: '2026-01-12', time: '09:00', course: 'Ciberseguridad para Fuerzas del Orden', topic: 'Investigación de Delitos Cibernéticos', instructor: 'Cmdte. Roberto Vargas' },
    ];

    return (
        <ServicePanel
            title="Panel Ministerio de Seguridad Pública"
            breadcrumbs={[
                { label: 'Servicios', href: '/dashboard' },
                { label: 'Educación', href: '/servicios/educacion' },
                { label: 'Ministerio Seguridad', href: '/servicios/educacion/ministerio-seguridad' }
            ]}
            headerActions={
                <button className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors">
                    + Nuevo Programa
                </button>
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
                    {/* Programs */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                            <h2 className="text-2xl font-bold text-white mb-6">Programas Especializados</h2>
                            <div className="space-y-4">
                                {programs.map((program) => (
                                    <div
                                        key={program.id}
                                        className="p-5 bg-black/30 rounded-lg border border-white/10"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex-1">
                                                <h3 className="text-lg font-semibold text-white mb-1">{program.title}</h3>
                                                <p className="text-gray-400 text-sm mb-2">{program.instructor}</p>
                                                <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                                                    <span className="flex items-center gap-1">
                                                        <Shield className="w-4 h-4" />
                                                        {program.department}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Users className="w-4 h-4" />
                                                        {program.enrolled} funcionarios
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-4 h-4" />
                                                        {program.duration}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Progress */}
                                        <div className="mb-3">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-gray-400 text-sm">Progreso</span>
                                                <span className="text-white font-semibold text-sm">{program.progress}%</span>
                                            </div>
                                            <div className="w-full bg-gray-700 rounded-full h-2">
                                                <div
                                                    className="bg-red-500 h-2 rounded-full transition-all"
                                                    style={{ width: `${program.progress}%` }}
                                                ></div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-3 border-t border-white/10">
                                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                                <Calendar className="w-4 h-4" />
                                                Próxima sesión: {program.nextSession}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Departments Performance */}
                        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                            <h2 className="text-2xl font-bold text-white mb-6">Rendimiento por Departamento</h2>
                            <div className="space-y-4">
                                {departments.map((dept, index) => (
                                    <div
                                        key={index}
                                        className="p-4 bg-black/30 rounded-lg border border-white/10"
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <h3 className="text-white font-semibold">{dept.name}</h3>
                                            <span className="text-green-400 font-semibold">{dept.completion}%</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <p className="text-gray-400">Estudiantes</p>
                                                <p className="text-white font-semibold">{dept.students}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-400">Cursos</p>
                                                <p className="text-white font-semibold">{dept.courses}</p>
                                            </div>
                                        </div>
                                        <div className="w-full bg-gray-700 rounded-full h-2 mt-3">
                                            <div
                                                className="bg-green-500 h-2 rounded-full transition-all"
                                                style={{ width: `${dept.completion}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Upcoming Sessions */}
                        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                            <h3 className="text-xl font-bold text-white mb-4">Próximas Sesiones</h3>
                            <div className="space-y-3">
                                {upcomingSessions.map((session, index) => (
                                    <div
                                        key={index}
                                        className="p-4 bg-black/30 rounded-lg border border-white/10"
                                    >
                                        <div className="flex items-center gap-2 mb-2">
                                            <Calendar className="w-4 h-4 text-red-400" />
                                            <span className="text-red-400 text-sm font-semibold">
                                                {session.date} - {session.time}
                                            </span>
                                        </div>
                                        <h4 className="text-white font-semibold mb-1 text-sm">{session.topic}</h4>
                                        <p className="text-gray-400 text-xs mb-1">{session.course}</p>
                                        <p className="text-gray-500 text-xs">{session.instructor}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Resources */}
                        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                            <h3 className="text-xl font-bold text-white mb-4">Recursos</h3>
                            <div className="space-y-2">
                                <button className="w-full p-3 bg-black/30 hover:bg-white/10 border border-white/10 rounded-lg text-left text-white transition-colors flex items-center gap-3">
                                    <FileText className="w-5 h-5 text-blue-400" />
                                    <span>Manuales de Procedimiento</span>
                                </button>
                                <button className="w-full p-3 bg-black/30 hover:bg-white/10 border border-white/10 rounded-lg text-left text-white transition-colors flex items-center gap-3">
                                    <Video className="w-5 h-5 text-purple-400" />
                                    <span>Videos de Capacitación</span>
                                </button>
                                <button className="w-full p-3 bg-black/30 hover:bg-white/10 border border-white/10 rounded-lg text-left text-white transition-colors flex items-center gap-3">
                                    <Shield className="w-5 h-5 text-red-400" />
                                    <span>Protocolos de Seguridad</span>
                                </button>
                                <button className="w-full p-3 bg-black/30 hover:bg-white/10 border border-white/10 rounded-lg text-left text-white transition-colors flex items-center gap-3">
                                    <Award className="w-5 h-5 text-yellow-400" />
                                    <span>Certificaciones</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ServicePanel>
    );
}
