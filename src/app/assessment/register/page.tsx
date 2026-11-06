'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, Mail, User, Phone, Globe, MapPin, Users, Briefcase, ArrowRight, Shield } from 'lucide-react';

const INDUSTRIES = [
    'Tecnología',
    'Finanzas',
    'Salud',
    'Educación',
    'Retail',
    'Manufactura',
    'Gobierno',
    'Telecomunicaciones',
    'Energía',
    'Otro'
];

const COMPANY_SIZES = [
    '1-10',
    '11-50',
    '51-200',
    '201-500',
    '500+'
];

export default function CompanyRegisterPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        industry: '',
        size: '',
        country: '',
        contactEmail: '',
        contactName: '',
        contactPhone: '',
        website: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('/api/companies', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                // Start assessment
                const assessmentRes = await fetch('/api/assessments', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ companyId: data.company.id })
                });

                const assessmentData = await assessmentRes.json();

                if (assessmentData.success) {
                    router.push(`/assessment/questionnaire?id=${assessmentData.assessment.id}`);
                }
            } else {
                alert(data.error || 'Error al registrar empresa');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al registrar empresa');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Shield className="w-12 h-12 text-cyan-400" />
                        <h1 className="text-4xl font-bold text-white">Evaluación de Seguridad</h1>
                    </div>
                    <p className="text-gray-400 text-lg">
                        Registre su empresa y complete nuestra evaluación de seguridad para obtener un análisis completo
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-gray-800/50 border border-gray-700 rounded-xl p-8">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                        <Building2 className="w-6 h-6 text-cyan-400" />
                        Información de la Empresa
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Company Name */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Nombre de la Empresa *
                            </label>
                            <div className="relative">
                                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full bg-gray-900/50 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-cyan-500"
                                    placeholder="Ej: Acme Corporation"
                                />
                            </div>
                        </div>

                        {/* Industry */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Industria *
                            </label>
                            <div className="relative">
                                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <select
                                    name="industry"
                                    required
                                    value={formData.industry}
                                    onChange={handleChange}
                                    className="w-full bg-gray-900/50 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-cyan-500"
                                >
                                    <option value="">Seleccione...</option>
                                    {INDUSTRIES.map(ind => (
                                        <option key={ind} value={ind}>{ind}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Company Size */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Tamaño de la Empresa *
                            </label>
                            <div className="relative">
                                <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <select
                                    name="size"
                                    required
                                    value={formData.size}
                                    onChange={handleChange}
                                    className="w-full bg-gray-900/50 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-cyan-500"
                                >
                                    <option value="">Seleccione...</option>
                                    {COMPANY_SIZES.map(size => (
                                        <option key={size} value={size}>{size} empleados</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Country */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                País *
                            </label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <input
                                    type="text"
                                    name="country"
                                    required
                                    value={formData.country}
                                    onChange={handleChange}
                                    className="w-full bg-gray-900/50 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-cyan-500"
                                    placeholder="Ej: Argentina"
                                />
                            </div>
                        </div>

                        {/* Website */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Sitio Web
                            </label>
                            <div className="relative">
                                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <input
                                    type="url"
                                    name="website"
                                    value={formData.website}
                                    onChange={handleChange}
                                    className="w-full bg-gray-900/50 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-cyan-500"
                                    placeholder="https://ejemplo.com"
                                />
                            </div>
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold text-white mt-8 mb-6 flex items-center gap-2">
                        <User className="w-6 h-6 text-cyan-400" />
                        Información de Contacto
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Contact Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Nombre del Contacto *
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <input
                                    type="text"
                                    name="contactName"
                                    required
                                    value={formData.contactName}
                                    onChange={handleChange}
                                    className="w-full bg-gray-900/50 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-cyan-500"
                                    placeholder="Juan Pérez"
                                />
                            </div>
                        </div>

                        {/* Contact Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Email de Contacto *
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <input
                                    type="email"
                                    name="contactEmail"
                                    required
                                    value={formData.contactEmail}
                                    onChange={handleChange}
                                    className="w-full bg-gray-900/50 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-cyan-500"
                                    placeholder="contacto@empresa.com"
                                />
                            </div>
                        </div>

                        {/* Contact Phone */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Teléfono de Contacto
                            </label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <input
                                    type="tel"
                                    name="contactPhone"
                                    value={formData.contactPhone}
                                    onChange={handleChange}
                                    className="w-full bg-gray-900/50 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-cyan-500"
                                    placeholder="+54 11 1234-5678"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="mt-8 flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 px-8 py-4 bg-cyan-500 hover:bg-cyan-600 disabled:bg-cyan-500/50 text-white font-semibold rounded-lg transition-colors"
                        >
                            {loading ? 'Registrando...' : 'Comenzar Evaluación'}
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
