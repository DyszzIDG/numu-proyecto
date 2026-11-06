"use client";

import { Building2, Mail, Phone, MapPin, Bell, Lock } from "lucide-react";

export default function ClientSettingsPage() {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-bold text-white mb-2">Configuración</h1>
                <p className="text-gray-400">Gestiona la información de tu cuenta y preferencias</p>
            </div>

            {/* Company Information */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-blue-400" />
                    Información de la Empresa
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Nombre de la Empresa</label>
                        <input
                            type="text"
                            defaultValue="Acme Corporation"
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">RUC / Tax ID</label>
                        <input
                            type="text"
                            defaultValue="20123456789"
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Email de Contacto</label>
                        <input
                            type="email"
                            defaultValue="contacto@acme.com"
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Teléfono</label>
                        <input
                            type="tel"
                            defaultValue="+1 234 567 8900"
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-300 mb-2">Dirección</label>
                        <input
                            type="text"
                            defaultValue="123 Business St, Suite 100, New York, NY 10001"
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        />
                    </div>
                </div>
                <div className="mt-6 flex justify-end">
                    <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl font-semibold transition-all hover:scale-105">
                        Guardar Cambios
                    </button>
                </div>
            </div>

            {/* Notifications */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Bell className="w-5 h-5 text-yellow-400" />
                    Notificaciones
                </h2>
                <div className="space-y-4">
                    {[
                        { label: "Alertas de seguridad", description: "Recibe notificaciones sobre incidentes críticos" },
                        { label: "Reportes mensuales", description: "Envío automático de reportes al final del mes" },
                        { label: "Actualizaciones de tickets", description: "Notificaciones cuando hay respuestas a tus tickets" },
                        { label: "Recordatorios de facturación", description: "Avisos antes del vencimiento de facturas" }
                    ].map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                            <div>
                                <p className="font-medium text-white">{item.label}</p>
                                <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" defaultChecked className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Security */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Lock className="w-5 h-5 text-red-400" />
                    Seguridad
                </h2>
                <div className="space-y-4">
                    <button className="w-full p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all group">
                        <p className="font-medium text-white group-hover:text-blue-400 transition-colors">Cambiar Contraseña</p>
                        <p className="text-xs text-gray-500 mt-1">Última actualización: Hace 3 meses</p>
                    </button>
                    <button className="w-full p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all group">
                        <p className="font-medium text-white group-hover:text-blue-400 transition-colors">Autenticación de Dos Factores</p>
                        <p className="text-xs text-gray-500 mt-1">Agrega una capa extra de seguridad</p>
                    </button>
                    <button className="w-full p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all group">
                        <p className="font-medium text-white group-hover:text-blue-400 transition-colors">Sesiones Activas</p>
                        <p className="text-xs text-gray-500 mt-1">Gestiona tus dispositivos conectados</p>
                    </button>
                </div>
            </div>
        </div>
    );
}
