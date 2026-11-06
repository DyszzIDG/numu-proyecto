'use client';

import React, { useState } from 'react';
import { Bell, Check, X, Info, AlertTriangle, AlertOctagon } from 'lucide-react';

interface Notification {
    id: string;
    type: 'info' | 'success' | 'warning' | 'error' | 'critical';
    title: string;
    message: string;
    timestamp: Date;
    read: boolean;
}

export function NotificationCenter() {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([
        {
            id: '1',
            type: 'critical',
            title: 'Vulnerabilidad Crítica Detectada',
            message: 'Se encontró CVE-2021-41773 en el servidor web principal.',
            timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
            read: false
        },
        {
            id: '2',
            type: 'success',
            title: 'Escaneo Completado',
            message: 'El escaneo programado "Weekly Production" finalizó exitosamente.',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
            read: false
        },
        {
            id: '3',
            type: 'info',
            title: 'Actualización del Sistema',
            message: 'Nuevas firmas de detección disponibles. Actualizando base de datos...',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
            read: true
        }
    ]);

    const unreadCount = notifications.filter(n => !n.read).length;

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    const deleteNotification = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setNotifications(notifications.filter(n => n.id !== id));
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'critical': return <AlertOctagon className="w-5 h-5 text-red-500" />;
            case 'error': return <AlertTriangle className="w-5 h-5 text-red-400" />;
            case 'warning': return <AlertTriangle className="w-5 h-5 text-orange-400" />;
            case 'success': return <Check className="w-5 h-5 text-green-400" />;
            default: return <Info className="w-5 h-5 text-blue-400" />;
        }
    };

    return (
        <div className="relative">

            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-slate-400 hover:text-white transition rounded-full hover:bg-slate-800"
            >
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] font-bold flex items-center justify-center text-white border border-slate-900">
                        {unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-96 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 origin-top-right">

                        {/* Header */}
                        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950">
                            <h3 className="font-bold">Notificaciones</h3>
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="text-xs text-cyan-400 hover:text-cyan-300 transition"
                                >
                                    Marcar todas como leídas
                                </button>
                            )}
                        </div>

                        {/* List */}
                        <div className="max-h-[400px] overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="p-8 text-center text-slate-500">
                                    <Bell className="w-8 h-8 mx-auto mb-2 opacity-20" />
                                    <p>No tienes notificaciones</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-800">
                                    {notifications.map(notification => (
                                        <div
                                            key={notification.id}
                                            className={`p-4 hover:bg-slate-800/50 transition relative group ${!notification.read ? 'bg-slate-800/20' : ''
                                                }`}
                                        >
                                            <div className="flex gap-3">
                                                <div className="mt-1 flex-shrink-0">
                                                    {getIcon(notification.type)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className={`text-sm font-medium mb-1 ${!notification.read ? 'text-white' : 'text-slate-300'}`}>
                                                        {notification.title}
                                                    </h4>
                                                    <p className="text-xs text-slate-400 mb-2 leading-relaxed">
                                                        {notification.message}
                                                    </p>
                                                    <div className="text-[10px] text-slate-500">
                                                        {notification.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {notification.timestamp.toLocaleDateString()}
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={(e) => deleteNotification(notification.id, e)}
                                                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-700 rounded text-slate-500 hover:text-red-400 transition absolute top-2 right-2"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                            {!notification.read && (
                                                <div className="absolute top-4 right-4 w-2 h-2 bg-cyan-500 rounded-full" />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-2 border-t border-slate-800 bg-slate-950 text-center">
                            <button className="text-xs text-slate-400 hover:text-white transition py-1">
                                Ver historial completo
                            </button>
                        </div>

                    </div>
                </>
            )}

        </div>
    );
}
