"use client";

import { Download, CreditCard, CheckCircle, Clock, AlertCircle } from "lucide-react";

export default function ClientBillingPage() {
    const invoices = [
        { id: "INV-2025-003", date: "2025-01-15", amount: 10500, status: "paid", dueDate: "2025-01-30", paidDate: "2025-01-20" },
        { id: "INV-2025-002", date: "2024-12-15", amount: 10500, status: "paid", dueDate: "2024-12-30", paidDate: "2024-12-28" },
        { id: "INV-2025-001", date: "2024-11-15", amount: 10500, status: "paid", dueDate: "2024-11-30", paidDate: "2024-11-25" },
        { id: "INV-2024-012", date: "2024-10-15", amount: 8500, status: "paid", dueDate: "2024-10-30", paidDate: "2024-10-29" },
    ];

    const paymentMethod = {
        type: "Transferencia Bancaria",
        bank: "Banco Nacional",
        account: "****1234"
    };

    const getStatusBadge = (status: string) => {
        const styles = {
            paid: { bg: "bg-green-500/20", text: "text-green-400", border: "border-green-500/30", icon: CheckCircle },
            pending: { bg: "bg-yellow-500/20", text: "text-yellow-400", border: "border-yellow-500/30", icon: Clock },
            overdue: { bg: "bg-red-500/20", text: "text-red-400", border: "border-red-500/30", icon: AlertCircle }
        };
        const labels = { paid: "Pagado", pending: "Pendiente", overdue: "Vencido" };
        const style = styles[status as keyof typeof styles];
        const Icon = style.icon;

        return (
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 ${style.bg} ${style.text} ${style.border}`}>
                <Icon className="w-3 h-3" />
                {labels[status as keyof typeof labels]}
            </span>
        );
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-bold text-white mb-2">Facturación</h1>
                <p className="text-gray-400">Gestiona tus facturas y métodos de pago</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 rounded-xl bg-green-500/20">
                            <CheckCircle className="w-6 h-6 text-green-400" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Total Pagado</p>
                            <p className="text-2xl font-bold text-white">${invoices.filter(i => i.status === 'paid').reduce((acc, i) => acc + i.amount, 0).toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 rounded-xl bg-blue-500/20">
                            <CreditCard className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Próximo Pago</p>
                            <p className="text-2xl font-bold text-white">$10,500</p>
                        </div>
                    </div>
                    <p className="text-xs text-gray-500">Vence: 15 Feb 2025</p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <p className="text-sm text-gray-400 mb-2">Método de Pago</p>
                    <p className="text-lg font-bold text-white">{paymentMethod.type}</p>
                    <p className="text-xs text-gray-500 mt-1">{paymentMethod.bank} • {paymentMethod.account}</p>
                    <button className="mt-4 text-xs text-blue-400 hover:text-blue-300 transition-colors">Cambiar método →</button>
                </div>
            </div>

            {/* Invoices Table */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-white/10">
                    <h2 className="text-xl font-bold text-white">Historial de Facturas</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-white/5">
                            <tr className="text-left text-xs text-gray-400 uppercase tracking-wider">
                                <th className="px-6 py-4">Número</th>
                                <th className="px-6 py-4">Fecha</th>
                                <th className="px-6 py-4">Monto</th>
                                <th className="px-6 py-4">Vencimiento</th>
                                <th className="px-6 py-4">Estado</th>
                                <th className="px-6 py-4">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {invoices.map((invoice) => (
                                <tr key={invoice.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <span className="font-mono text-sm text-white font-semibold">{invoice.id}</span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-300">
                                        {new Date(invoice.date).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-lg font-bold text-white">${invoice.amount.toLocaleString()}</span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-300">
                                        {new Date(invoice.dueDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        {getStatusBadge(invoice.status)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <button className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-sm font-medium text-blue-400 hover:text-blue-300 transition-all">
                                            <Download className="w-4 h-4" />
                                            PDF
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
