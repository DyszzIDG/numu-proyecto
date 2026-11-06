'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Building2, ShieldCheck, AlertTriangle, FileText, Save, CheckCircle } from 'lucide-react';

export default function CompanyViewPage() {
    const router = useRouter();
    const { data: session } = useSession();
    const [company, setCompany] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [assessment, setAssessment] = useState<any>(null);

    useEffect(() => {
        if (session?.user?.email) {
            fetchCompanyData(session.user.email);
        }
    }, [session]);

    const fetchCompanyData = async (email: string) => {
        try {
            // Fetch company associated with this user (assuming linkage or user IS the company rep)
            // For now, we might need an endpoint to get company by user email or just use the first company found for this user if they are an employee of it.
            // Since our Employee model links to Department but not explicitly Company in the way we might expect for external companies, 
            // we'll assume for this prototype that one exists or we create a placeholder.

            // In a real app, Employee would handle this, but let's mock/fetch based on logic similar to admin.
            const res = await fetch(`/api/company/my-company`);
            if (res.ok) {
                const data = await res.json();
                setCompany(data.company);
                setAssessment(data.assessment);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="min-h-screen bg-black flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div></div>;

    if (!company) {
        return <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 flex items-center justify-center">
            <CompanyRegistrationForm onComplete={(data) => {
                setCompany(data.company);
                setAssessment(data.assessment);
            }} />
        </div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                            <Building2 className="w-8 h-8 text-purple-400" />
                            {company.name}
                        </h1>
                        <p className="text-gray-400">Panel de Gestión de Seguridad y Cumplimiento</p>
                    </div>
                    {assessment && (
                        <div className="bg-white/10 px-6 py-3 rounded-xl border border-white/20">
                            <span className="text-sm text-gray-400 block">Indice de Seguridad</span>
                            <span className={`text-3xl font-bold ${(assessment.score || 0) >= 80 ? 'text-green-400' :
                                (assessment.score || 0) >= 50 ? 'text-yellow-400' : 'text-red-400'
                                }`}>{assessment.score || 0}%</span>
                        </div>
                    )}
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Status Card */}
                    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 lg:col-span-1">
                        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-green-400" />
                            Estado Actual
                        </h3>
                        <div className="space-y-4">
                            <div className="p-4 bg-black/20 rounded-lg border border-white/5">
                                <p className="text-gray-400 text-sm">Evaluación de Riesgos</p>
                                <p className="text-white font-medium">
                                    {assessment ? (
                                        assessment.status === 'completed' ? 'Completada' : 'En Progreso'
                                    ) : 'No Iniciada'}
                                </p>
                            </div>
                            <div className="p-4 bg-black/20 rounded-lg border border-white/5">
                                <p className="text-gray-400 text-sm">Próxima Revisión</p>
                                <p className="text-white font-medium">15 Oct 2026</p>
                            </div>

                            const router = useRouter(); // Import needed at top

                            // ... (inside the component)

                            {!assessment && (
                                <button
                                    onClick={() => router.push('/dashboard/vista-empresa/assessment')}
                                    className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors font-medium"
                                >
                                    Iniciar Autoevaluación
                                </button>
                            )}

                            {assessment && assessment.status !== 'completed' && (
                                <button
                                    className="w-full py-3 bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg transition-colors font-medium"
                                    onClick={() => router.push('/dashboard/vista-empresa/assessment')}
                                >
                                    Continuar Evaluación
                                </button>
                            )}

                            {assessment && assessment.status === 'completed' && (
                                <button
                                    className="w-full py-3 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-colors font-medium"
                                    onClick={() => router.push('/dashboard/vista-empresa/assessment')}
                                >
                                    Ver Resultados
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Pending Actions / Recommendations */}
                    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 lg:col-span-2">
                        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-orange-400" />
                            Acciones Recomendadas
                        </h3>
                        {/* Placeholder content until assessment logic is connected */}
                        <div className="space-y-3">
                            <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg flex items-start gap-3">
                                <div className="p-2 bg-orange-500/20 rounded-lg">
                                    <FileText className="w-5 h-5 text-orange-400" />
                                </div>
                                <div>
                                    <h4 className="text-white font-medium">Completar Perfil de Seguridad</h4>
                                    <p className="text-gray-400 text-sm">Es necesario completar la información básica de la infraestructura.</p>
                                </div>
                                <button
                                    onClick={() => router.push('/dashboard/settings')}
                                    className="ml-auto text-sm bg-orange-500/20 text-orange-300 px-3 py-1 rounded hover:bg-orange-500/30 transition-colors"
                                >
                                    Ver
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

function CompanyRegistrationForm({ onComplete }: { onComplete: (data: any) => void }) {
    const [name, setName] = useState('');
    const [industry, setIndustry] = useState('');
    const [size, setSize] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await fetch('/api/company/my-company', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, industry, size })
            });
            if (res.ok) {
                const data = await res.json();
                onComplete(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Building2 className="w-6 h-6 text-purple-400" />
                Registrar Empresa
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="text-sm font-medium text-gray-300 block mb-1">Nombre de la Empresa</label>
                    <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white"
                        placeholder="Tech Solutions Inc."
                        required
                    />
                </div>
                <div>
                    <label className="text-sm font-medium text-gray-300 block mb-1">Industria</label>
                    <select
                        value={industry}
                        onChange={e => setIndustry(e.target.value)}
                        className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white"
                        required
                    >
                        <option value="">Seleccionar...</option>
                        <option value="Technology">Tecnología</option>
                        <option value="Finance">Finanzas</option>
                        <option value="Healthcare">Salud</option>
                        <option value="Retail">Retail</option>
                    </select>
                </div>
                <div>
                    <label className="text-sm font-medium text-gray-300 block mb-1">Tamaño (Empleados)</label>
                    <input
                        type="number"
                        value={size}
                        onChange={e => setSize(e.target.value)}
                        className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white"
                        placeholder="50"
                        required
                    />
                </div>
                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                    {submitting ? 'Registrando...' : 'Comenzar'}
                    <CheckCircle className="w-4 h-4" />
                </button>
            </form>
        </div>
    )
}
