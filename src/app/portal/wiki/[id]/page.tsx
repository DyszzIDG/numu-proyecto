'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, User, Calendar, Tag, Trash2, Edit } from 'lucide-react';
import { getEmployeeSession } from '@/lib/auth/session';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

export default function WikiArticlePage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [article, setArticle] = useState<any>(null);
    const [session, setSession] = useState<any>(null);

    useEffect(() => {
        const empSession = getEmployeeSession();
        if (!empSession) {
            router.push('/portal/login');
            return;
        }
        setSession(empSession);
        fetchArticle();
    }, []);

    const fetchArticle = async () => {
        try {
            const response = await fetch(`/api/portal/wiki/${params.id}`);
            const data = await response.json();

            if (data.success) {
                setArticle(data.article);
            } else {
                router.push('/portal/wiki');
            }
        } catch (error) {
            console.error('Error fetching article:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading || !article) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
                <p className="text-gray-400">Cargando artículo...</p>
            </div>
        );
    }

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

                    <div className="flex items-start justify-between">
                        <h1 className="text-4xl font-bold text-white mb-4">{article.title}</h1>
                        {/* Add Edit/Delete buttons if author or admin */}
                    </div>

                    <div className="flex items-center gap-6 text-sm text-gray-400 border-b border-white/10 pb-6">
                        <div className="flex items-center gap-2">
                            <Tag className="w-4 h-4 text-cyan-400" />
                            <span className="capitalize">{article.category}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-cyan-400" />
                            <span>{article.author.firstName} {article.author.lastName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-cyan-400" />
                            <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-8">
                    <div className="prose prose-invert max-w-none">
                        {/* Basic rendering, could use a proper markdown renderer */}
                        <div className="whitespace-pre-wrap text-gray-300 leading-relaxed">
                            {article.content}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
