'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Book, Search, Plus, Filter, FileText, User, ArrowLeft } from 'lucide-react';
import { getEmployeeSession } from '@/lib/auth/session';
import Link from 'next/link';

interface WikiArticle {
    id: string;
    title: string;
    content: string;
    category: string;
    createdAt: string;
    author: {
        firstName: string;
        lastName: string;
    };
}

export default function WikiPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [articles, setArticles] = useState<WikiArticle[]>([]);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('all');

    useEffect(() => {
        const session = getEmployeeSession();
        if (!session) {
            router.push('/portal/login');
            return;
        }
        fetchArticles();
    }, [category, search]); // Re-fetch when filters change (debounce search ideally)

    // Debounce search effect (simple version)
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchArticles();
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const fetchArticles = async () => {
        try {
            const params = new URLSearchParams();
            if (category !== 'all') params.append('category', category);
            if (search) params.append('search', search);

            const response = await fetch(`/api/portal/wiki?${params.toString()}`);
            const data = await response.json();

            if (data.success) {
                setArticles(data.articles);
            }
        } catch (error) {
            console.error('Error fetching wiki:', error);
        } finally {
            setLoading(false);
        }
    };

    const categories = [
        { id: 'all', label: 'Todas' },
        { id: 'procedimientos', label: 'Procedimientos' },
        { id: 'onboarding', label: 'Onboarding' },
        { id: 'seguridad', label: 'Seguridad' },
        { id: 'rrhh', label: 'RRHH' },
        { id: 'tecnico', label: 'Técnico' }
    ];

    if (loading && articles.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
                <p className="text-gray-400">Cargando Wiki...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <Link
                        href="/portal/dashboard"
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Volver al Dashboard
                    </Link>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">Base de Conocimiento</h1>
                            <p className="text-gray-400">Documentación y recursos internos</p>
                        </div>
                        <Link
                            href="/portal/wiki/nuevo"
                            className="flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-bold rounded-xl transition-all transform hover:scale-105"
                        >
                            <Plus className="w-5 h-5" />
                            Nuevo Artículo
                        </Link>
                    </div>
                </div>

                {/* Filters & Search */}
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4 mb-8">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Buscar en la wiki..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-black/30 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                            />
                        </div>
                        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 custom-scrollbar">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setCategory(cat.id)}
                                    className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${category === cat.id
                                            ? 'bg-cyan-500 text-white'
                                            : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                        }`}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Articles Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {articles.map((article) => (
                        <Link
                            key={article.id}
                            href={`/portal/wiki/${article.id}`}
                            className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 group hover:bg-white/10 transition-all hover:-translate-y-1"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 bg-gray-800 rounded-lg">
                                    <Book className="w-6 h-6 text-cyan-400" />
                                </div>
                                <span className="px-3 py-1 bg-white/5 rounded-full text-xs font-semibold text-gray-400 capitalize">
                                    {article.category}
                                </span>
                            </div>

                            <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-cyan-400 transition-colors">
                                {article.title}
                            </h3>

                            <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                                {article.content}
                            </p>

                            <div className="flex items-center justify-between text-xs text-gray-500 border-t border-white/5 pt-4">
                                <div className="flex items-center gap-2">
                                    <User className="w-3 h-3" />
                                    <span>{article.author.firstName} {article.author.lastName}</span>
                                </div>
                                <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                            </div>
                        </Link>
                    ))}
                </div>

                {articles.length === 0 && !loading && (
                    <div className="text-center py-12">
                        <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">No se encontraron artículos</h3>
                        <p className="text-gray-400">Intenta con otra búsqueda o categoría</p>
                    </div>
                )}
            </div>
        </div>
    );
}
