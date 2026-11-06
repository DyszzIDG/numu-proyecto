'use client';

import React from 'react';
import { X } from 'lucide-react';

interface ScanTag {
    id: string;
    name: string;
    color: string;
}

interface TagSelectorProps {
    availableTags: ScanTag[];
    selectedTags: string[];
    onToggleTag: (tagId: string) => void;
    className?: string;
}

export function TagSelector({ availableTags, selectedTags, onToggleTag, className = '' }: TagSelectorProps) {
    return (
        <div className={`space-y-2 ${className}`}>
            <label className="text-sm font-medium text-slate-300">Tags</label>

            {/* Selected Tags */}
            {selectedTags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                    {selectedTags.map(tagId => {
                        const tag = availableTags.find(t => t.id === tagId);
                        if (!tag) return null;

                        return (
                            <button
                                key={tag.id}
                                onClick={() => onToggleTag(tag.id)}
                                className="px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 transition hover:opacity-80"
                                style={{
                                    backgroundColor: `${tag.color}20`,
                                    color: tag.color,
                                    border: `1px solid ${tag.color}40`
                                }}
                            >
                                {tag.name}
                                <X className="w-3 h-3" />
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Available Tags */}
            <div className="flex flex-wrap gap-2">
                {availableTags
                    .filter(tag => !selectedTags.includes(tag.id))
                    .map(tag => (
                        <button
                            key={tag.id}
                            onClick={() => onToggleTag(tag.id)}
                            className="px-3 py-1 rounded-full text-sm font-medium transition hover:opacity-80"
                            style={{
                                backgroundColor: `${tag.color}10`,
                                color: tag.color,
                                border: `1px solid ${tag.color}30`
                            }}
                        >
                            + {tag.name}
                        </button>
                    ))}
            </div>

            {availableTags.length === 0 && (
                <div className="text-sm text-slate-500">
                    No tags available. Create some tags first!
                </div>
            )}
        </div>
    );
}
