"use client";

import { Plus, MessageSquare, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { useState } from "react";

export default function ClientSupportPage() {
    const [showNewTicket, setShowNewTicket] = useState(false);

    const tickets = [
        { id: "TKT-1234", subject: "Error en dashboard de monitoreo", status: "open", priority: "high", created: "2025-01-20", lastUpdate: "Hace 2 horas", messages: 3 },
        { id: "TKT-1233", subject: "Solicitud de reporte mensual", status: "in_progress", priority: "medium", created: "2025-01-18", lastUpdate: "Hace 1 día", messages: 5 },
        { id: "TKT-1232", subject: "Consulta sobre facturación", status: "resolved", priority: "low", created: "2025-01-15", lastUpdate: "Hace 3 días", messages: 7 },
    ];

    const getStatusBadge = (status: string) => {
        const styles = {
            open: { bg: "bg-yellow-500/20", text: "text-yellow-400", border: "border-yellow-500/30", icon: Clock },
            in_progress: { bg: "bg-blue-500/20", text: "text-blue-400", border: "border-blue-500/30", icon: MessageSquare },
            resolved: { bg: "bg-green-500/20", text: "text-green-400", border: "border-green-500/30", icon: CheckCircle },
            closed: { bg: "bg-gray-500/20", text: "text-gray-400", border: "border-gray-500/30", icon: CheckCircle }
        };
        const labels = { open: "Abierto", in_progress: "En Progreso", resolved: "Resuelto", closed: "Cerrado" };
        const style = styles[status as keyof typeof styles];
        const Icon = style.icon;

        return (
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 ${style.bg} ${style.text} ${style.border}`}>
                <Icon className="w-3 h-3" />
                {labels[status as keyof typeof labels]}
            </span>
        );
    };

    const getPriorityBadge = (priority: string) => {
        const styles = {
            urgent: "bg-red-500/20 text-red-400 border-red-500/30",
            high: "bg-orange-500/20 text-orange-400 border-orange-500/30",
            medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
            low: "bg-gray-500/20 text-gray-400 border-gray-500/30"
        };
        const labels = { urgent: "Urgente", high: "Alta", medium: "Media", low: "Baja" };

        return (
            <span className={`px-2 py-1 rounded text-xs font-semibold border ${styles[priority as keyof typeof styles]}`}>
                {labels[priority as keyof typeof labels]}
            </span>
        );
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold text-white mb-2">Soporte Técnico</h1>
                    <p className="text-gray-400">Gestiona tus tickets y solicita ayuda</p>
                </div>
                <button
                    onClick={() => setShowNewTicket(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl font-semibold transition-all hover:scale-105 shadow-lg shadow-blue-500/20"
                >
                    <Plus className="w-5 h-5" />
                    Nuevo Ticket
                </button>
            </div>

            {/* New Ticket Form */}
            {showNewTicket && (
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                    <h2 className="text-xl font-bold text-white mb-6">Crear Nuevo Ticket</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Asunto</label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                placeholder="Describe brevemente tu problema"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Prioridad</label>
                            <select className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50">
                                <option value="low">Baja</option>
                                <option value="medium">Media</option>
                                <option value="high">Alta</option>
                                <option value="urgent">Urgente</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Descripción</label>
                            <textarea
                                rows={4}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                placeholder="Proporciona todos los detalles posibles..."
                            />
                        </div>
                        <div className="flex gap-3">
                            <button className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl font-semibold transition-all">
                                Enviar Ticket
                            </button>
                            <button
                                onClick={() => setShowNewTicket(false)}
                                className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-semibold transition-all"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Tickets List */}
            <div className="space-y-4">
                {tickets.map((ticket) => (
                    <div key={ticket.id} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all hover:shadow-xl hover:shadow-blue-500/10">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="font-mono text-sm text-gray-500">{ticket.id}</span>
                                    {getStatusBadge(ticket.status)}
                                    {getPriorityBadge(ticket.priority)}
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">{ticket.subject}</h3>
                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                    <span>Creado: {new Date(ticket.created).toLocaleDateString()}</span>
                                    <span>•</span>
                                    <span>Última actualización: {ticket.lastUpdate}</span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1">
                                        <MessageSquare className="w-3 h-3" />
                                        {ticket.messages} mensajes
                                    </span>
                                </div>
                            </div>
                            <button className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-sm font-medium text-blue-400 hover:text-blue-300 transition-all">
                                Ver Detalles
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* FAQ Section */}
            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-4">Preguntas Frecuentes</h2>
                <div className="space-y-3">
                    <details className="group">
                        <summary className="cursor-pointer p-4 bg-white/5 hover:bg-white/10 rounded-xl text-white font-medium transition-all">
                            ¿Cómo puedo cambiar mi método de pago?
                        </summary>
                        <p className="p-4 text-sm text-gray-400">
                            Puedes cambiar tu método de pago desde la sección de Facturación en tu portal de cliente.
                        </p>
                    </details>
                    <details className="group">
                        <summary className="cursor-pointer p-4 bg-white/5 hover:bg-white/10 rounded-xl text-white font-medium transition-all">
                            ¿Cuál es el tiempo de respuesta promedio?
                        </summary>
                        <p className="p-4 text-sm text-gray-400">
                            Nuestro tiempo de respuesta promedio es de 2 horas para tickets de alta prioridad y 24 horas para prioridad media/baja.
                        </p>
                    </details>
                </div>
            </div>
        </div>
    );
}
