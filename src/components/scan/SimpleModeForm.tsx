'use client';

import React, { useState } from 'react';
import { Zap, Settings, ChevronDown } from 'lucide-react';

interface ScanTemplate {
    id: string;
    name: string;
    description: string;
    depth: 'quick' | 'normal' | 'deep';
    features: string[];
}

interface SimpleModeFormProps {
    onSubmit: (config: any) => void;
    templates: ScanTemplate[];
}

const PREDEFINED_TEMPLATES: ScanTemplate[] = [
    {
        id: 'web-basic',
        name: 'Escaneo Web Básico',
        description: 'Análisis rápido de puertos y servicios web comunes',
        depth: 'quick',
        features: ['ports', 'http', 'ssl']
    },
    {
        id: 'full-analysis',
        name: 'Análisis Completo',
        description: 'Escaneo exhaustivo con todas las herramientas',
        depth: 'deep',
        features: ['ports', 'http', 'ssl', 'dns', 'vulnerabilities', 'owasp']
    },
    {
        id: 'ports-only',
        name: 'Solo Puertos',
        description: 'Escaneo rápido de puertos abiertos',
        depth: 'quick',
        features: ['ports']
    },
    {
        id: 'critical-vulns',
        name: 'Vulnerabilidades Críticas',
        description: 'Búsqueda enfocada en vulnerabilidades de alta severidad',
        depth: 'normal',
        features: ['vulnerabilities', 'cve', 'exploits']
    },
    {
        id: 'owasp-top10',
        name: 'OWASP Top 10',
        description: 'Verificación de las 10 vulnerabilidades más críticas',
        depth: 'normal',
        features: ['owasp', 'xss', 'sqli', 'csrf']
    }
];

