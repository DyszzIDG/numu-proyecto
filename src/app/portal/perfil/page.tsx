'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Lock, Phone, Save, ArrowLeft, Shield } from 'lucide-react';
import { getEmployeeSession } from '@/lib/auth/session';
import Link from 'next/link';

export default function ProfilePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [role, setRole] = useState('');
    const [department, setDepartment] = useState('');

    useEffect(() => {
        const session = getEmployeeSession();
        if (!session) {
            router.push('/portal/login');
            return;
        }
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await fetch('/api/employees/me');
            const data = await response.json();

            if (data.success) {
                const { employee } = data;
                setFormData(prev => ({
                    ...prev,
                    firstName: employee.firstName,
                    lastName: employee.lastName,
                    email: employee.email,
                    phone: employee.phone || ''
                }));
                setRole(employee.role);
                setDepartment(employee.department?.name || 'General');
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
            setMessage({ type: 'error', text: 'Las contraseñas no coinciden' });
            return;
        }

        if (formData.newPassword && !formData.currentPassword) {
            setMessage({ type: 'error', text: 'Debes ingresar tu contraseña actual para cambiarla' });
            return;
        }

        setSubmitting(true);
        try {
            const response = await fetch('/api/employees/me', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    phone: formData.phone,
                    currentPassword: formData.currentPassword || undefined,
                    newPassword: formData.newPassword || undefined
                })
            });

            const data = await response.json();

            if (data.success) {
                setMessage({ type: 'success', text: 'Perfil actualizado exitosamente' });
                setFormData(prev => ({
                    ...prev,
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                }));
            } else {
                setMessage({ type: 'error', text: data.error || 'Error al actualizar perfil' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Error de conexión' });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
                <p className="text-gray-400">Cargando perfil...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
            <div className="max-w-2xl mx-auto">
                <div className="mb-8">
                    <Link
                        href="/portal/dashboard"
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Volver al Dashboard
                    </Link>
                    <h1 className="text-3xl font-bold text-white mb-2">Mi Perfil</h1>
                    <p className="text-gray-400">Administra tu información personal y seguridad</p>
                </div>

                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-8">
                    {/* User Info Badge */}
                    <div className="flex items-center gap-4 mb-8 p-4 bg-white/5 rounded-lg border border-white/5">
                        <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center border border-cyan-500/30">
                            <User className="w-8 h-8 text-cyan-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">{formData.firstName} {formData.lastName}</h2>
                            <div className="flex items-center gap-3 text-sm text-gray-400 mt-1">
                                <span className="flex items-center gap-1">
                                    <Shield className="w-3 h-3" />
                                    {role.toUpperCase()}
                                </span>
                                <span>•</span>
                                <span>{department}</span>
                            </div>
                        </div>
                    </div>

                    {message.text && (
                        <div className={`p-4 rounded-lg mb-6 ${message.type === 'success' ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'
                            }`}>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Personal Info */}
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <User className="w-4 h-4 text-cyan-400" />
                                Información Personal
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-400 text-sm mb-2">Nombre</label>
                                    <input
                                        type="text"
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                        className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-sm mb-2">Apellido</label>
                                    <input
                                        type="text"
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                        className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-sm mb-2">Teléfono</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            placeholder="+56 9 ..."
                                            className="w-full pl-10 pr-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-sm mb-2">Email</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        disabled
                                        className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-gray-400 cursor-not-allowed"
                                    />
                                </div>
                            </div>
                        </div>

                        <hr className="border-white/10" />

                        {/* Security */}
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <Lock className="w-4 h-4 text-orange-400" />
                                Seguridad
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-gray-400 text-sm mb-2">Contraseña Actual</label>
                                    <input
                                        type="password"
                                        value={formData.currentPassword}
                                        onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                                        placeholder="Solo si deseas cambiarla"
                                        className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white focus:border-orange-500 focus:outline-none"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-400 text-sm mb-2">Nueva Contraseña</label>
                                        <input
                                            type="password"
                                            value={formData.newPassword}
                                            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                                            className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white focus:border-orange-500 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-400 text-sm mb-2">Confirmar Nueva Contraseña</label>
                                        <input
                                            type="password"
                                            value={formData.confirmPassword}
                                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                            className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white focus:border-orange-500 focus:outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 transform hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {submitting ? (
                                    'Guardando...'
                                ) : (
                                    <>
                                        <Save className="w-5 h-5" />
                                        Guardar Cambios
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
