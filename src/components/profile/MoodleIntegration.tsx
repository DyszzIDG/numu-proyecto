'use client';

import { useState, useEffect } from 'react';
import { Shield, GraduationCap, Link as LinkIcon, ExternalLink, AlertCircle, CheckCircle, Loader2, RefreshCw } from 'lucide-react';
import NeonCard from "@/components/ui/NeonCard";
import CyberButton from "@/components/ui/CyberButton";
import AccountLinking from "@/components/moodle/AccountLinking";

interface MoodleIntegrationProps {
    initialMetadata: any;
    userId: string;
    userEmail: string;
}

interface LinkStatus {
    linked: boolean;
    verified: boolean;
    moodleUsername?: string;
    moodleEmail?: string;
    lastSyncAt?: string;
    syncStatus?: string;
}

export default function MoodleIntegration({ initialMetadata, userId, userEmail }: MoodleIntegrationProps) {
    const [linkStatus, setLinkStatus] = useState<LinkStatus | null>(null);
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);
    const [showLinking, setShowLinking] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchLinkStatus();
    }, []);

    const fetchLinkStatus = async () => {
        try {
            const response = await fetch('/api/moodle/link/status');
            if (response.ok) {
                const data = await response.json();
                setLinkStatus(data);
                setShowLinking(!data.linked);
            }
        } catch (err) {
            console.error('Error fetching link status:', err);
            setError('Failed to load Moodle integration status');
        } finally {
            setLoading(false);
        }
    };

    const handleSync = async () => {
        setSyncing(true);
        setError('');

        try {
            const response = await fetch('/api/moodle/sync', {
                method: 'POST',
            });

            if (!response.ok) {
                throw new Error('Sync failed');
            }

            await fetchLinkStatus();
        } catch (err) {
            setError('Failed to sync data');
        } finally {
            setSyncing(false);
        }
    };

    const handleUnlink = async () => {
        if (!confirm('¿Estás seguro de que deseas desvincular tu cuenta de Akademy?')) {
            return;
        }

        try {
            const response = await fetch('/api/moodle/link', {
                method: 'DELETE',
            });

            if (response.ok) {
                setLinkStatus(null);
                setShowLinking(true);
            }
        } catch (err) {
            setError('Failed to unlink account');
        }
    };

    const handleLinkComplete = () => {
        setShowLinking(false);
        fetchLinkStatus();
    };

    if (loading) {
        return (
            <NeonCard glowColor="magenta" className="p-8 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
            </NeonCard>
        );
    }

    if (showLinking || !linkStatus?.linked) {
        return (
            <NeonCard glowColor="red" className="p-0 overflow-hidden">
                <AccountLinking
                    userId={userId}
                    userEmail={userEmail}
                    onLinkComplete={handleLinkComplete}
                />
            </NeonCard>
        );
    }

    return (
        <div className="space-y-6">
            <NeonCard glowColor="magenta" className="p-0 overflow-hidden relative">
                {/* Connection Status Banner */}
                <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/5 border-b border-green-500/20 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <div>
                            <span className="text-green-400 font-bold uppercase tracking-wider text-sm">Perfil Akademy Vinculado</span>
                            <p className="text-xs text-gray-400 mt-0.5">{linkStatus.moodleEmail}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleSync}
                            disabled={syncing}
                            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm flex items-center gap-2 transition-all disabled:opacity-50"
                        >
                            <RefreshCw className={`w-3 h-3 ${syncing ? 'animate-spin' : ''}`} />
                            {syncing ? 'Sincronizando...' : 'Sincronizar'}
                        </button>
                        <button
                            onClick={handleUnlink}
                            className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-sm transition-all"
                        >
                            Desvincular
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    {error && (
                        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400 text-sm">
                            <AlertCircle className="w-4 h-4" />
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-bold text-white mb-1">Estado de Sincronización</h3>
                                <p className="text-sm text-gray-400">Última actualización de datos desde Akademy</p>
                            </div>

                            <div className="space-y-3">
                                <div className="p-4 rounded-xl bg-black/40 border border-white/10">
                                    <span className="text-xs text-gray-500 uppercase">Estado</span>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className={`w-2 h-2 rounded-full ${linkStatus.syncStatus === 'synced' ? 'bg-green-400' :
                                                linkStatus.syncStatus === 'syncing' ? 'bg-yellow-400 animate-pulse' :
                                                    linkStatus.syncStatus === 'error' ? 'bg-red-400' :
                                                        'bg-gray-400'
                                            }`} />
                                        <span className="text-white font-medium capitalize">{linkStatus.syncStatus || 'Pendiente'}</span>
                                    </div>
                                </div>

                                <div className="p-4 rounded-xl bg-black/40 border border-white/10">
                                    <span className="text-xs text-gray-500 uppercase">Última Sincronización</span>
                                    <div className="text-white font-medium mt-1">
                                        {linkStatus.lastSyncAt
                                            ? new Date(linkStatus.lastSyncAt).toLocaleString('es-ES')
                                            : 'Nunca'
                                        }
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <a
                                    href="http://localhost:8080/user/profile.php"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-center font-bold transition-all flex items-center justify-center gap-2"
                                >
                                    <GraduationCap className="w-5 h-5" />
                                    Ir a Akademy
                                </a>
                            </div>
                        </div>

                        {/* Preview Section */}
                        <div className="relative rounded-xl overflow-hidden border border-white/10 bg-black min-h-[200px] flex flex-col justify-center items-center text-center p-6 group">
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-purple-500/10 opacity-30 group-hover:opacity-50 transition-opacity" />
                            <GraduationCap className="w-16 h-16 text-emerald-400 mb-4 relative z-10" />
                            <p className="text-gray-300 text-sm relative z-10 mb-2">
                                Accede a la plataforma completa para ver tu historial académico detallado y certificados.
                            </p>
                            <p className="text-xs text-gray-500 relative z-10">
                                Usuario: <span className="text-emerald-400">{linkStatus.moodleUsername}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </NeonCard>
        </div>
    );
}