export function SimpleModeForm({ onSubmit, templates = PREDEFINED_TEMPLATES }: SimpleModeFormProps) {
    const [selectedTemplate, setSelectedTemplate] = useState<string>('web-basic');
    const [target, setTarget] = useState('');
    const [depth, setDepth] = useState<'quick' | 'normal' | 'deep'>('normal');
    const [features, setFeatures] = useState({
        ssl: true,
        owasp: false,
        dns: false,
        vulnerabilities: false
    });

    const currentTemplate = templates.find(t => t.id === selectedTemplate);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            mode: 'simple',
            template: selectedTemplate,
            target,
            depth,
            features: Object.entries(features)
                .filter(([_, enabled]) => enabled)
                .map(([feature]) => feature)
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">

            {/* Template Selector */}
            <div>
                <label className="block text-sm font-medium mb-2">
                    <Zap className="w-4 h-4 inline mr-2" />
                    Plantilla de Escaneo
                </label>
                <select
                    value={selectedTemplate}
                    onChange={(e) => setSelectedTemplate(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:border-cyan-500 outline-none"
                >
                    {templates.map(template => (
                        <option key={template.id} value={template.id}>
                            {template.name}
                        </option>
                    ))}
                </select>
                {currentTemplate && (
                    <p className="text-sm text-slate-400 mt-2">{currentTemplate.description}</p>
                )}
            </div>

            {/* Target Input */}
            <div>
                <label className="block text-sm font-medium mb-2">
                    Objetivo (IP o Dominio)
                </label>
                <input
                    type="text"
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    placeholder="ejemplo.com o 192.168.1.1"
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:border-cyan-500 outline-none"
                    required
                />
            </div>

            {/* Depth Selector */}
            <div>
                <label className="block text-sm font-medium mb-2">
                    Profundidad del Escaneo
                </label>
                <div className="grid grid-cols-3 gap-3">
                    <button
                        type="button"
                        onClick={() => setDepth('quick')}
                        className={`p-3 rounded-lg border transition ${depth === 'quick'
                                ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400'
                                : 'bg-slate-900 border-slate-700 hover:border-slate-600'
                            }`}
                    >
                        <div className="font-semibold">Rápido</div>
                        <div className="text-xs text-slate-400">~2-5 min</div>
                    </button>
                    <button
                        type="button"
                        onClick={() => setDepth('normal')}
                        className={`p-3 rounded-lg border transition ${depth === 'normal'
                                ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400'
                                : 'bg-slate-900 border-slate-700 hover:border-slate-600'
                            }`}
                    >
                        <div className="font-semibold">Normal</div>
                        <div className="text-xs text-slate-400">~5-15 min</div>
                    </button>
                    <button
                        type="button"
                        onClick={() => setDepth('deep')}
                        className={`p-3 rounded-lg border transition ${depth === 'deep'
                                ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400'
                                : 'bg-slate-900 border-slate-700 hover:border-slate-600'
                            }`}
                    >
                        <div className="font-semibold">Profundo</div>
                        <div className="text-xs text-slate-400">~15-60 min</div>
                    </button>
                </div>
            </div>

            {/* Feature Checkboxes */}
            <div>
                <label className="block text-sm font-medium mb-3">
                    Características Adicionales
                </label>
                <div className="space-y-2">
                    <label className="flex items-center gap-3 p-3 bg-slate-900 border border-slate-700 rounded-lg hover:border-slate-600 cursor-pointer transition">
                        <input
                            type="checkbox"
                            checked={features.ssl}
                            onChange={(e) => setFeatures({ ...features, ssl: e.target.checked })}
                            className="w-4 h-4 rounded border-slate-600 text-cyan-500 focus:ring-cyan-500"
                        />
                        <div className="flex-1">
                            <div className="font-medium">Análisis SSL/TLS</div>
                            <div className="text-xs text-slate-400">Verificar certificados y configuración</div>
                        </div>
                    </label>

                    <label className="flex items-center gap-3 p-3 bg-slate-900 border border-slate-700 rounded-lg hover:border-slate-600 cursor-pointer transition">
                        <input
                            type="checkbox"
                            checked={features.owasp}
                            onChange={(e) => setFeatures({ ...features, owasp: e.target.checked })}
                            className="w-4 h-4 rounded border-slate-600 text-cyan-500 focus:ring-cyan-500"
                        />
                        <div className="flex-1">
                            <div className="font-medium">Verificar OWASP Top 10</div>
                            <div className="text-xs text-slate-400">Buscar vulnerabilidades web comunes</div>
                        </div>
                    </label>

                    <label className="flex items-center gap-3 p-3 bg-slate-900 border border-slate-700 rounded-lg hover:border-slate-600 cursor-pointer transition">
                        <input
                            type="checkbox"
                            checked={features.dns}
                            onChange={(e) => setFeatures({ ...features, dns: e.target.checked })}
                            className="w-4 h-4 rounded border-slate-600 text-cyan-500 focus:ring-cyan-500"
                        />
                        <div className="flex-1">
                            <div className="font-medium">Análisis DNS</div>
                            <div className="text-xs text-slate-400">Enumerar subdominios y registros</div>
                        </div>
                    </label>

                    <label className="flex items-center gap-3 p-3 bg-slate-900 border border-slate-700 rounded-lg hover:border-slate-600 cursor-pointer transition">
                        <input
                            type="checkbox"
                            checked={features.vulnerabilities}
                            onChange={(e) => setFeatures({ ...features, vulnerabilities: e.target.checked })}
                            className="w-4 h-4 rounded border-slate-600 text-cyan-500 focus:ring-cyan-500"
                        />
                        <div className="flex-1">
                            <div className="font-medium">Escaneo de Vulnerabilidades</div>
                            <div className="text-xs text-slate-400">Buscar CVEs conocidos</div>
                        </div>
                    </label>
                </div>
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={!target}
                className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 disabled:from-slate-700 disabled:to-slate-600 disabled:cursor-not-allowed rounded-lg font-semibold text-lg transition flex items-center justify-center gap-2"
            >
                <Zap className="w-5 h-5" />
                Iniciar Escaneo
            </button>

        </form>
    );
}
