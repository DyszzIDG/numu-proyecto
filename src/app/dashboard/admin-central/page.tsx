'use client';

import { useEffect, useState } from 'react';
import {
    Users, Shield, Brain, GraduationCap, DollarSign, TrendingUp,
    Activity, AlertTriangle, CheckCircle, Settings, Search, Filter,
    MoreVertical, Lock, CreditCard, ChevronDown, UserCog
} from 'lucide-react';
import ServicePanel from '@/components/services/ServicePanel';
import { motion, AnimatePresence } from 'framer-motion';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
    plan: string;
    lastLogin: string;
    createdAt: string;
}

export default function AdminCentralPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // Form state for editing
    const [editForm, setEditForm] = useState({
        role: '',
        plan: '',
        password: ''
    });

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/admin/users');
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            }
        } catch (error) {
            console.error('Failed to fetch users', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleEditClick = (user: User) => {
        setSelectedUser(user);
        setEditForm({
            role: user.role,
            plan: user.plan,
            password: ''
        });
        setIsEditModalOpen(true);
    };

    const handleSave = async () => {
        if (!selectedUser) return;

        try {
            const res = await fetch(`/api/admin/users/${selectedUser.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editForm)
            });

            if (res.ok) {
                setIsEditModalOpen(false);
                fetchUsers(); // Refresh list
                alert('Usuario actualizado correctamente');
            } else {
                alert('Error al actualizar usuario');
            }
        } catch (error) {
            console.error('Error updating user', error);
        }
    };

    const filteredUsers = users.filter(user =>
        (user.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    const stats = [
        { label: 'Usuarios Totales', value: users.length, icon: Users, color: 'blue' },
        { label: 'Membresías Premium', value: users.filter(u => u.plan === 'premium').length, icon: CreditCard, color: 'purple' },
        { label: 'Staff Admin', value: users.filter(u => u.role === 'ADMIN').length, icon: Shield, color: 'red' },
        { label: 'Nuevos (Mes)', value: users.filter(u => new Date(u.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length, icon: TrendingUp, color: 'green' },
    ];

    return (
        <ServicePanel
            title="Panel Central de Administración"
            breadcrumbs={[
                { label: 'Admin Central', href: '/dashboard/admin-central' }
            ]}
        >
            <div className="space-y-8 relative">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <div key={index} className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all">
                                <div className="flex items-center justify-between mb-4">
                                    <Icon className={`w-8 h-8 text-${stat.color}-400`} />
                                    <span className={`text-3xl font-bold text-${stat.color}-400`}>{stat.value}</span>
                                </div>
                                <p className="text-gray-400 text-sm">{stat.label}</p>
                            </div>
                        );
                    })}
                </div>

                {/* Users Management */}
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 min-h-[500px]">
                    <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                            <Users className="w-6 h-6 text-green-400" />
                            Gestión de Usuarios
                        </h2>

                        {/* Search */}
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Buscar por nombre o email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-black/30 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors"
                            />
                        </div>
                    </div>

                    {/* Users Table */}
                    {loading ? (
                        <div className="text-center py-20">
                            <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-green-500"></div>
                            <p className="text-gray-400 mt-4">Cargando usuarios...</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-white/10 text-gray-400 text-sm uppercase tracking-wider">
                                        <th className="py-4 px-4 font-semibold">Usuario</th>
                                        <th className="py-4 px-4 font-semibold">Nivel (Rol)</th>
                                        <th className="py-4 px-4 font-semibold">Membresía</th>
                                        <th className="py-4 px-4 font-semibold">Estado</th>
                                        <th className="py-4 px-4 font-semibold text-right">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {filteredUsers.map((user) => (
                                        <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                                            <td className="py-4 px-4">
                                                <div className="flex flex-col">
                                                    <span className="text-white font-medium text-base">{user.name || 'Sin Nombre'}</span>
                                                    <span className="text-gray-500 text-xs">{user.email}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${user.role === 'ADMIN' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                                        'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                                    }`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className={`flex items-center gap-1.5 ${user.plan === 'premium' ? 'text-yellow-400' : 'text-gray-400'}`}>
                                                    {user.plan === 'premium' && <DollarSign className="w-3 h-3" />}
                                                    <span className="capitalize font-medium">{user.plan}</span>
                                                </span>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-2 h-2 rounded-full ${user.status === 'active' ? 'bg-green-500' : 'bg-gray-500'}`} />
                                                    <span className="text-gray-300 capitalize">{user.status}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 text-right">
                                                <button
                                                    onClick={() => handleEditClick(user)}
                                                    className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-gray-300 hover:text-white transition-all text-xs font-medium inline-flex items-center gap-1"
                                                >
                                                    <Settings className="w-3 h-3" />
                                                    Gestionar
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Edit Modal */}
                <AnimatePresence>
                    {isEditModalOpen && selectedUser && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                                onClick={() => setIsEditModalOpen(false)}
                            />

                            <motion.div
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.95, opacity: 0 }}
                                className="relative bg-gray-900 border border-white/10 rounded-2xl p-8 w-full max-w-lg shadow-2xl shadow-black/50"
                            >
                                <div className="flex items-start justify-between mb-6">
                                    <div>
                                        <h3 className="text-2xl font-bold text-white mb-1">Editar Usuario</h3>
                                        <p className="text-gray-400 text-sm">{selectedUser.email}</p>
                                    </div>
                                    <div className="p-3 bg-white/5 rounded-xl">
                                        <UserCog className="w-8 h-8 text-blue-400" />
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Nivel / Rol</label>
                                        <select
                                            value={editForm.role}
                                            onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                                            className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                                        >
                                            <option value="USER">USER (Estándar)</option>
                                            <option value="ADMIN">ADMIN (Administrador)</option>
                                            <option value="ANALYST">ANALYST (Analista)</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Membresía</label>
                                        <select
                                            value={editForm.plan}
                                            onChange={(e) => setEditForm({ ...editForm, plan: e.target.value })}
                                            className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                                        >
                                            <option value="free">Free (Gratuito)</option>
                                            <option value="premium">Premium</option>
                                            <option value="enterprise">Enterprise</option>
                                        </select>
                                    </div>

                                    <div className="border-t border-white/10 pt-6 mt-6">
                                        <h4 className="text-white font-medium mb-4 flex items-center gap-2">
                                            <Lock className="w-4 h-4 text-red-400" />
                                            Zona de Seguridad
                                        </h4>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-2">Restablecer Contraseña</label>
                                            <input
                                                type="password"
                                                placeholder="Nueva contraseña (opcional)"
                                                value={editForm.password}
                                                onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                                                className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-red-500 outline-none placeholder-gray-600"
                                            />
                                            <p className="text-xs text-gray-500 mt-1">Dejar en blanco para mantener la actual.</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 pt-4">
                                        <button
                                            onClick={() => setIsEditModalOpen(false)}
                                            className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white font-medium transition-colors"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            onClick={handleSave}
                                            className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg text-white font-bold transition-colors shadow-lg shadow-blue-900/20"
                                        >
                                            Guardar Cambios
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </ServicePanel>
    );
}
