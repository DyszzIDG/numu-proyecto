'use client';

import React, { useState } from 'react';
import { Share2, Copy, Check, Clock, Eye, Link as LinkIcon } from 'lucide-react';

interface ShareDialogProps {
    scanId: string;
    onClose: () => void;
}

export function ShareDialog({ scanId, onClose }: ShareDialogProps) {
    const [loading, setLoading] = useState(false);
    const [shareUrl, setShareUrl] = useState('');
    const [copied, setCopied] = useState(false);
    const [expiresInHours, setExpiresInHours] = useState(24);
    const [maxViews, setMaxViews] = useState<number | null>(null);

    const handleCreateLink = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/share/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    scanId,
                    expiresInHours,
                    maxViews
                })
            });

            if (!response.ok) throw new Error('Failed to create share link');

            const data = await response.json();
            setShareUrl(data.shareLink.url);
        } catch (error) {
            console.error('Error creating share link:', error);
            alert('Error creating share link');
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-in fade-in">
            <div className="bg-slate-900 rounded-lg border border-slate-800 max-w-lg w-full">

                {/* Header */}
                <div className="p-6 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-cyan-500/20 rounded-lg">
                            <Share2 className="w-5 h-5 text-cyan-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">Share Scan Results</h2>
                            <p className="text-sm text-slate-400">Create a shareable link</p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">

                    {!shareUrl ? (
                        <>
                            {/* Expiration */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    <Clock className="w-4 h-4 inline mr-2" />
                                    Expires in
                                </label>
                                <select
                                    value={expiresInHours}
                                    onChange={(e) => setExpiresInHours(Number(e.target.value))}
                                    className="w-full px-4 py-2 bg-slate-950 border border-slate-700 rounded-lg focus:border-cyan-500 outline-none"
                                >
                                    <option value={1}>1 hour</option>
                                    <option value={6}>6 hours</option>
                                    <option value={24}>24 hours</option>
                                    <option value={72}>3 days</option>
                                    <option value={168}>1 week</option>
                                </select>
                            </div>

                            {/* Max Views */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    <Eye className="w-4 h-4 inline mr-2" />
                                    Maximum views (optional)
                                </label>
                                <input
                                    type="number"
                                    placeholder="Unlimited"
                                    value={maxViews || ''}
                                    onChange={(e) => setMaxViews(e.target.value ? Number(e.target.value) : null)}
                                    className="w-full px-4 py-2 bg-slate-950 border border-slate-700 rounded-lg focus:border-cyan-500 outline-none"
                                    min="1"
                                />
                            </div>

                            {/* Create Button */}
                            <button
                                onClick={handleCreateLink}
                                disabled={loading}
                                className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 disabled:from-slate-700 disabled:to-slate-700 rounded-lg font-bold transition flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <LinkIcon className="w-5 h-5" />
                                        Create Share Link
                                    </>
                                )}
                            </button>
                        </>
                    ) : (
                        <>
                            {/* Share URL */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Share URL</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={shareUrl}
                                        readOnly
                                        className="flex-1 px-4 py-2 bg-slate-950 border border-slate-700 rounded-lg font-mono text-sm"
                                    />
                                    <button
                                        onClick={handleCopy}
                                        className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg transition flex items-center gap-2"
                                    >
                                        {copied ? (
                                            <>
                                                <Check className="w-4 h-4" />
                                                Copied!
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="w-4 h-4" />
                                                Copy
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg space-y-2 text-sm">
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-400">Expires in:</span>
                                    <span className="font-medium">{expiresInHours} hours</span>
                                </div>
                                {maxViews && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-400">Max views:</span>
                                        <span className="font-medium">{maxViews}</span>
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-800">
                    <button
                        onClick={onClose}
                        className="w-full py-2 bg-slate-800 hover:bg-slate-700 rounded-lg font-medium transition"
                    >
                        {shareUrl ? 'Done' : 'Cancel'}
                    </button>
                </div>

            </div>
        </div>
    );
}
