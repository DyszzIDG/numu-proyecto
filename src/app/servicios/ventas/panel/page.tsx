'use client';

import ServicePanel from '@/components/services/ServicePanel';
import { Users, TrendingUp, Target, Phone, Mail, DollarSign } from 'lucide-react';

export default function VentasPanelPage() {
    const stats = [
        { label: 'Leads Activos', value: '45', icon: Users, color: 'blue' },
        { label: 'Oportunidades', value: '23', icon: Target, color: 'purple' },
        { label: 'Ventas del Mes', value: '$32,500', icon: DollarSign, color: 'green' },
        { label: 'Tasa de Conversión', value: '34%', icon: TrendingUp, color: 'yellow' },
    ];

    const pipeline = [
        { stage: 'Prospección', count: 15, value: '$45,000' },
        { stage: 'Calificación', count: 12, value: '$38,000' },
        { stage: 'Propuesta', count: 8, value: '$28,000' },
        { stage: 'Negociación', count: 5, value: '$22,000' },
        { stage: 'Cierre', count: 3, value: '$15,000' },
    ];

    const recentLeads = [
        { name: 'Empresa Tech Solutions', contact: 'Juan Pérez', email: 'juan@techsol.com', phone: '+506 8888-9999', status: 'hot', value: '$12,000' },
        { name: 'Banco Nacional', contact: 'María García', email: 'maria@bn.com', phone: '+506 7777-8888', status: 'warm', value: '$25,000' },
        { name: 'Universidad Central', contact: 'Carlos López', email: 'carlos@uc.edu', phone: '+506 6666-7777', status: 'cold', value: '$8,000' },
    ];

    const activities = [
        { time: '10:30', type: 'call', description: 'Llamada con Tech Solutions - Propuesta enviada' },
        { time: '09:15', type: 'email', description: 'Email de seguimiento a Banco Nacional' },
        { time: '08:45', type: 'meeting', description: 'Reunión con Universidad Central - Demo programada' },
    ];

    return (
        <ServicePanel
            title="Panel de Ventas"
            breadcrumbs={[
                { label: 'Servicios', href: '/dashboard' },
                { label: 'Ventas', href: '/servicios/ventas' }
            ]}
            headerActions={
                <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors">
                    + Nuevo Lead
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
                                <p className="text-gray-400 text-sm">{stat.label}</p>
                            </div>
                        );
                    })}
                </div>

                {/* Sales Pipeline */}
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                    <h2 className="text-2xl font-bold text-white mb-6">Pipeline de Ventas</h2>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        {pipeline.map((stage, index) => (
                            <div
                                key={index}
                                className="p-4 bg-black/30 rounded-lg border border-white/10"
                            >
                                <h3 className="text-white font-semibold mb-3">{stage.stage}</h3>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-400 text-sm">Oportunidades:</span>
                                        <span className="text-white font-semibold">{stage.count}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-400 text-sm">Valor:</span>
                                        <span className="text-green-400 font-semibold">{stage.value}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Leads */}
                    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                        <h2 className="text-2xl font-bold text-white mb-6">Leads Recientes</h2>
                        <div className="space-y-4">
                            {recentLeads.map((lead, index) => (
                                <div
                                    key={index}
                                    className="p-4 bg-black/30 rounded-lg border border-white/10"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h3 className="text-white font-semibold mb-1">{lead.name}</h3>
                                            <p className="text-gray-400 text-sm">{lead.contact}</p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${lead.status === 'hot' ? 'bg-red-500/20 text-red-300' :
                                            lead.status === 'warm' ? 'bg-yellow-500/20 text-yellow-300' :
                                                'bg-blue-500/20 text-blue-300'
                                            }`}>
                                            {lead.status === 'hot' ? 'Caliente' : lead.status === 'warm' ? 'Tibio' : 'Frío'}
                                        </span>
                                    </div>
                                    <div className="space-y-2 mb-3">
                                        <div className="flex items-center gap-2 text-sm">
                                            <Mail className="w-4 h-4 text-gray-400" />
                                            <span className="text-gray-300">{lead.email}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <Phone className="w-4 h-4 text-gray-400" />
                                            <span className="text-gray-300">{lead.phone}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between pt-3 border-t border-white/10">
                                        <span className="text-gray-400 text-sm">Valor estimado:</span>
                                        <span className="text-green-400 font-semibold">{lead.value}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Activities */}
                    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                        <h2 className="text-2xl font-bold text-white mb-6">Actividad Reciente</h2>
                        <div className="space-y-4">
                            {activities.map((activity, index) => (
                                <div
                                    key={index}
                                    className="flex items-start gap-4 p-4 bg-black/30 rounded-lg border border-white/10"
                                >
                                    <span className="text-gray-400 text-sm w-16">{activity.time}</span>
                                    <div className={`w-2 h-2 rounded-full mt-2 ${activity.type === 'call' ? 'bg-green-400' :
                                        activity.type === 'email' ? 'bg-blue-400' : 'bg-purple-400'
                                        }`}></div>
                                    <p className="text-white flex-1">{activity.description}</p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                            <h3 className="text-orange-300 font-semibold mb-2">Tareas Pendientes</h3>
                            <ul className="space-y-2 text-sm text-gray-300">
                                <li>• Enviar propuesta a Tech Solutions</li>
                                <li>• Llamar a Banco Nacional para seguimiento</li>
                                <li>• Preparar demo para Universidad Central</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </ServicePanel>
    );
}
