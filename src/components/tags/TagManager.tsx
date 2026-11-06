'use client';

import React, { useState } from 'react';
import { Tag, Plus, X, Edit2, Trash2, Check } from 'lucide-react';

interface ScanTag {
    id: string;
    name: string;
    color: string;
    description?: string;
}

interface TagManagerProps {
    tags: ScanTag[];
    onCreateTag: (tag: Omit<ScanTag, 'id'>) => void;
    onUpdateTag: (id: string, tag: Partial<ScanTag>) => void;
    onDeleteTag: (id: string) => void;
}

const PRESET_COLORS = [
    '#3B82F6', // Blue
    '#10B981', // Green
    '#F59E0B', // Yellow
    '#EF4444', // Red
    '#8B5CF6', // Purple
    '#EC4899', // Pink
    '#06B6D4', // Cyan
    '#F97316', // Orange
];

export function TagManager({ tags, onCreateTag, onUpdateTag, onDeleteTag }: TagManagerProps) {
    const [isCreating, setIsCreating] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        color: PRESET_COLORS[0],
        description: ''
    });

    const handleCreate = () => {
        if (!formData.name.trim()) return;

        onCreateTag(formData);
        setFormData({ name: '', color: PRESET_COLORS[0], description: '' });
        setIsCreating(false);
    };

    const handleUpdate = (id: string) => {
        if (!formData.name.trim()) return;

        onUpdateTag(id, formData);
        setEditingId(null);
        setFormData({ name: '', color: PRESET_COLORS[0], description: '' });
    };

    const startEdit = (tag: ScanTag) => {
        setEditingId(tag.id);
        setFormData({
            name: tag.name,
            color: tag.color,
            description: tag.description || ''
        });
    };

    return (
        <div className="space-y-4">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Tag className="w-5 h-5 text-cyan-400" />
                    <h3 className="text-lg font-bold">Tags & Labels</h3>
                </div>
                <button
                    onClick={() => setIsCreating(true)}
                    className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-700 rounded-lg text-sm font-medium transition flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    New Tag
                </button>
            </div>

            {/* Create Form */}
            {isCreating && (
                <div className="p-4 bg-slate-900 border border-slate-700 rounded-lg space-y-3">
                    <input
                        type="text"
                        placeholder="Tag name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-sm focus:border-cyan-500 outline-none"
                        autoFocus
                    />
                    <input
                        type="text"
                        placeholder="Description (optional)"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-sm focus:border-cyan-500 outline-none"
                    />

                    {/* Color Picker */}
                    <div>
                        <label className="text-xs text-slate-400 mb-2 block">Color</label>
                        <div className="flex gap-2">
                            {PRESET_COLORS.map(color => (
                                <button
                                    key={color}
                                    onClick={() => setFormData({ ...formData, color })}
                                    className={`w-8 h-8 rounded-full transition ${formData.color === color ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900' : ''
                                        }`}
                                    style={{ backgroundColor: color }}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={handleCreate}
                            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded font-medium transition flex items-center gap-2"
                        >
                            <Check className="w-4 h-4" />
                            Create
                        </button>
                        <button
                            onClick={() => {
                                setIsCreating(false);
                                setFormData({ name: '', color: PRESET_COLORS[0], description: '' });
                            }}
                            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded font-medium transition"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Tags List */}
            <div className="space-y-2">
                {tags.map(tag => (
                    <div
                        key={tag.id}
                        className="p-3 bg-slate-900 border border-slate-800 rounded-lg hover:border-slate-700 transition"
                    >
                        {editingId === tag.id ? (
                            // Edit Mode
                            <div className="space-y-3">
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-sm focus:border-cyan-500 outline-none"
                                />
                                <input
                                    type="text"
                                    placeholder="Description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-sm focus:border-cyan-500 outline-none"
                                />
                                <div className="flex gap-2">
                                    {PRESET_COLORS.map(color => (
                                        <button
                                            key={color}
                                            onClick={() => setFormData({ ...formData, color })}
                                            className={`w-6 h-6 rounded-full transition ${formData.color === color ? 'ring-2 ring-white' : ''
                                                }`}
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleUpdate(tag.id)}
                                        className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-700 rounded text-sm font-medium transition"
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={() => {
                                            setEditingId(null);
                                            setFormData({ name: '', color: PRESET_COLORS[0], description: '' });
                                        }}
                                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded text-sm font-medium transition"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            // View Mode
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-4 h-4 rounded-full"
                                        style={{ backgroundColor: tag.color }}
                                    />
                                    <div>
                                        <div className="font-medium">{tag.name}</div>
                                        {tag.description && (
                                            <div className="text-xs text-slate-400">{tag.description}</div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => startEdit(tag)}
                                        className="p-1.5 hover:bg-slate-800 rounded transition"
                                    >
                                        <Edit2 className="w-4 h-4 text-slate-400" />
                                    </button>
                                    <button
                                        onClick={() => onDeleteTag(tag.id)}
                                        className="p-1.5 hover:bg-slate-800 rounded transition"
                                    >
                                        <Trash2 className="w-4 h-4 text-red-400" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {tags.length === 0 && !isCreating && (
                <div className="text-center py-8 text-slate-500">
                    No tags yet. Create one to get started!
                </div>
            )}

        </div>
    );
}
