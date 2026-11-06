'use client';

import ServicePanel from '@/components/services/ServicePanel';
import { DollarSign, TrendingUp, TrendingDown, PieChart, Calendar, FileText } from 'lucide-react';

export default function FinanzasPanelPage() {
    const stats = [
        { label: 'Ingresos del Mes', value: '$45,230', change: '+12%', trend: 'up', icon: DollarSign },
        { label: 'Gastos del Mes', value: '$23,150', change: '-5%', trend: 'down', icon: TrendingDown },
        { label: 'Ganancia Neta', value: '$22,080', change: '+18%', trend: 'up', icon: TrendingUp },
        { label: 'Facturas Pendientes', value: '8', change: '-2', trend: 'down', icon: FileText },
    ];

    const recentTransactions = [
        { date: '2026-01-08', description: 'Pago Servicio Ciberseguridad - Empresa A', amount: '+$5,000', type: 'income' },
        { date: '2026-01-07', description: 'Licencias Software', amount: '-$1,200', type: 'expense' },
        { date: '2026-01-07', description: 'Suscripción Educación - Universidad B', amount: '+$3,500', type: 'income' },
        { date: '2026-01-06', description: 'Servicios Cloud', amount: '-$890', type: 'expense' },
        { date: '2026-01-06', description: 'Consultoría IA - Cliente C', amount: '+$8,000', type: 'income' },
    ];

    const serviceRevenue = [
        { service: 'Ciberseguridad', revenue: 18500, percentage: 41 },
        { service: 'Inteligencia Artificial', revenue: 12300, percentage: 27 },
        { service: 'Educación', revenue: 9200, percentage: 20 },
        { service: 'Ventas', revenue: 5230, percentage: 12 },
    ];

    return (
        <ServicePanel
            title="Panel de Finanzas"
            breadcrumbs={[
                { label: 'Servicios', href: '/dashboard' },
                { label: 'Finanzas', href: '/servicios/finanzas' }
            ]}
            headerActions={
                <button className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors">
                    + Nueva Factura
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
                                    <Icon className="w-8 h-8 text-emerald-400" />
                                    <span className={`text-sm font-semibold ${stat.trend === 'up' ? 'text-green-400' : 'text-red-400'
                                        }`}>
                                        {stat.change}
                                    </span>
                                </div>
                                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                                <p className="text-gray-400 text-sm">{stat.label}</p>
                            </div>
                        );
                    })}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Revenue by Service */}
                    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                        <h2 className="text-2xl font-bold text-white mb-6">Ingresos por Servicio</h2>
                        <div className="space-y-4">
                            {serviceRevenue.map((item, index) => (
                                <div key={index}>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-white font-semibold">{item.service}</span>
                                        <span className="text-emerald-400 font-semibold">${item.revenue.toLocaleString()}</span>
                                    </div>
                                    <div className="w-full bg-gray-700 rounded-full h-2">
                                        <div
                                            className="bg-emerald-500 h-2 rounded-full transition-all"
                                            style={{ width: `${item.percentage}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-gray-400 text-sm mt-1">{item.percentage}% del total</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Transactions */}
                    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                        <h2 className="text-2xl font-bold text-white mb-6">Transacciones Recientes</h2>
                        <div className="space-y-3">
                            {recentTransactions.map((transaction, index) => (
                                <div
                                    key={index}
                                    className="p-4 bg-black/30 rounded-lg border border-white/10"
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex-1">
                                            <p className="text-white font-semibold mb-1">{transaction.description}</p>
                                            <p className="text-gray-400 text-sm">{transaction.date}</p>
                                        </div>
                                        <span className={`font-bold ${transaction.type === 'income' ? 'text-green-400' : 'text-red-400'
                                            }`}>
                                            {transaction.amount}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Monthly Overview */}
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                    <h2 className="text-2xl font-bold text-white mb-6">Resumen Mensual</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-4 bg-black/30 rounded-lg border border-white/10">
                            <div className="flex items-center gap-3 mb-3">
                                <DollarSign className="w-6 h-6 text-green-400" />
                                <h3 className="text-white font-semibold">Total Ingresos</h3>
                            </div>
                            <p className="text-3xl font-bold text-green-400">$45,230</p>
                            <p className="text-gray-400 text-sm mt-2">Enero 2026</p>
                        </div>
                        <div className="p-4 bg-black/30 rounded-lg border border-white/10">
                            <div className="flex items-center gap-3 mb-3">
                                <TrendingDown className="w-6 h-6 text-red-400" />
                                <h3 className="text-white font-semibold">Total Gastos</h3>
                            </div>
                            <p className="text-3xl font-bold text-red-400">$23,150</p>
                            <p className="text-gray-400 text-sm mt-2">Enero 2026</p>
                        </div>
                        <div className="p-4 bg-black/30 rounded-lg border border-white/10">
                            <div className="flex items-center gap-3 mb-3">
                                <TrendingUp className="w-6 h-6 text-emerald-400" />
                                <h3 className="text-white font-semibold">Margen de Ganancia</h3>
                            </div>
                            <p className="text-3xl font-bold text-emerald-400">48.8%</p>
                            <p className="text-gray-400 text-sm mt-2">+5.2% vs mes anterior</p>
                        </div>
                    </div>
                </div>
            </div>
        </ServicePanel>
    );
}
