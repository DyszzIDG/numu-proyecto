'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, User, Plus, Search, Trash2, Shield, Building, Mail, X } from 'lucide-react';
import { getEmployeeSession } from '@/lib/auth/session';
import Link from 'next/link';

interface Employee {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    department: {
        id: string;
        name: string;
    } | null;
}

interface Department {
    id: string;
    name: string;
}

export default function EmployeesPage() {
    const router = useRouter();
    const [session, setSession] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Form data
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: 'viewer',
        departmentId: ''
    });

    useEffect(() => {
        const employeeSession = getEmployeeSession();
        if (!employeeSession) {
            router.push('/portal/login');
            return;
        }
        if (employeeSession.role !== 'hr' && employeeSession.role !== 'admin') {
            router.push('/portal/dashboard');
            return;
        }
        setSession(employeeSession);

        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [empRes, deptRes] = await Promise.all([
                fetch('/api/employees'),
                fetch('/api/departments')
            ]);

            const empData = await empRes.json();
            const deptData = await deptRes.json();

            if (empData.success) setEmployees(empData.data);
            if (deptData.success) setDepartments(deptData.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateEmployee = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const response = await fetch('/api/employees', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            if (data.success) {
                setShowCreateForm(false);
                setFormData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    password: '',
                    role: 'viewer',
                    departmentId: ''
                });
                fetchData(); // Refresh list
            } else {
                alert(data.error || 'Error creating employee');
            }
        } catch (error) {
            console.error('Error creating employee:', error);
            alert('Failed to create employee');
        } finally {
            setSubmitting(false);
        }
    };

    const filteredEmployees = employees.filter(emp =>
        emp.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'admin': return 'border-purple-500 text-purple-400 bg-purple-500/10';
            case 'hr': return 'border-cyan-500 text-cyan-400 bg-cyan-500/10';
            case 'analyst': return 'border-green-500 text-green-400 bg-green-500/10';
            default: return 'border-gray-500 text-gray-400 bg-gray-500/10';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
                <p className="text-gray-400">Cargando...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <Link
                            href="/portal/rrhh"
                            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Volver al Dashboard
                        </Link>
                        <h1 className="text-3xl font-bold text-white mb-2">Gestión de Empleados</h1>
                        <p className="text-gray-400">Administra el personal y sus roles</p>
                    </div>
                    <button
                        onClick={() => setShowCreateForm(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-bold rounded-xl transition-all transform hover:scale-105"
                    >
                        <Plus className="w-5 h-5" />
                        Nuevo Empleado
                    </button>
                </div>

                {/* Search */}
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4 mb-8">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre o email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-black/30 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                        />
                    </div>
                </div>

                {/* Employees Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEmployees.map((employee) => (
                        <div key={employee.id} className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 group hover:bg-white/10 transition-all">
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 bg-gray-800 rounded-full">
                                    <User className="w-6 h-6 text-gray-300" />
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getRoleBadgeColor(employee.role)} capitalized`}>
                                    {employee.role}
                                </span>
                            </div>

                            <h3 className="text-xl font-bold text-white mb-1">
                                {employee.firstName} {employee.lastName}
                            </h3>

                            <div className="space-y-2 mt-4">
                                <div className="flex items-center gap-2 text-gray-400 text-sm">
                                    <Mail className="w-4 h-4" />
                                    <span>{employee.email}</span>
                                </div>
                                {employee.department && (
                                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                                        <Building className="w-4 h-4" />
                                        <span>{employee.department.name}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Create Modal */}
                {showCreateForm && (
                    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                        <div className="bg-gray-900 border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            <div className="p-6 border-b border-white/10 flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-white">Registrar Nuevo Empleado</h2>
                                <button
                                    onClick={() => setShowCreateForm(false)}
                                    className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <form onSubmit={handleCreateEmployee} className="p-6 space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-gray-400 text-sm mb-2">Nombre</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.firstName}
                                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                            className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-400 text-sm mb-2">Apellidos</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.lastName}
                                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                            className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-gray-400 text-sm mb-2">Email Corporativo</label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-400 text-sm mb-2">Contraseña Temporal</label>
                                    <input
                                        type="password"
                                        required
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-gray-400 text-sm mb-2">Rol</label>
                                        <select
                                            value={formData.role}
                                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                            className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                                        >
                                            <option value="viewer">Visualizador</option>
                                            <option value="analyst">Analista</option>
                                            <option value="hr">RRHH</option>
                                            <option value="admin">Administrador</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-gray-400 text-sm mb-2">Departamento</label>
                                        <select
                                            value={formData.departmentId}
                                            onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                                            className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                                        >
                                            <option value="">Sin departamento</option>
                                            {departments.map(dept => (
                                                <option key={dept.id} value={dept.id}>{dept.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setShowCreateForm(false)}
                                        className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-bold rounded-xl transition-colors disabled:opacity-50"
                                    >
                                        {submitting ? 'Creando...' : 'Crear Empleado'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
