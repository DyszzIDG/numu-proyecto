'use client';

import React, { useState } from 'react';
import { Calendar, Clock, Repeat, Save, Check } from 'lucide-react';

interface ScheduledScan {
    id?: string;
    name: string;
    target: string;
    frequency: 'daily' | 'weekly' | 'monthly' | 'once';
    time: string;
    daysOfWeek: number[]; // 0 = Sunday
    dayOfMonth: number;
    templateId: string;
    active: boolean;
}

export function ScanScheduler() {
    const [schedules, setSchedules] = useState<ScheduledScan[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [newSchedule, setNewSchedule] = useState<ScheduledScan>({
        name: '',
        target: '',
        frequency: 'weekly',
        time: '02:00',
        daysOfWeek: [1], // Monday
        dayOfMonth: 1,
        templateId: 'web-basic',
        active: true
    });

    const handleSave = () => {
        setSchedules([...schedules, { ...newSchedule, id: Date.now().toString() }]);
        setShowForm(false);
    };

    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-cyan-400" />
                    Escaneos Programados
                </h3>
                <button
                    onClick={() => setShowForm(true)}
                    className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg text-sm font-medium hover:from-cyan-700 hover:to-blue-700 transition"
                >
                    + Nueva Programación
                </button>
            </div>

            {/* Form Modal (Inline for simplicity) */}
            {showForm && (
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-lg animate-in fade-in slide-in-from-top-4">
                    <h4 className="font-bold mb-4">Configurar Escaneo Recurrente</h4>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm text-slate-400 mb-1">Nombre</label>
                            <input
                                type="text"
                                value={newSchedule.name}
                                onChange={(e) => setNewSchedule({ ...newSchedule, name: e.target.value })}
                                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded focus:border-cyan-500 outline-none"
                                placeholder="Ej: Escaneo Semanal Producción"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Frecuencia</label>
                                <select
                                    value={newSchedule.frequency}
                                    onChange={(e) => setNewSchedule({ ...newSchedule, frequency: e.target.value as any })}
                                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded focus:border-cyan-500 outline-none"
                                >
                                    <option value="once">Una vez</option>
                                    <option value="daily">Diario</option>
                                    <option value="weekly">Semanal</option>
                                    <option value="monthly">Mensual</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Hora</label>
                                <input
                                    type="time"
                                    value={newSchedule.time}
                                    onChange={(e) => setNewSchedule({ ...newSchedule, time: e.target.value })}
                                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded focus:border-cyan-500 outline-none"
                                />
                            </div>
                        </div>

                        {newSchedule.frequency === 'weekly' && (
                            <div>
                                <label className="block text-sm text-slate-400 mb-2">Días de la semana</label>
                                <div className="flex gap-2">
                                    {days.map((day, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => {
                                                const newDays = newSchedule.daysOfWeek.includes(idx)
                                                    ? newSchedule.daysOfWeek.filter(d => d !== idx)
                                                    : [...newSchedule.daysOfWeek, idx];
                                                setNewSchedule({ ...newSchedule, daysOfWeek: newDays });
                                            }}
                                            className={`w-10 h-10 rounded-full text-xs font-medium transition ${newSchedule.daysOfWeek.includes(idx)
                                                    ? 'bg-cyan-600 text-white'
                                                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                                }`}
                                        >
                                            {day}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setShowForm(false)}
                                className="px-4 py-2 text-slate-400 hover:text-white transition"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={!newSchedule.name}
                                className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Guardar Programación
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Schedule List */}
            <div className="space-y-3">
                {schedules.map(schedule => (
                    <div key={schedule.id} className="p-4 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-between group hover:border-slate-700 transition">
                        <div className="flex items-center gap-4">
                            <div className={`p-2 rounded-lg ${schedule.active ? 'bg-green-500/20 text-green-400' : 'bg-slate-800 text-slate-500'}`}>
                                <Repeat className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="font-semibold">{schedule.name}</div>
                                <div className="text-xs text-slate-400 flex items-center gap-2">
                                    <Clock className="w-3 h-3" />
                                    {schedule.frequency === 'daily' && `Todos los días a las ${schedule.time}`}
                                    {schedule.frequency === 'weekly' && `Semanal (${schedule.daysOfWeek.map(d => days[d]).join(', ')}) a las ${schedule.time}`}
                                    {schedule.frequency === 'monthly' && `Mensual (día ${schedule.dayOfMonth}) a las ${schedule.time}`}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={schedule.active}
                                    onChange={() => {
                                        const updated = schedules.map(s =>
                                            s.id === schedule.id ? { ...s, active: !s.active } : s
                                        );
                                        setSchedules(updated);
                                    }}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                            </label>
                        </div>
                    </div>
                ))}

                {schedules.length === 0 && !showForm && (
                    <div className="text-center py-12 text-slate-500 border border-dashed border-slate-800 rounded-lg">
                        <Calendar className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p>No hay escaneos programados</p>
                    </div>
                )}
            </div>

        </div>
    );
}
