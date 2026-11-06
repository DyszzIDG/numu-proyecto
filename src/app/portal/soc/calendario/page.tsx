'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Plus, User } from 'lucide-react';
import { getEmployeeSession } from '@/lib/auth/session';
import Link from 'next/link';

interface Shift {
    id: string;
    start: string;
    end: string;
    type: string;
    notes: string;
    employee: {
        id: string;
        firstName: string;
        lastName: string;
        role: string;
        avatar?: string;
    };
}

export default function CalendarPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [shifts, setShifts] = useState<Shift[]>([]);
    const [view, setView] = useState<'month' | 'week'>('month');

    // Fetch shifts
    useEffect(() => {
        const session = getEmployeeSession();
        if (!session) {
            router.push('/portal/login');
            return;
        }
        fetchShifts();
    }, [currentDate, view]);

    const fetchShifts = async () => {
        setLoading(true);
        try {
            // Calculate start/end of month
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth();
            const start = new Date(year, month, 1).toISOString();
            const end = new Date(year, month + 1, 0).toISOString();

            const response = await fetch(`/api/portal/calendar?start=${start}&end=${end}`);
            const data = await response.json();

            if (data.success) {
                setShifts(data.shifts);
            }
        } catch (error) {
            console.error('Error fetching shifts:', error);
        } finally {
            setLoading(false);
        }
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));
    };

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));
    };

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const days = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay(); // 0 = Sunday
        return { days, firstDay };
    };

    const { days, firstDay } = getDaysInMonth(currentDate);
    const dayArray = [...Array(days).keys()].map(i => i + 1);
    const emptyDays = [...Array(firstDay).keys()]; // Empty cells before 1st day

    const getShiftsForDay = (day: number) => {
        return shifts.filter(shift => {
            const shiftDate = new Date(shift.start);
            return shiftDate.getDate() === day &&
                shiftDate.getMonth() === currentDate.getMonth() &&
                shiftDate.getFullYear() === currentDate.getFullYear();
        });
    };

    const getShiftColor = (type: string) => {
        switch (type) {
            case 'morning': return 'bg-yellow-500/20 border-yellow-500/30 text-yellow-300';
            case 'afternoon': return 'bg-orange-500/20 border-orange-500/30 text-orange-300';
            case 'night': return 'bg-blue-500/20 border-blue-500/30 text-blue-300';
            case 'guardia': return 'bg-red-500/20 border-red-500/30 text-red-300';
            default: return 'bg-gray-500/20 border-gray-500/30 text-gray-300';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Calendario de Turnos</h1>
                        <p className="text-gray-400">Gestión de horarios y guardias del SOC</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="bg-white/5 border border-white/10 rounded-xl p-1 flex">
                            <button
                                onClick={prevMonth}
                                className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <div className="px-4 py-2 text-white font-bold min-w-[150px] text-center">
                                {currentDate.toLocaleString('es-ES', { month: 'long', year: 'numeric' }).toUpperCase()}
                            </div>
                            <button
                                onClick={nextMonth}
                                className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Ideally integrate Add Shift functionality here for Admins */}
                    </div>
                </div>

                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl overflow-hidden">
                    {/* Header Days */}
                    <div className="grid grid-cols-7 border-b border-white/10 bg-black/30">
                        {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
                            <div key={day} className="p-4 text-center text-gray-400 font-semibold text-sm">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 auto-rows-[minmax(120px,auto)] bg-white/5">
                        {emptyDays.map(i => (
                            <div key={`empty-${i}`} className="border-r border-b border-white/5 bg-black/40"></div>
                        ))}

                        {dayArray.map(day => {
                            const dayShifts = getShiftsForDay(day);
                            return (
                                <div key={day} className="border-r border-b border-white/5 p-2 bg-black/20 hover:bg-white/5 transition-colors relative group">
                                    <span className={`block text-right mb-2 text-sm font-medium ${new Date().getDate() === day &&
                                            new Date().getMonth() === currentDate.getMonth()
                                            ? 'text-cyan-500 font-bold'
                                            : 'text-gray-400'
                                        }`}>
                                        {day}
                                    </span>

                                    <div className="space-y-1">
                                        {dayShifts.map(shift => (
                                            <div
                                                key={shift.id}
                                                className={`text-xs p-1.5 rounded border ${getShiftColor(shift.type)} truncate`}
                                                title={`${shift.employee.firstName} ${shift.employee.lastName} - ${shift.notes || shift.type}`}
                                            >
                                                <div className="font-bold mb-0.5">{shift.employee.firstName}</div>
                                                <div className="opacity-80 flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {new Date(shift.start).getHours()}:00 - {new Date(shift.end).getHours()}:00
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
