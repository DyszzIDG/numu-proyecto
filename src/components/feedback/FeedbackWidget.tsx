'use client';

import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, MessageSquare, Send } from 'lucide-react';

interface FeedbackWidgetProps {
    scanId: string;
    commandGenerated: string;
    onFeedbackSubmitted?: () => void;
}

export function FeedbackWidget({ scanId, commandGenerated, onFeedbackSubmitted }: FeedbackWidgetProps) {
    const [rating, setRating] = useState<'positive' | 'negative' | null>(null);
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState('');
    const [correction, setCorrection] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleRating = (newRating: 'positive' | 'negative') => {
        setRating(newRating);
        if (newRating === 'negative') {
            setShowComments(true);
        }
    };

    const handleSubmit = async () => {
        try {
            const response = await fetch('/api/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    scanId,
                    commandGenerated,
                    userRating: rating,
                    userCorrection: correction || undefined,
                    comments: comments || undefined
                })
            });

            if (response.ok) {
                setSubmitted(true);
                onFeedbackSubmitted?.();
                setTimeout(() => {
                    setSubmitted(false);
                    setRating(null);
                    setShowComments(false);
                    setComments('');
                    setCorrection('');
                }, 3000);
            }
        } catch (error) {
            console.error('Error submitting feedback:', error);
        }
    };

    if (submitted) {
        return (
            <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-center">
                <div className="text-green-400 font-medium mb-1">✓ Thank you for your feedback!</div>
                <div className="text-sm text-slate-400">Your input helps improve the AI</div>
            </div>
        );
    }

    return (
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg">

            {/* Rating Buttons */}
            <div className="flex items-center gap-3 mb-3">
                <span className="text-sm text-slate-400">Was this command helpful?</span>
                <div className="flex gap-2">
                    <button
                        onClick={() => handleRating('positive')}
                        className={`p-2 rounded-lg transition ${rating === 'positive'
                                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                : 'bg-slate-800 hover:bg-slate-700 text-slate-400'
                            }`}
                    >
                        <ThumbsUp className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => handleRating('negative')}
                        className={`p-2 rounded-lg transition ${rating === 'negative'
                                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                : 'bg-slate-800 hover:bg-slate-700 text-slate-400'
                            }`}
                    >
                        <ThumbsDown className="w-4 h-4" />
                    </button>
                </div>
                {!showComments && rating && (
                    <button
                        onClick={() => setShowComments(true)}
                        className="ml-auto text-sm text-cyan-400 hover:text-cyan-300 transition flex items-center gap-1"
                    >
                        <MessageSquare className="w-4 h-4" />
                        Add details
                    </button>
                )}
            </div>

            {/* Comments Section */}
            {showComments && (
                <div className="space-y-3 pt-3 border-t border-slate-800">

                    {rating === 'negative' && (
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                What should the correct command be?
                            </label>
                            <input
                                type="text"
                                value={correction}
                                onChange={(e) => setCorrection(e.target.value)}
                                placeholder="e.g., nmap -sV -p 80,443 target.com"
                                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm focus:border-cyan-500 outline-none font-mono"
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Additional comments (optional)
                        </label>
                        <textarea
                            value={comments}
                            onChange={(e) => setComments(e.target.value)}
                            placeholder="Tell us more about your experience..."
                            rows={3}
                            className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm focus:border-cyan-500 outline-none resize-none"
                        />
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={!rating}
                        className="w-full py-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-700 disabled:cursor-not-allowed rounded-lg font-medium transition flex items-center justify-center gap-2"
                    >
                        <Send className="w-4 h-4" />
                        Submit Feedback
                    </button>

                </div>
            )}

        </div>
    );
}
