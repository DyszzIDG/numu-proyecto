'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, FileText, Tag, Globe, Lock } from 'lucide-react';
import { getEmployeeSession } from '@/lib/auth/session';
import Link from 'next/link';

export default function NewArticlePage() {
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        category: 'procedimientos',
        isPublic: true
    });

    const categories = [
        { id: 'procedimientos', label: 'Procedimientos' },
        { id: 'onboarding', label: 'Onboarding' },
        { id: 'seguridad', label: 'Seguridad' },
        { id: 'rrhh', label: 'RRHH' },
        { id: 'tecnico', label: 'Técnico' }
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const session = getEmployeeSession();
        if (!session) {
            router.push('/portal/login');
            return;
        }

        setSubmitting(true);
        try {
            const response = await fetch('/api/portal/wiki', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            if (data.success) {
                router.push('/portal/wiki');
            } else {
                alert('Error al crear artículo');
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <Link
                        href="/portal/wiki"
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Volver a la Wiki
                    </Link>
                    <h1 className="text-3xl font-bold text-white mb-2">Nuevo Artículo</h1>
                    <p className="text-gray-400">Comparte conocimiento con tu equipo</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                        <div className="space-y-6">
                            <div>
                                <label className="block text-gray-400 text-sm mb-2">Título</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 font-bold text-lg"
                                    placeholder="Ej: Guía de Respuesta a Incidentes"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-gray-400 text-sm mb-2">Categoría</label>
                                    <div className="relative">
                                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                        <select
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full pl-10 pr-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-500 appearence-none"
                                        >
                                            {categories.map(cat => (
                                                <option key={cat.id} value={cat.id}>{cat.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-sm mb-2">Visibilidad</label>
                                    <div className="flex gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, isPublic: true })}
                                            className={`flex-1 p-3 rounded-lg border flex items-center justify-center gap-2 transition-all ${formData.isPublic
                                                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400'
                                                    : 'bg-black/30 border-white/10 text-gray-400'
                                                }`}
                                        >
                                            <Globe className="w-4 h-4" />
                                            Público
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, isPublic: false })}
                                            className={`flex-1 p-3 rounded-lg border flex items-center justify-center gap-2 transition-all ${!formData.isPublic
                                                    ? 'bg-orange-500/20 border-orange-500 text-orange-400'
                                                    : 'bg-black/30 border-white/10 text-gray-400'
                                                }`}
                                        >
                                            <Lock className="w-4 h-4" />
                                            Privado
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-400 text-sm mb-2">Contenido (Markdown soportado)</label>
                                <textarea
                                    required
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    className="w-full px-4 py-4 bg-black/30 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 min-h-[400px] font-mono text-sm leading-relaxed"
                                    placeholder="# Introducción\n\nEscribe aquí tu artículo..."
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <Link
                            href="/portal/wiki"
                            className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-colors"
                        >
                            Cancelar
                        </Link>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            <Save className="w-5 h-5" />
                            {submitting ? 'Publicando...' : 'Publicar Artículo'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
