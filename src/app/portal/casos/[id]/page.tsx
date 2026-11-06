'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Clock, User, Building, Calendar, MessageSquare, Send, Paperclip, File, Download, Loader2 } from 'lucide-react';
import { getEmployeeSession } from '@/lib/auth/session';
import Link from 'next/link';

interface CaseDetail {
    id: string;
    title: string;
    description: string;
    status: string;
    priority: string;
    type: string;
    createdAt: string;
    updatedAt: string;
    resolvedAt?: string;
    company: {
        name: string;
        industry: string;
    };
    assignments: Array<{
        employee: {
            firstName: string;
            lastName: string;
            email: string;
        };
    }>;
    comments: Array<{
        id: string;
        comment: string;
        createdAt: string;
        employee: {
            firstName: string;
            lastName: string;
        };
    }>;
    attachments: Array<{
        id: string;
        filename: string;
        url: string;
        size: number;
        uploadedAt: string;
    }>;
}

export default function CaseDetailPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [session, setSession] = useState<any>(null);
    const [caseData, setCaseData] = useState<CaseDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [newStatus, setNewStatus] = useState('');

    // Attachment state
    const [uploadingFile, setUploadingFile] = useState(false);

    useEffect(() => {
        const employeeSession = getEmployeeSession();
        if (!employeeSession) {
            router.push('/portal/login');
            return;
        }
        setSession(employeeSession);
        fetchCase();
    }, []);

    const fetchCase = async () => {
        try {
            const response = await fetch(`/api/portal/cases/${params.id}`);
            const data = await response.json();

            if (data.success) {
                setCaseData(data.case);
                setNewStatus(data.case.status);
            }
        } catch (error) {
            console.error('Error fetching case:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddComment = async () => {
        if (!newComment.trim() || !session) return;

        setSubmitting(true);
        try {
            const response = await fetch(`/api/portal/cases/${params.id}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    employeeId: session.id,
                    comment: newComment
                })
            });

            const data = await response.json();
            if (data.success) {
                setNewComment('');
                fetchCase();
            }
        } catch (error) {
            console.error('Error adding comment:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleUpdateStatus = async () => {
        if (!newStatus || newStatus === caseData?.status) return;

        try {
            const response = await fetch(`/api/portal/cases/${params.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });

            const data = await response.json();
            if (data.success) {
                fetchCase();
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingFile(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(`/api/portal/cases/${params.id}/attachments`, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            if (data.success) {
                fetchCase();
            } else {
                alert('Error al subir archivo');
            }
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Error al subir archivo');
        } finally {
            setUploadingFile(false);
            // Reset input
            e.target.value = '';
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'open': return 'bg-blue-500/20 text-blue-300';
            case 'in_progress': return 'bg-yellow-500/20 text-yellow-300';
            case 'resolved': return 'bg-green-500/20 text-green-300';
            case 'closed': return 'bg-gray-500/20 text-gray-300';
            default: return 'bg-gray-500/20 text-gray-300';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'open': return 'Abierto';
            case 'in_progress': return 'En Progreso';
            case 'resolved': return 'Resuelto';
            case 'closed': return 'Cerrado';
            default: return status;
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'critical': return 'text-red-400';
            case 'high': return 'text-orange-400';
            case 'medium': return 'text-yellow-400';
            case 'low': return 'text-blue-400';
            default: return 'text-gray-400';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
                <p className="text-gray-400">Cargando...</p>
            </div>
        );
    }

    if (!caseData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
                <p className="text-gray-400">Caso no encontrado</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <Link
                        href="/portal/casos"
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Volver a Casos
                    </Link>
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">{caseData.title}</h1>
                            <div className="flex items-center gap-3">
                                <span className={`px-3 py-1 rounded text-sm ${getStatusColor(caseData.status)}`}>
                                    {getStatusLabel(caseData.status)}
                                </span>
                                <span className={`text-sm font-semibold ${getPriorityColor(caseData.priority)}`}>
                                    Prioridad: {caseData.priority.toUpperCase()}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Description */}
                        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                            <h2 className="text-xl font-bold text-white mb-4">Descripción</h2>
                            <p className="text-gray-300 whitespace-pre-wrap">{caseData.description}</p>
                        </div>

                        {/* Attachments */}
                        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Paperclip className="w-5 h-5 text-gray-400" />
                                    Archivos Adjuntos
                                </h2>
                                <label className={`flex items-center gap-2 px-3 py-1.5 bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 rounded-lg cursor-pointer transition-colors text-sm border border-cyan-500/30 ${uploadingFile ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                    {uploadingFile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Paperclip className="w-4 h-4" />}
                                    {uploadingFile ? 'Subiendo...' : 'Adjuntar'}
                                    <input type="file" className="hidden" onChange={handleFileUpload} disabled={uploadingFile} />
                                </label>
                            </div>

                            {caseData.attachments && caseData.attachments.length > 0 ? (
                                <div className="space-y-2">
                                    {caseData.attachments.map((file) => (
                                        <div key={file.id} className="flex items-center justify-between p-3 bg-black/30 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-gray-800 rounded text-gray-400">
                                                    <File className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-white">{file.filename}</p>
                                                    <p className="text-xs text-gray-500">{formatFileSize(file.size)} • {new Date(file.uploadedAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <a
                                                href={file.url}
                                                download
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded transition-colors"
                                            >
                                                <Download className="w-4 h-4" />
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-sm italic">No hay archivos adjuntos.</p>
                            )}
                        </div>

                        {/* Comments */}
                        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                            <h2 className="text-xl font-bold text-white mb-4">Comentarios ({caseData.comments.length})</h2>
                            <div className="space-y-4 mb-6">
                                {caseData.comments.length === 0 ? (
                                    <p className="text-gray-400 text-center py-4">No hay comentarios aún</p>
                                ) : (
                                    caseData.comments.map((comment) => (
                                        <div key={comment.id} className="p-4 bg-black/30 rounded-lg border border-white/10">
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <User className="w-4 h-4 text-cyan-400" />
                                                    <span className="text-white font-semibold">
                                                        {comment.employee.firstName} {comment.employee.lastName}
                                                    </span>
                                                </div>
                                                <span className="text-xs text-gray-500">
                                                    {new Date(comment.createdAt).toLocaleString()}
                                                </span>
                                            </div>
                                            <p className="text-gray-300">{comment.comment}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                                    placeholder="Agregar un comentario..."
                                    className="flex-1 px-4 py-2 bg-black/30 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                                    disabled={submitting}
                                />
                                <button
                                    onClick={handleAddComment}
                                    disabled={submitting || !newComment.trim()}
                                    className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    <Send className="w-4 h-4" />
                                    Enviar
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                            <h3 className="text-lg font-bold text-white mb-4">Actualizar Estado</h3>
                            <select
                                value={newStatus}
                                onChange={(e) => setNewStatus(e.target.value)}
                                className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-500 mb-3"
                            >
                                <option value="open">Abierto</option>
                                <option value="in_progress">En Progreso</option>
                                <option value="resolved">Resuelto</option>
                                <option value="closed">Cerrado</option>
                            </select>
                            <button
                                onClick={handleUpdateStatus}
                                disabled={newStatus === caseData.status}
                                className="w-full px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Actualizar
                            </button>
                        </div>

                        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                            <h3 className="text-lg font-bold text-white mb-4">Información del Caso</h3>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-gray-500 text-sm">Empresa</p>
                                    <div className="flex items-center gap-2 text-white">
                                        <Building className="w-4 h-4" />
                                        <span>{caseData.company.name}</span>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm">Industria</p>
                                    <p className="text-white">{caseData.company.industry}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm">Creado</p>
                                    <div className="flex items-center gap-2 text-white">
                                        <Calendar className="w-4 h-4" />
                                        <span>{new Date(caseData.createdAt).toLocaleString()}</span>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm">Última actualización</p>
                                    <div className="flex items-center gap-2 text-white">
                                        <Clock className="w-4 h-4" />
                                        <span>{new Date(caseData.updatedAt).toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                            <h3 className="text-lg font-bold text-white mb-4">Asignado a</h3>
                            <div className="space-y-2">
                                {caseData.assignments.map((assignment, index) => (
                                    <div key={index} className="flex items-center gap-2 text-white">
                                        <User className="w-4 h-4 text-cyan-400" />
                                        <span>{assignment.employee.firstName} {assignment.employee.lastName}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
