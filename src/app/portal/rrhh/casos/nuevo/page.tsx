'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Building, User, AlertTriangle, FileText, Check, Search } from 'lucide-react';
import { getEmployeeSession } from '@/lib/auth/session';
import Link from 'next/link';

interface Company {
    id: string;
    name: string;
    industry: string;
}

interface Employee {
    id: string;
    firstName: string;
    lastName: string;
    role: string;
    department: {
        name: string;
    } | null;
}

export default function NewCasePage() {
    const router = useRouter();
    const [session, setSession] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Data
    const [companies, setCompanies] = useState<Company[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);

    // Form
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        companyId: '',
        priority: 'medium',
        type: 'general',
        assignedTo: [] as string[]
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

        Promise.all([
            fetch('/api/companies').then(res => res.json()),
            fetch('/api/employees').then(res => res.json())
        ]).then(([companiesData, employeesData]) => {
            if (companiesData.success) {
                setCompanies(companiesData.data);
            }
            if (employeesData.success) {
                setEmployees(employeesData.data);
            }
        }).catch(err => console.error('Error fetching data:', err))
            .finally(() => setLoading(false));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const response = await fetch('/api/portal/cases', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            if (data.success) {
                router.push('/portal/rrhh');
            }
        } catch (error) {
            console.error('Error creating case:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const toggleEmployee = (employeeId: string) => {
        setFormData(prev => ({
            ...prev,
            assignedTo: prev.assignedTo.includes(employeeId)
                ? prev.assignedTo.filter(id => id !== employeeId)
                : [...prev.assignedTo, employeeId]
        }));
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
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/portal/rrhh"
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Volver al Dashboard
                    </Link>
                    <h1 className="text-3xl font-bold text-white mb-2">Crear Nuevo Caso</h1>
                    <p className="text-gray-400">Asigna un nuevo caso a un empleado</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Info */}
                    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-cyan-400" />
                            Información del Caso
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-400 text-sm mb-2">Título</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                                    placeholder="Ej: Revisión de Seguridad Trimestral"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-400 text-sm mb-2">Descripción</label>
                                <textarea
                                    required
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 min-h-[120px]"
                                    placeholder="Detalles completos del caso..."
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-400 text-sm mb-2">Prioridad</label>
                                    <select
                                        value={formData.priority}
                                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                        className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                                    >
                                        <option value="low">Baja</option>
                                        <option value="medium">Media</option>
                                        <option value="high">Alta</option>
                                        <option value="critical">Crítica</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-gray-400 text-sm mb-2">Tipo</label>
                                    <select
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                                    >
                                        <option value="general">General</option>
                                        <option value="security_incident">Incidente de Seguridad</option>
                                        <option value="assessment_followup">Seguimiento de Evaluación</option>
                                        <option value="scan_issue">Problema de Escaneo</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Company Selection */}
                    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <Building className="w-5 h-5 text-purple-400" />
                            Empresa Cliente
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                            {companies.map((company) => (
                                <div
                                    key={company.id}
                                    onClick={() => setFormData({ ...formData, companyId: company.id })}
                                    className={`p-4 rounded-lg border cursor-pointer transition-all ${formData.companyId === company.id
                                            ? 'bg-purple-500/20 border-purple-500/50'
                                            : 'bg-black/30 border-white/10 hover:bg-white/5'
                                        }`}
                                >
                                    <div className="flex items-center justify-between mb-1">
                                        <h3 className="text-white font-semibold">{company.name}</h3>
                                        {formData.companyId === company.id && (
                                            <Check className="w-4 h-4 text-purple-400" />
                                        )}
                                    </div>
                                    <p className="text-gray-400 text-sm">{company.industry}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Employee Assignment */}
                    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <User className="w-5 h-5 text-green-400" />
                            Asignar Empleados
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                            {employees.map((employee) => ( // Corrected variable usage here
                                <div
                                    key={employee.id}
                                    onClick={() => toggleEmployee(employee.id)}
                                    className={`p-4 rounded-lg border cursor-pointer transition-all ${formData.assignedTo.includes(employee.id)
                                            ? 'bg-green-500/20 border-green-500/50'
                                            : 'bg-black/30 border-white/10 hover:bg-white/5'
                                        }`}
                                >
                                    <div className="flex items-center justify-between mb-1">
                                        <h3 className="text-white font-semibold">
                                            {employee.firstName} {employee.lastName}
                                        </h3>
                                        {formData.assignedTo.includes(employee.id) && (
                                            <Check className="w-4 h-4 text-green-400" />
                                        )}
                                    </div>
                                    <p className="text-gray-400 text-sm capitalize">{employee.role}</p>
                                    {employee.department && (
                                        <p className="text-gray-500 text-xs mt-1">{employee.department.name}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={submitting || !formData.companyId || !formData.title}
                        className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.01]"
                    >
                        {submitting ? 'Creando Caso...' : 'Crear Caso'}
                    </button>
                </form>
            </div>
        </div>
    );
}
