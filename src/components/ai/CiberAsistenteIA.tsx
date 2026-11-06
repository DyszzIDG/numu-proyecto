'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Sparkles, Loader2, Terminal, AlertCircle, CheckCircle2, Copy, Play,
    Edit3, ChevronDown, Clock, Zap, Shield, Target, Globe, Laptop,
    XCircle, Scale, Star, History, Search, X, TrendingUp, Award,
    FileDown, FileText, Keyboard, Sun, Moon, Workflow, Users, Lightbulb
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useTheme } from '@/components/providers/ThemeProvider';
import { WorkflowBuilder } from '@/components/workflow/WorkflowBuilder';
import { MultiTargetScanner } from '@/components/scanner/MultiTargetScanner';
import { ExportMenu } from '@/components/export/ExportMenu';
import { ShortcutsHelp } from '@/components/shortcuts/ShortcutsHelp';
import { WorkflowEngine } from '@/lib/ai/workflow-engine';
import { SECURITY_TOOLS, TOOL_CATEGORIES, type SecurityTool } from '@/lib/tools/security-tools-db';

interface ParsedIntent {
    tool: string;
    target: string | null;
    scanType: string;
    flags: string[];
    confidence: number;
    explanation: string;
    command?: string;
}

interface ValidationState {
    valid: boolean | null;
    message: string;
}

interface HistoryItem {
    id: string;
    prompt: string;
    tool: string;
    target: string;
    status: 'success' | 'failed';
    createdAt: Date;
}

interface FavoriteConfig {
    id: string;
    name: string;
    description: string;
    tool: string;
    prompt: string;
    target: string;
}

interface ToolComparisonData {
    tool: string;
    category: string;
    speed: number;
    accuracy: number;
    ease: number;
    duration: string;
    credits: number;
    pros: string[];
}

const PROMPT_CATEGORIES = {
    'Red': [
        { icon: '🗺️', text: 'Escanear puertos de {target}', tool: 'nmap', category: 'Red' },
        { icon: '⚡', text: 'Escaneo rápido de red {target}', tool: 'nmap', category: 'Red' },
        { icon: '🎯', text: 'Escaneo completo de servicios {target}', tool: 'nmap', category: 'Red' },
    ],
    'Web': [
        { icon: '🕷️', text: 'Buscar vulnerabilidades web en {target}', tool: 'nikto', category: 'Web' },
        { icon: '🔒', text: 'Analizar certificado SSL de {target}', tool: 'testssl', category: 'Web' },
        { icon: '📁', text: 'Encontrar directorios ocultos en {target}', tool: 'feroxbuster', category: 'Web' },
    ],
    'Database': [
        { icon: '💉', text: 'Buscar SQL injection en {target}', tool: 'sqlmap', category: 'Database' },
        { icon: '🔓', text: 'Probar credenciales débiles en {target}', tool: 'hydra', category: 'Database' },
    ],
    'OSINT': [
        { icon: '🌾', text: 'Encontrar emails de {target}', tool: 'theharvester', category: 'OSINT' },
        { icon: '🔎', text: 'Buscar subdominios de {target}', tool: 'subfinder', category: 'OSINT' },
        { icon: '📸', text: 'Capturar screenshot de {target}', tool: 'gowitness', category: 'OSINT' },
    ],
    'CMS': [
        { icon: '🔌', text: 'Escanear WordPress en {target}', tool: 'wpscan', category: 'CMS' },
        { icon: '🎨', text: 'Detectar tecnologías de {target}', tool: 'whatweb', category: 'CMS' },
    ]
};

const TOOL_COMPARISON_DATA: ToolComparisonData[] = [
    {
        tool: 'nmap',
        category: 'Escáner de Red',
        speed: 3,
        accuracy: 5,
        ease: 4,
        duration: '10-15 min',
        credits: 5,
        pros: ['Muy preciso', 'Detección de servicios', 'Ampliamente usado']
    },
    {
        tool: 'nikto',
        category: 'Escáner Web',
        speed: 3,
        accuracy: 4,
        ease: 5,
        duration: '5-10 min',
        credits: 4,
        pros: ['Fácil de usar', 'Buena cobertura', 'Rápido']
    },
    {
        tool: 'nuclei',
        category: 'Escáner de Vulnerabilidades',
        speed: 4,
        accuracy: 5,
        ease: 4,
        duration: '5-8 min',
        credits: 6,
        pros: ['Moderno', 'Templates actualizados', 'Muy rápido']
    }
];

// Tool-specific prompts
const TOOL_SPECIFIC_PROMPTS: Record<string, Array<{ icon: string; text: string }>> = {
    amass: [
        { icon: '🌾', text: 'Enumerar subdominios de {target}' },
        { icon: '🔍', text: 'Reconocimiento pasivo de {target}' },
        { icon: '🗺️', text: 'Mapear superficie de ataque de {target}' }
    ],
    nmap: [
        { icon: '🗺️', text: 'Escanear puertos de {target}' },
        { icon: '⚡', text: 'Escaneo rápido de {target}' },
        { icon: '🎯', text: 'Escaneo completo de servicios {target}' }
    ],
    nikto: [
        { icon: '🕷️', text: 'Buscar vulnerabilidades web en {target}' },
        { icon: '🔍', text: 'Analizar servidor web {target}' },
        { icon: '⚠️', text: 'Detectar archivos peligrosos en {target}' }
    ],
    nuclei: [
        { icon: '⚛️', text: 'Escanear CVEs en {target}' },
        { icon: '🎯', text: 'Buscar vulnerabilidades críticas en {target}' },
        { icon: '📋', text: 'Ejecutar templates en {target}' }
    ],
    sublist3r: [
        { icon: '🔎', text: 'Buscar subdominios de {target}' },
        { icon: '🌐', text: 'Enumerar subdominios con brute force {target}' }
    ],
    dnsrecon: [
        { icon: '📡', text: 'Reconocimiento DNS de {target}' },
        { icon: '🔄', text: 'Intentar transferencia de zona {target}' }
    ],
    gobuster: [
        { icon: '📁', text: 'Buscar directorios ocultos en {target}' },
        { icon: '🔨', text: 'Fuerza bruta de rutas en {target}' }
    ],
    whatweb: [
        { icon: '🎨', text: 'Detectar tecnologías de {target}' },
        { icon: '🔍', text: 'Identificar CMS de {target}' }
    ],
    wpscan: [
        { icon: '🔌', text: 'Escanear WordPress en {target}' },
        { icon: '👥', text: 'Enumerar usuarios de WordPress en {target}' },
        { icon: '🧩', text: 'Detectar plugins vulnerables en {target}' }
    ],
    subfinder: [
        { icon: '🔎', text: 'Buscar subdominios de {target}' },
        { icon: '🌐', text: 'Descubrimiento pasivo de subdominios {target}' }
    ]
};

export default function CiberAsistenteIA() {
    const router = useRouter();
    const [prompt, setPrompt] = useState('');
    const [target, setTarget] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<ParsedIntent | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [editMode, setEditMode] = useState(false);
    const [editedCommand, setEditedCommand] = useState('');
    const [activeCategory, setActiveCategory] = useState('Red');
    const [validation, setValidation] = useState<ValidationState>({ valid: null, message: '' });


    // New state for advanced features
    const [showHistory, setShowHistory] = useState(false);
    const [showComparison, setShowComparison] = useState(false);
    const [showFavorites, setShowFavorites] = useState(false);
    const [historySearch, setHistorySearch] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);
    const [showWorkflowBuilder, setShowWorkflowBuilder] = useState(false);
    const [showMultiTarget, setShowMultiTarget] = useState(false);
    const [recommendations, setRecommendations] = useState<any[]>([]);

    // Tool filtering states
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [selectedTeam, setSelectedTeam] = useState<'all' | 'red' | 'blue'>('all');
    const [toolSearch, setToolSearch] = useState('');

    // Manual tool selection
    const [selectedManualTool, setSelectedManualTool] = useState<string | null>(null);
    const [activeToolTab, setActiveToolTab] = useState<string>('Escaneo y Reconocimiento');

    // Theme
    const { theme, toggleTheme } = useTheme();

    // Keyboard shortcuts
    useKeyboardShortcuts([
        {
            key: 'Enter',
            ctrl: true,
            action: () => {
                if (result) {
                    handleExecute();
                } else if (prompt.trim()) {
                    handleAnalyze();
                }
            },
            description: 'Ejecutar escaneo o analizar prompt'
        },
        {
            key: 'k',
            ctrl: true,
            action: () => setShowComparison(true),
            description: 'Abrir comparación de herramientas'
        },
        {
            key: 'h',
            ctrl: true,
            action: () => setShowHistory(!showHistory),
            description: 'Alternar barra lateral de historial'
        },
        {
            key: 'Escape',
            action: () => {
                setShowComparison(false);
                setShowSuggestions(false);
                setShowShortcutsHelp(false);
            },
            description: 'Cerrar modales'
        },
        {
            key: 's',
            ctrl: true,
            action: () => {
                if (result) saveAsFavorite();
            },
            description: 'Guardar como favorito'
        },
        {
            key: '/',
            ctrl: true,
            action: () => setShowShortcutsHelp(true),
            description: 'Mostrar atajos de teclado'
        }
    ], !showComparison && !showShortcutsHelp); // Disable when modals are open

    // Mock data (in production, fetch from API)
    const [history, setHistory] = useState<HistoryItem[]>([
        {
            id: '1',
            prompt: 'Escanear puertos de numu.group',
            tool: 'nmap',
            target: 'numu.group',
            status: 'success',
            createdAt: new Date(Date.now() - 3600000)
        },
        {
            id: '2',
            prompt: 'Buscar vulnerabilidades en example.com',
            tool: 'nikto',
            target: 'example.com',
            status: 'success',
            createdAt: new Date(Date.now() - 7200000)
        }
    ]);

    const [favorites, setFavorites] = useState<FavoriteConfig[]>([
        {
            id: '1',
            name: 'Escaneo Rápido de Red',
            description: 'Escaneo rápido de puertos comunes',
            tool: 'nmap',
            prompt: 'Escaneo rápido de {target}',
            target: ''
        }
    ]);

    const stats = {
        thisMonth: 24,
        credits: 156
    };

    // Real-time validation
    useEffect(() => {
        if (prompt.length > 10) {
            const hasTarget = /\b(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}\b/i.test(prompt) ||
                /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/.test(prompt);

            if (hasTarget) {
                setValidation({
                    valid: true,
                    message: 'Prompt válido. Objetivo detectado correctamente.'
                });
            } else {
                setValidation({
                    valid: false,
                    message: 'Sugerencia: Incluye un dominio o IP para mejores resultados (ej: example.com o 192.168.1.1)'
                });
            }

            // Auto-suggestions
            if (prompt.length > 5) {
                const matchedSuggestions = Object.values(PROMPT_CATEGORIES)
                    .flat()
                    .filter(p => p.text.toLowerCase().includes(prompt.toLowerCase().split(' ')[0]))
                    .slice(0, 3)
                    .map(p => p.text);

                if (matchedSuggestions.length > 0) {
                    setSuggestions(matchedSuggestions);
                    setShowSuggestions(true);
                } else {
                    setShowSuggestions(false);
                }
            }
        } else {
            setValidation({ valid: null, message: '' });
            setShowSuggestions(false);
        }
    }, [prompt]);

    const handleAnalyze = async () => {
        if (!prompt.trim() && !selectedManualTool) return;

        setLoading(true);
        setError(null);

        try {
            // Extract target from prompt if not set
            let currentTarget = target;
            if (!currentTarget && prompt) {
                const targetMatch = prompt.match(/\b(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}\b/i) ||
                    prompt.match(/\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/);
                if (targetMatch) {
                    currentTarget = targetMatch[0];
                }
            }

            // If manual tool is selected, use it directly
            if (selectedManualTool && currentTarget) {
                const { parseIntentWithManualTool } = await import('@/lib/ai/intent-parser');
                const data = parseIntentWithManualTool(selectedManualTool, currentTarget);
                setResult(data);
                setEditedCommand(data.command || '');
            } else if (selectedManualTool && !currentTarget) {
                // Tool selected but no target found
                setError('Por favor ingresa un objetivo (dominio o IP) en el prompt.');
            } else {
                // Otherwise use AI parser
                const response = await fetch('/api/ai/analyze-intent', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ prompt, target: target || undefined })
                });

                if (!response.ok) {
                    throw new Error('Failed to analyze intent');
                }

                const data = await response.json();
                setResult(data);
                setEditedCommand(data.command || '');
            }
        } catch (err) {
            setError('Error al analizar la solicitud. Inténtalo de nuevo.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSuggestedPrompt = (suggestedText: string) => {
        const finalText = suggestedText.replace('{target}', target || 'example.com');
        setPrompt(finalText);
        setResult(null);
        setShowSuggestions(false);
    };

    const handleCopyCommand = () => {
        if (editMode && editedCommand) {
            navigator.clipboard.writeText(editedCommand);
        } else if (result?.command) {
            navigator.clipboard.writeText(result.command);
        }
    };

    const handleExecute = async () => {
        if (!result) return;

        const commandToExecute = editMode ? editedCommand : result.command;
        if (!commandToExecute) return;

        setLoading(true);
        setError(null); // Clear previous errors
        try {
            const response = await fetch('/api/tools/execute', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tool: result.tool,
                    target: result.target,
                    options: {
                        scanType: result.scanType,
                        flags: result.flags
                    },
                    generatedBy: 'ai',
                    aiPrompt: prompt,
                    aiConfidence: result.confidence
                })
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || 'Execution failed');
            }

            const data = await response.json();

            alert(`✅ Escaneo iniciado con éxito!\nID: ${data.executionId}\nHerramienta: ${result.tool}`);
            setResult(null);
            setPrompt('');

            if (data.scanId) {
                router.push(`/dashboard/csirt-scans/${data.scanId}`);
            } else {
                router.refresh();
            }

        } catch (error: any) {
            console.error('Error executing scan:', error);
            // Set the error message - it will be displayed by the error component below
            setError(error.message || 'Error desconocido al ejecutar el escaneo');
        } finally {
            setLoading(false);
        }
    };

    const reuseScan = (scan: HistoryItem) => {
        setPrompt(scan.prompt);
        setTarget(scan.target);
        setShowHistory(false);
    };

    const useFavorite = (fav: FavoriteConfig) => {
        setPrompt(fav.prompt.replace('{target}', target || 'example.com'));
        setShowFavorites(false);
    };

    const saveAsFavorite = () => {
        if (!result) return;
        const newFav: FavoriteConfig = {
            id: Date.now().toString(),
            name: `${result.tool} - ${result.target}`,
            description: prompt,
            tool: result.tool,
            prompt: prompt,
            target: result.target || ''
        };
        setFavorites([...favorites, newFav]);
    };

    const selectToolFromComparison = (tool: string) => {
        const currentTarget = target || '';
        setPrompt(`Escanear ${currentTarget || '[OBJETIVO]'} con ${tool}`);

        // Pre-populate result to show configuration card immediately
        setResult({
            tool: tool,
            target: currentTarget,
            intent: 'manual_selection',
            confidence: 100,
            scanType: 'quick',
            flags: [],
            command: ''
        } as any);

        setShowComparison(false);
    };

    const handleWorkflowExecute = async (workflow: any) => {
        setShowWorkflowBuilder(false);
        setLoading(true);

        try {
            const results = await WorkflowEngine.executeWorkflow(
                workflow,
                target || 'example.com',
                (step, total, status) => {
                    console.log(`Step ${step}/${total}: ${status}`);
                }
            );

            alert(`✅ Workflow completado!\n${results.length} escaneos ejecutados`);
        } catch (error) {
            console.error('Workflow error:', error);
            setError('Error ejecutando workflow');
        } finally {
            setLoading(false);
        }
    };

    const handleMultiTargetExecute = async (targets: string[], tool: string, parameters: any) => {
        setShowMultiTarget(false);
        setLoading(true);

        try {
            // Create scan job
            const response = await fetch('/api/scan-jobs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ targets, tool, parameters })
            });

            if (!response.ok) throw new Error('Error al crear el trabajo de escaneo');

            const data = await response.json();
            alert(`✅ Scan job creado!\nID: ${data.jobId}\nTargets: ${targets.length}`);
        } catch (error) {
            console.error('Multi-target error:', error);
            setError('Error creando scan job');
        } finally {
            setLoading(false);
        }
    };

    // Generate recommendations when result changes
    useEffect(() => {
        if (result) {
            const recs = WorkflowEngine.recommendNextScans({
                tool: result.tool,
                target: result.target || '',
                status: 'completed',
                services: [],
                openPorts: []
            });
            setRecommendations(recs);
        } else {
            setRecommendations([]);
        }
    }, [result]);

    const formatTimeAgo = (date: Date) => {
        const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
        if (seconds < 60) return 'Hace un momento';
        if (seconds < 3600) return `Hace ${Math.floor(seconds / 60)} min`;
        if (seconds < 86400) return `Hace ${Math.floor(seconds / 3600)} h`;
        return `Hace ${Math.floor(seconds / 86400)} días`;
    };

    const getConfidenceColor = (confidence: number) => {
        if (confidence >= 80) return 'text-green-400';
        if (confidence >= 50) return 'text-yellow-400';
        return 'text-red-400';
    };

    const getConfidenceBgColor = (confidence: number) => {
        if (confidence >= 80) return 'bg-green-500';
        if (confidence >= 50) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    const getToolIcon = (toolName: string) => {
        const icons: Record<string, string> = {
            nmap: '🗺️',
            nikto: '🕷️',
            nuclei: '⚛️',
            feroxbuster: '📂',
            zap: '⚡',
            testssl: '🔒',
            whatweb: '🎨',
            theharvester: '🌾',
            'recon-ng': '🕵️',
            sqlmap: '💉',
            wpscan: '🔌',
            subfinder: '🔎',
            'openvas': '🔰',
            'wireshark': '🦈',
            'metasploit': 'Ⓜ️',
            'burp-suite': '🟧',
            'hydra': '🐉',
            'john': '🔨',
            'hashcat': '#️⃣'
        };

        if (icons[toolName]) return icons[toolName];

        // Fallback based on category from DB
        const tool = SECURITY_TOOLS.find(t => t.id === toolName || t.name.toLowerCase() === toolName.toLowerCase());
        if (tool) {
            if (tool.category === TOOL_CATEGORIES.SCANNING) return '🔭';
            if (tool.category === TOOL_CATEGORIES.WEB_SECURITY) return '🌐';
            if (tool.category === TOOL_CATEGORIES.NETWORK_ANALYSIS) return '📡';
            if (tool.category === TOOL_CATEGORIES.VULNERABILITY_ANALYSIS) return '🐛';
            if (tool.category === TOOL_CATEGORIES.BRUTE_FORCE) return '🔐';
            if (tool.category === TOOL_CATEGORIES.EXPLOITATION) return '💣';
        }

        return '🔧';
    };

    const getPromptsForTool = (tool: string) => {
        // 1. Check specific prompts
        if (TOOL_SPECIFIC_PROMPTS[tool]) {
            return TOOL_SPECIFIC_PROMPTS[tool];
        }

        // 2. Generic fallback based on category
        const toolData = SECURITY_TOOLS.find(t => t.id === tool);
        if (toolData) {
            if (toolData.category === TOOL_CATEGORIES.SCANNING) return [
                { icon: '🚀', text: `Escaneo básico con ${tool} en {target}` },
                { icon: '🔍', text: `Reconocimiento exhaustivo usando ${tool}` }
            ];
            if (toolData.category === TOOL_CATEGORIES.WEB_SECURITY) return [
                { icon: '🕷️', text: `Analizar vulnerabilidades web en {target}` },
                { icon: '🔒', text: `Auditoría de seguridad con ${tool}` }
            ];
        }

        // 3. Default fallback
        return [
            { icon: '⚡', text: `Ejecutar ${tool} contra {target}` },
            { icon: '📝', text: `Ver ayuda y comandos de ${tool}` }
        ];
    };

    const getEstimatedDuration = (tool: string, scanType: string) => {
        const durations: Record<string, Record<string, string>> = {
            nmap: { quick: '2-5 min', full: '15-30 min', stealth: '20-40 min' },
            nikto: { quick: '5-10 min', full: '15-25 min' },
            nuclei: { quick: '3-7 min', full: '10-20 min' },
            feroxbuster: { quick: '5-10 min', full: '15-30 min' },
        };
        return durations[tool]?.[scanType] || '~10 min';
    };

    const getCreditCost = (tool: string) => {
        const costs: Record<string, number> = {
            nmap: 5,
            nikto: 4,
            nuclei: 6,
            feroxbuster: 5,
            testssl: 3,
            whatweb: 2,
            theharvester: 4
        };
        return costs[tool] || 5;
    };

    const filteredHistory = history.filter(h =>
        h.prompt.toLowerCase().includes(historySearch.toLowerCase()) ||
        h.tool.toLowerCase().includes(historySearch.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-950 text-white p-4 md:p-6 pb-20 w-full">
            <div className="w-full">

                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                                <Sparkles className="h-6 w-6" />
                            </div>
                            <h1 className="text-3xl font-bold">Ciber-Asistente IA 2.0</h1>
                            <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 text-xs font-bold rounded-full">SUPER PANEL</span>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2">

                            {/* Theme Toggle */}
                            <button
                                onClick={toggleTheme}
                                className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition"
                                title="Toggle theme"
                            >
                                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                            </button>

                            {/* Workflow Builder */}
                            <button
                                onClick={() => setShowWorkflowBuilder(true)}
                                className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition"
                                title="Workflow Builder"
                            >
                                <Workflow className="w-4 h-4" />
                            </button>

                            {/* Multi-Target Scanner */}
                            <button
                                onClick={() => setShowMultiTarget(true)}
                                className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition"
                                title="Multi-Target Scanner"
                            >
                                <Users className="w-4 h-4" />
                            </button>

                            {/* Shortcuts Help */}
                            <button
                                onClick={() => setShowShortcutsHelp(true)}
                                className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition"
                                title="Keyboard Shortcuts (Ctrl+/)"
                            >
                                <Keyboard className="w-4 h-4" />
                            </button>

                            {/* Export (if result exists) */}
                            {result && (
                                <ExportMenu scanResult={result} />
                            )}

                        </div>
                    </div>
                    <p className="text-slate-400">
                        Describe tu objetivo. La IA seleccionará la mejor herramienta de nuestro arsenal (Nuclei, Nmap, ZAP, etc).
                    </p>
                </div>

                <div className="flex gap-6">

                    {/* Main Panel */}
                    <div className="flex-1">

                        {/* Main Card */}
                        <Card className="bg-slate-900 border-slate-800 mb-6">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="flex items-center gap-2">
                                    {result ? (
                                        <>
                                            <span className="text-2xl">{getToolIcon(result.tool)}</span>
                                            Configurando {result.tool.toUpperCase()}
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="h-5 w-5 text-purple-500" />
                                            Nueva Configuración
                                        </>
                                    )}
                                </CardTitle>
                                <div className="flex items-center gap-2">
                                    {result && (
                                        <button
                                            onClick={() => setResult(null)}
                                            className="text-sm text-slate-400 hover:text-white transition"
                                        >
                                            Cambiar Herramienta
                                        </button>
                                    )}
                                    <button
                                        onClick={() => setShowHistory(!showHistory)}
                                        className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition"
                                        title="Ver historial"
                                    >
                                        <History className="w-4 h-4" />
                                    </button>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-6">

                                {/* Tool Selector */}
                                {!result && (
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <label className="block text-sm font-medium text-slate-300 flex items-center gap-2">
                                                <Shield className="h-4 w-4" />
                                                Selecciona una Herramienta (Opcional)
                                            </label>
                                            {selectedManualTool && (
                                                <button
                                                    onClick={() => setSelectedManualTool(null)}
                                                    className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                                                >
                                                    <X className="w-3 h-3" />
                                                    Limpiar selección
                                                </button>
                                            )}
                                        </div>
                                        <div className="flex flex-wrap gap-2 pb-4 mb-4">
                                            {Object.values(TOOL_CATEGORIES)
                                                .filter(cat => SECURITY_TOOLS.some(t => t.category === cat))
                                                .map(cat => (
                                                    <button
                                                        key={cat}
                                                        onClick={() => setActiveToolTab(cat)}
                                                        className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition border ${activeToolTab === cat
                                                            ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                                                            : 'bg-slate-900 border-slate-700 text-slate-500 hover:border-slate-600 hover:text-slate-300'
                                                            }`}
                                                    >
                                                        {cat.toUpperCase()}
                                                    </button>
                                                ))}
                                        </div>


                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10 gap-3">
                                            {SECURITY_TOOLS
                                                .filter(t => t.category === activeToolTab)
                                                .map(tool => (
                                                    <button
                                                        key={tool.id}
                                                        onClick={() => setSelectedManualTool(tool.id)}
                                                        className={`p-3 rounded-xl border transition flex flex-col items-center justify-center gap-2 min-h-[110px] relative overflow-hidden group ${selectedManualTool === tool.id
                                                            ? 'bg-gradient-to-br from-cyan-950/80 to-slate-900 border-cyan-500 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.2)]'
                                                            : 'bg-gradient-to-br from-slate-900 to-slate-950 border-slate-800 text-slate-400 hover:border-cyan-500/50 hover:text-white hover:shadow-lg'
                                                            }`}
                                                        title={tool.description}
                                                    >
                                                        <span className="text-3xl mb-1 group-hover:scale-110 group-hover:-translate-y-1 transition duration-300 drop-shadow-lg">{getToolIcon(tool.id)}</span>
                                                        <span className="text-[10px] font-bold uppercase text-center leading-tight tracking-wider opacity-80 group-hover:opacity-100">{tool.name}</span>
                                                        {tool.team === 'red' && <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-red-500/50" />}
                                                        {tool.team === 'blue' && <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-blue-500/50" />}
                                                    </button>
                                                ))}
                                        </div>
                                        {selectedManualTool && (
                                            <div className="p-3 bg-cyan-950/20 border border-cyan-900/50 rounded-lg animate-in fade-in slide-in-from-top-2">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="text-xs text-cyan-400 font-semibold">✓ {selectedManualTool.toUpperCase()} seleccionado</div>
                                                </div>

                                                <div className="space-y-2">
                                                    <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Sugerencias de uso:</p>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                        {getPromptsForTool(selectedManualTool).map((prompt, idx) => (
                                                            <button
                                                                key={idx}
                                                                onClick={() => {
                                                                    setPrompt(prompt.text.replace('{target}', target || '[OBJETIVO]'));
                                                                }}
                                                                className="flex items-center gap-2 p-2 rounded bg-slate-900/50 border border-slate-700/50 hover:border-cyan-500/50 hover:bg-cyan-500/10 transition text-left group"
                                                            >
                                                                <span className="text-lg">{prompt.icon}</span>
                                                                <span className="text-xs text-slate-300 group-hover:text-cyan-300 transition-colors line-clamp-1">
                                                                    {prompt.text.replace('{target}', '...')}
                                                                </span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Input Principal */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                                        <Terminal className="h-4 w-4" />
                                        ¿Qué deseas escanear hoy?
                                    </label>
                                    <div className="relative">
                                        <textarea
                                            value={prompt}
                                            onChange={(e) => setPrompt(e.target.value)}
                                            onFocus={() => setShowSuggestions(suggestions.length > 0)}
                                            placeholder='Ej: "Escanear vulnerabilidades en numu.group" o "Buscar directorios ocultos en example.com"'
                                            className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition resize-none"
                                            rows={3}
                                            disabled={loading}
                                        />
                                        {/* Character Counter */}
                                        <div className="absolute bottom-3 right-3 text-xs text-slate-500">
                                            {prompt.length}/500
                                        </div>

                                        {/* Auto-suggestions */}
                                        {showSuggestions && suggestions.length > 0 && (
                                            <div className="absolute top-full mt-2 w-full bg-slate-900 border border-slate-700 rounded-lg shadow-xl z-10 animate-in fade-in">
                                                <div className="p-2 text-xs text-slate-400 border-b border-slate-800 flex items-center justify-between">
                                                    <span>Sugerencias de IA:</span>
                                                    <button onClick={() => setShowSuggestions(false)} className="hover:text-white">
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </div>
                                                {suggestions.map((suggestion, idx) => (
                                                    <button
                                                        key={idx}
                                                        onClick={() => {
                                                            handleSuggestedPrompt(suggestion);
                                                            setShowSuggestions(false);
                                                        }}
                                                        className="w-full px-3 py-2 text-left text-sm hover:bg-slate-800 transition flex items-center justify-between"
                                                    >
                                                        <span className="text-slate-300">{suggestion}</span>
                                                        <Sparkles className="w-3 h-3 text-cyan-400" />
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex justify-between items-center mt-2">
                                        <span className="text-xs text-slate-500">
                                            IA MEJORADA: SOPORTA ESPAÑOL E INGLÉS
                                        </span>
                                        <button
                                            onClick={() => setShowComparison(true)}
                                            className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition"
                                        >
                                            <Scale className="w-3 h-3" />
                                            ¿No sabes qué herramienta usar?
                                        </button>
                                    </div>
                                </div>

                                {/* Real-time Validation */}
                                {validation.valid !== null && (
                                    <div className={`flex items-start gap-2 p-3 rounded-lg border animate-in fade-in ${validation.valid
                                        ? 'bg-green-950/20 border-green-900/50'
                                        : 'bg-yellow-950/20 border-yellow-900/50'
                                        }`}>
                                        {validation.valid ? (
                                            <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                                        ) : (
                                            <AlertCircle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                                        )}
                                        <div className="text-sm">
                                            <div className={`font-semibold mb-0.5 ${validation.valid ? 'text-green-400' : 'text-yellow-400'}`}>
                                                {validation.valid ? '✓ Prompt válido' : '⚠️ Sugerencia'}
                                            </div>
                                            <div className="text-slate-300 text-xs">{validation.message}</div>
                                        </div>
                                    </div>
                                )}

                                {/* Target Opcional */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        Objetivo Opcional (ej. 192.168.1.1)
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={target}
                                            onChange={(e) => setTarget(e.target.value)}
                                            placeholder="example.com o 192.168.1.1"
                                            className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition"
                                            disabled={loading}
                                        />
                                    </div>
                                </div>

                                {/* Favorites Section */}
                                {favorites.length > 0 && !result && (
                                    <details className="bg-slate-950 border border-slate-800 rounded-lg">
                                        <summary className="px-4 py-3 cursor-pointer hover:bg-slate-900 transition text-sm font-medium flex items-center gap-2">
                                            <Star className="w-4 h-4 text-yellow-400" />
                                            Mis Favoritos ({favorites.length})
                                        </summary>
                                        <div className="px-4 py-3 border-t border-slate-800 space-y-2">
                                            {favorites.map(fav => (
                                                <button
                                                    key={fav.id}
                                                    onClick={() => useFavorite(fav)}
                                                    className="w-full p-3 bg-slate-900 hover:bg-slate-800 rounded-lg text-left border border-slate-800 hover:border-yellow-500 transition"
                                                >
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="text-sm font-semibold text-white">{fav.name}</span>
                                                        <span className="text-xs text-slate-500">{fav.tool}</span>
                                                    </div>
                                                    <div className="text-xs text-slate-400">{fav.description}</div>
                                                </button>
                                            ))}
                                        </div>
                                    </details>
                                )}

                                {/* Prompts Sugeridos con Categorías */}
                                {!result && (
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="text-sm text-slate-400">
                                                {selectedManualTool ? `PROMPTS PARA ${selectedManualTool.toUpperCase()}:` : 'PROMPTS SUGERIDOS:'}
                                            </span>
                                            {!selectedManualTool && (
                                                <div className="flex gap-1 flex-wrap">
                                                    {Object.keys(PROMPT_CATEGORIES).map(category => (
                                                        <button
                                                            key={category}
                                                            onClick={() => setActiveCategory(category)}
                                                            className={`px-3 py-1 rounded-full text-xs transition ${activeCategory === category
                                                                ? 'bg-cyan-600 text-white'
                                                                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                                                }`}
                                                        >
                                                            {category}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                            {(selectedManualTool && TOOL_SPECIFIC_PROMPTS[selectedManualTool]
                                                ? TOOL_SPECIFIC_PROMPTS[selectedManualTool]
                                                : PROMPT_CATEGORIES[activeCategory as keyof typeof PROMPT_CATEGORIES]
                                            ).map((suggested, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => handleSuggestedPrompt(suggested.text)}
                                                    className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500 rounded-lg text-left transition group"
                                                >
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-xl">{suggested.icon}</span>
                                                        <span className="text-xs text-slate-500">{(suggested as any).tool || selectedManualTool}</span>
                                                    </div>
                                                    <div className="text-sm text-slate-300 group-hover:text-white transition">
                                                        {suggested.text.replace('{target}', target || 'example.com')}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* ENHANCED RESULTS PANEL */}
                                {result && (
                                    <div className="space-y-4 animate-in fade-in duration-300">

                                        {/* Tool Detection Card */}
                                        <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-cyan-500/30">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center text-2xl">
                                                    {getToolIcon(result.tool)}
                                                </div>
                                                <div>
                                                    <div className="text-sm text-slate-400">Herramienta Detectada</div>
                                                    <div className="text-xl font-bold text-white uppercase">{result.tool}</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-slate-400">Confianza:</span>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-24 h-2 bg-slate-700 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full ${getConfidenceBgColor(result.confidence)}`}
                                                            style={{ width: `${result.confidence}%` }}
                                                        />
                                                    </div>
                                                    <span className={`text-sm font-bold ${getConfidenceColor(result.confidence)}`}>
                                                        {Math.round(result.confidence)}%
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Visual Scan Preview */}
                                        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg border border-slate-700 p-6">
                                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                                <Target className="w-5 h-5 text-cyan-400" />
                                                Vista Previa del Escaneo
                                            </h3>

                                            {/* Flow Diagram */}
                                            <div className="flex items-center justify-between mb-6">

                                                {/* Source */}
                                                <div className="text-center">
                                                    <div className="w-20 h-20 bg-cyan-500/20 border-2 border-cyan-500 rounded-full flex items-center justify-center mb-2 relative">
                                                        <Laptop className="w-8 h-8 text-cyan-400" />
                                                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-slate-900 flex items-center justify-center text-xs">
                                                            ✓
                                                        </div>
                                                    </div>
                                                    <div className="text-xs text-slate-400">Tu Máquina</div>
                                                    <div className="text-xs text-cyan-400 font-mono">NUMU</div>
                                                </div>

                                                {/* Animated Arrow */}
                                                <div className="flex-1 px-4 relative">
                                                    <div className="border-t-2 border-dashed border-cyan-500 relative">
                                                        <div className="absolute top-0 left-0 w-3 h-3 bg-cyan-500 rounded-full animate-ping"
                                                            style={{ animationDuration: '2s' }} />
                                                        <div className="absolute top-0 left-0 w-3 h-3 bg-cyan-500 rounded-full" />
                                                    </div>

                                                    {/* Tool Label */}
                                                    <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-slate-900 px-3 py-1 rounded border border-slate-700 whitespace-nowrap">
                                                        <div className="text-xs font-bold text-cyan-400">{result.tool.toUpperCase()}</div>
                                                        <div className="text-[10px] text-slate-500">{result.scanType}</div>
                                                    </div>
                                                </div>

                                                {/* Target */}
                                                <div className="text-center">
                                                    <div className="w-20 h-20 bg-purple-500/20 border-2 border-purple-500 rounded-full flex items-center justify-center mb-2">
                                                        <Globe className="w-8 h-8 text-purple-400" />
                                                    </div>
                                                    <div className="text-xs text-slate-400">Objetivo</div>
                                                    <div className="text-xs text-purple-400 font-mono max-w-[100px] truncate">
                                                        {result.target}
                                                    </div>
                                                </div>

                                            </div>

                                            {/* Info Cards */}
                                            <div className="grid grid-cols-4 gap-3">
                                                <div className="bg-slate-950 rounded-lg p-3 text-center">
                                                    <Clock className="w-4 h-4 mx-auto mb-1 text-cyan-400" />
                                                    <div className="text-xs text-slate-400">Duración</div>
                                                    <div className="text-sm font-bold text-white">{getEstimatedDuration(result.tool, result.scanType)}</div>
                                                </div>
                                                <div className="bg-slate-950 rounded-lg p-3 text-center">
                                                    <Zap className="w-4 h-4 mx-auto mb-1 text-yellow-400" />
                                                    <div className="text-xs text-slate-400">Créditos</div>
                                                    <div className="text-sm font-bold text-yellow-400">{getCreditCost(result.tool)} 🪙</div>
                                                </div>
                                                <div className="bg-slate-950 rounded-lg p-3 text-center">
                                                    <Shield className="w-4 h-4 mx-auto mb-1 text-green-400" />
                                                    <div className="text-xs text-slate-400">Modo</div>
                                                    <div className="text-sm font-bold text-white capitalize">{result.scanType}</div>
                                                </div>
                                                <div className="bg-slate-950 rounded-lg p-3 text-center">
                                                    <Target className="w-4 h-4 mx-auto mb-1 text-purple-400" />
                                                    <div className="text-xs text-slate-400">Alcance</div>
                                                    <div className="text-sm font-bold text-white">Completo</div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Command Preview (Editable) */}
                                        {result.command && (
                                            <div className="bg-slate-900 rounded-lg border border-slate-800 overflow-hidden">
                                                <div className="flex items-center justify-between px-4 py-3 bg-slate-800/50 border-b border-slate-700">
                                                    <span className="text-sm font-semibold text-slate-300">Comando Generado</span>
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => setEditMode(!editMode)}
                                                            className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition"
                                                        >
                                                            <Edit3 className="w-3 h-3" />
                                                            {editMode ? 'Vista' : 'Editar'}
                                                        </button>
                                                        <button
                                                            onClick={handleCopyCommand}
                                                            className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition"
                                                        >
                                                            <Copy className="w-3 h-3" />
                                                            Copiar
                                                        </button>
                                                    </div>
                                                </div>

                                                {editMode ? (
                                                    <textarea
                                                        value={editedCommand}
                                                        onChange={(e) => setEditedCommand(e.target.value)}
                                                        className="w-full px-4 py-3 bg-black border-0 text-green-400 font-mono text-sm focus:outline-none resize-none"
                                                        rows={3}
                                                    />
                                                ) : (
                                                    <pre className="px-4 py-3 bg-black text-green-400 font-mono text-sm overflow-x-auto">
                                                        {result.command}
                                                    </pre>
                                                )}
                                            </div>
                                        )}

                                        {/* AI Explanation */}
                                        <div className="p-4 bg-cyan-950/20 border border-cyan-900/50 rounded-lg">
                                            <div className="flex items-start gap-3">
                                                <div className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    ✨
                                                </div>
                                                <div>
                                                    <div className="text-sm font-semibold text-cyan-300 mb-1">Análisis de la IA</div>
                                                    <p className="text-sm text-slate-300">{result.explanation}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Technical Details (Expandable) */}
                                        <details className="bg-slate-950 border border-slate-800 rounded-lg">
                                            <summary className="px-4 py-3 cursor-pointer hover:bg-slate-900 transition text-sm font-medium flex items-center justify-between">
                                                <span>Detalles Técnicos</span>
                                                <ChevronDown className="w-4 h-4" />
                                            </summary>
                                            <div className="px-4 py-3 border-t border-slate-800 grid grid-cols-2 gap-3 text-sm">
                                                <div>
                                                    <span className="text-slate-400">Target:</span>
                                                    <span className="ml-2 text-white font-mono">{result.target}</span>
                                                </div>
                                                <div>
                                                    <span className="text-slate-400">Tipo de escaneo:</span>
                                                    <span className="ml-2 text-cyan-400 capitalize">{result.scanType}</span>
                                                </div>
                                                <div>
                                                    <span className="text-slate-400">Duración estimada:</span>
                                                    <span className="ml-2 text-white">{getEstimatedDuration(result.tool, result.scanType)}</span>
                                                </div>
                                                <div>
                                                    <span className="text-slate-400">Créditos:</span>
                                                    <span className="ml-2 text-yellow-400">{getCreditCost(result.tool)} 🪙</span>
                                                </div>
                                                <div className="col-span-2">
                                                    <span className="text-slate-400">Flags:</span>
                                                    <span className="ml-2 text-slate-300 font-mono text-xs">{result.flags.join(' ')}</span>
                                                </div>
                                            </div>
                                        </details>

                                        {/* Action Buttons */}
                                        <div className="grid grid-cols-3 gap-3">
                                            <button
                                                onClick={() => setResult(null)}
                                                className="py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg font-semibold transition"
                                            >
                                                ← Modificar
                                            </button>
                                            <button
                                                onClick={saveAsFavorite}
                                                className="py-3 bg-slate-800 hover:bg-slate-700 border border-yellow-500/30 rounded-lg font-semibold transition flex items-center justify-center gap-2"
                                            >
                                                <Star className="w-4 h-4 text-yellow-400" />
                                                Favorito
                                            </button>
                                            <button
                                                onClick={handleExecute}
                                                disabled={loading}
                                                className="py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 disabled:from-slate-700 disabled:to-slate-700 rounded-lg font-bold transition shadow-lg shadow-cyan-900/50 flex items-center justify-center gap-2"
                                            >
                                                {loading ? (
                                                    <>
                                                        <Loader2 className="w-5 h-5 animate-spin" />
                                                        Ejecutando...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Play className="w-5 h-5" />
                                                        Ejecutar →
                                                    </>
                                                )}
                                            </button>
                                        </div>

                                    </div>
                                )}

                                {/* Error */}
                                {error && (
                                    <div className="flex items-start gap-3 p-4 bg-red-950/20 border border-red-900/50 rounded-lg animate-in fade-in">
                                        <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                                        <div className="flex-1">
                                            <div className="font-semibold text-red-400 mb-1">Error al Ejecutar</div>
                                            <div className="text-sm text-red-200 whitespace-pre-line">{error}</div>
                                        </div>
                                    </div>
                                )}

                                {/* Main Action Button (when no result) */}
                                {!result && (
                                    <button
                                        onClick={handleAnalyze}
                                        disabled={!prompt.trim() || loading}
                                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed text-white py-4 rounded-lg font-bold flex items-center justify-center gap-2 transition shadow-lg shadow-purple-900/50"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="h-5 w-5 animate-spin" />
                                                Analizando...
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles className="h-5 w-5" />
                                                ANALIZAR SOLICITUD
                                            </>
                                        )}
                                    </button>
                                )}

                            </CardContent>
                        </Card>

                    </div>

                    {/* HISTORY SIDEBAR */}
                    {showHistory && (
                        <div className="w-80 animate-in slide-in-from-right">
                            <div className="bg-slate-900 rounded-lg border border-slate-800 p-4 sticky top-4">

                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-bold flex items-center gap-2">
                                        <Clock className="w-4 h-4" />
                                        Historial
                                    </h3>
                                    <button
                                        onClick={() => setShowHistory(false)}
                                        className="text-slate-400 hover:text-white transition"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Search */}
                                <div className="relative mb-3">
                                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                                    <input
                                        type="search"
                                        placeholder="Buscar escaneos..."
                                        value={historySearch}
                                        onChange={(e) => setHistorySearch(e.target.value)}
                                        className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition"
                                    />
                                </div>

                                {/* History List */}
                                <div className="space-y-2 max-h-[500px] overflow-y-auto mb-4">
                                    {filteredHistory.map(scan => (
                                        <div
                                            key={scan.id}
                                            onClick={() => reuseScan(scan)}
                                            className="p-3 bg-slate-950 hover:bg-slate-800 rounded-lg border border-slate-800 hover:border-cyan-500 cursor-pointer transition group"
                                        >
                                            <div className="flex items-center gap-2 mb-1">
                                                {scan.status === 'success' ? (
                                                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                                                ) : (
                                                    <XCircle className="w-4 h-4 text-red-400" />
                                                )}
                                                <span className="text-xs font-mono text-slate-500">{scan.tool}</span>
                                            </div>

                                            <div className="text-sm text-slate-300 line-clamp-2 mb-1">
                                                {scan.prompt}
                                            </div>

                                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                                <span>{scan.target}</span>
                                                <span>•</span>
                                                <span>{formatTimeAgo(scan.createdAt)}</span>
                                            </div>

                                            <div className="text-xs text-cyan-400 opacity-0 group-hover:opacity-100 transition mt-1">
                                                🔄 Reutilizar
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Stats */}
                                <div className="pt-4 border-t border-slate-800 grid grid-cols-2 gap-2 text-xs">
                                    <div className="text-center p-2 bg-slate-950 rounded">
                                        <div className="text-slate-400">Este mes</div>
                                        <div className="text-lg font-bold text-white flex items-center justify-center gap-1">
                                            <TrendingUp className="w-4 h-4 text-green-400" />
                                            {stats.thisMonth}
                                        </div>
                                    </div>
                                    <div className="text-center p-2 bg-slate-950 rounded">
                                        <div className="text-slate-400">Créditos</div>
                                        <div className="text-lg font-bold text-yellow-400 flex items-center justify-center gap-1">
                                            <Award className="w-4 h-4" />
                                            {stats.credits} 🪙
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    )}

                </div>

                {/* TOOL COMPARISON MODAL */}
                {showComparison && (() => {
                    // Filter tools based on selected criteria
                    const filteredTools = SECURITY_TOOLS.filter(tool => {
                        const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
                        const matchesTeam = selectedTeam === 'all' || tool.team === selectedTeam || tool.team === 'both';
                        const matchesSearch = toolSearch === '' ||
                            tool.name.toLowerCase().includes(toolSearch.toLowerCase()) ||
                            tool.description.toLowerCase().includes(toolSearch.toLowerCase()) ||
                            tool.tags.some(tag => tag.toLowerCase().includes(toolSearch.toLowerCase()));

                        return matchesCategory && matchesTeam && matchesSearch;
                    });

                    // Get unique categories
                    const categories = ['all', ...Object.values(TOOL_CATEGORIES)];

                    return (
                        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-in fade-in">
                            <div className="bg-slate-900 rounded-lg border border-slate-800 max-w-7xl w-full max-h-[90vh] overflow-hidden flex flex-col">

                                {/* Header */}
                                <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900 z-10">
                                    <div>
                                        <h2 className="text-2xl font-bold flex items-center gap-2">
                                            <Scale className="w-6 h-6 text-cyan-400" />
                                            Catálogo de Herramientas CSIRT
                                        </h2>
                                        <p className="text-slate-400 text-sm mt-1">
                                            {filteredTools.length} herramientas disponibles
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setShowComparison(false);
                                            setSelectedCategory('all');
                                            setSelectedTeam('all');
                                            setToolSearch('');
                                        }}
                                        className="p-2 hover:bg-slate-800 rounded-lg transition"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Filters */}
                                <div className="p-4 border-b border-slate-800 bg-slate-950 space-y-3">

                                    {/* Search */}
                                    <div className="relative">
                                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                                        <input
                                            type="search"
                                            placeholder="Buscar herramientas por nombre, descripción o tags..."
                                            value={toolSearch}
                                            onChange={(e) => setToolSearch(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition"
                                        />
                                    </div>

                                    <div className="flex gap-3 flex-wrap">
                                        {/* Team Filter */}
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setSelectedTeam('all')}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${selectedTeam === 'all'
                                                    ? 'bg-cyan-600 text-white'
                                                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                                    }`}
                                            >
                                                Todos
                                            </button>
                                            <button
                                                onClick={() => setSelectedTeam('red')}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${selectedTeam === 'red'
                                                    ? 'bg-red-600 text-white'
                                                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                                    }`}
                                            >
                                                🔴 Red Team
                                            </button>
                                            <button
                                                onClick={() => setSelectedTeam('blue')}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${selectedTeam === 'blue'
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                                    }`}
                                            >
                                                🔵 Blue Team
                                            </button>
                                        </div>

                                        {/* Category Filter */}
                                        <select
                                            value={selectedCategory}
                                            onChange={(e) => setSelectedCategory(e.target.value)}
                                            className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs font-semibold text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition"
                                        >
                                            {categories.map(cat => (
                                                <option key={cat} value={cat}>
                                                    {cat === 'all' ? '📁 Todas las Categorías' : cat}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Tools Grid */}
                                <div className="flex-1 overflow-y-auto p-6">
                                    {filteredTools.length === 0 ? (
                                        <div className="text-center py-12">
                                            <div className="text-6xl mb-4">🔍</div>
                                            <h3 className="text-xl font-bold text-slate-300 mb-2">No se encontraron herramientas</h3>
                                            <p className="text-slate-500">Intenta ajustar los filtros o la búsqueda</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                            {filteredTools.map(tool => (
                                                <div
                                                    key={tool.id}
                                                    className="bg-slate-950 border border-slate-800 rounded-lg p-4 hover:border-cyan-500 transition group"
                                                >
                                                    {/* Header */}
                                                    <div className="mb-3">
                                                        <div className="flex items-start justify-between mb-2">
                                                            <h3 className="text-base font-bold text-white">{tool.name}</h3>
                                                            <span className={`text-xs px-2 py-0.5 rounded ${tool.team === 'red' ? 'bg-red-500/20 text-red-400' :
                                                                tool.team === 'blue' ? 'bg-blue-500/20 text-blue-400' :
                                                                    'bg-purple-500/20 text-purple-400'
                                                                }`}>
                                                                {tool.team === 'red' ? '🔴' : tool.team === 'blue' ? '🔵' : '🟣'}
                                                            </span>
                                                        </div>
                                                        <div className="text-xs text-slate-500 mb-2">{tool.category}</div>
                                                        <p className="text-xs text-slate-400 line-clamp-2">{tool.description}</p>
                                                    </div>

                                                    {/* Difficulty */}
                                                    <div className="mb-3">
                                                        <div className="flex items-center justify-between text-xs">
                                                            <span className="text-slate-500">Dificultad:</span>
                                                            <span className={`font-semibold ${tool.difficulty === 'beginner' ? 'text-green-400' :
                                                                tool.difficulty === 'intermediate' ? 'text-yellow-400' :
                                                                    tool.difficulty === 'advanced' ? 'text-orange-400' :
                                                                        'text-red-400'
                                                                }`}>
                                                                {tool.difficulty === 'beginner' ? '⭐ Principiante' :
                                                                    tool.difficulty === 'intermediate' ? '⭐⭐ Intermedio' :
                                                                        tool.difficulty === 'advanced' ? '⭐⭐⭐ Avanzado' :
                                                                            '⭐⭐⭐⭐ Experto'}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Requirements */}
                                                    <div className="flex gap-1 mb-3 flex-wrap">
                                                        {tool.requiresDocker && (
                                                            <span className="text-[10px] px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded">
                                                                🐳 Docker
                                                            </span>
                                                        )}
                                                        {tool.requiresApiKey && (
                                                            <span className="text-[10px] px-2 py-0.5 bg-yellow-500/20 text-yellow-400 rounded">
                                                                🔑 API Key
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Tags */}
                                                    <div className="flex gap-1 mb-3 flex-wrap">
                                                        {tool.tags.slice(0, 3).map((tag, idx) => (
                                                            <span key={idx} className="text-[10px] px-2 py-0.5 bg-slate-800 text-slate-400 rounded">
                                                                {tag}
                                                            </span>
                                                        ))}
                                                        {tool.tags.length > 3 && (
                                                            <span className="text-[10px] px-2 py-0.5 bg-slate-800 text-slate-400 rounded">
                                                                +{tool.tags.length - 3}
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Actions */}
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => {
                                                                selectToolFromComparison(tool.id);
                                                                setShowComparison(false);
                                                            }}
                                                            className="flex-1 py-2 bg-cyan-600 hover:bg-cyan-700 rounded text-xs font-semibold transition"
                                                        >
                                                            Usar
                                                        </button>
                                                        <a
                                                            href={tool.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded text-xs transition"
                                                            title="Ver documentación"
                                                        >
                                                            📖
                                                        </a>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })()}

                {/* AI Recommendations Panel */}
                {recommendations.length > 0 && result && (
                    <div className="mt-6 p-4 bg-gradient-to-r from-purple-950/50 to-pink-950/50 border border-purple-500/30 rounded-lg">
                        <div className="flex items-center gap-2 mb-3">
                            <Lightbulb className="w-5 h-5 text-yellow-400" />
                            <h3 className="font-bold text-lg">Recomendaciones de IA</h3>
                            <span className="text-xs text-slate-400">Basado en resultados del escaneo</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {recommendations.map((rec, idx) => (
                                <div
                                    key={idx}
                                    className="p-3 bg-slate-900/50 rounded-lg border border-slate-700 hover:border-purple-500 transition"
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xl">{getToolIcon(rec.tool)}</span>
                                            <span className="font-semibold">{rec.tool.toUpperCase()}</span>
                                        </div>
                                        <span className={`text-xs px-2 py-1 rounded ${rec.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                                            rec.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                                'bg-blue-500/20 text-blue-400'
                                            }`}>
                                            {rec.priority}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-300 mb-3">{rec.reason}</p>
                                    <button
                                        onClick={() => {
                                            setPrompt(`Escanear ${result.target} con ${rec.tool}`);
                                            setResult(null);
                                        }}
                                        className="w-full py-2 bg-purple-600 hover:bg-purple-700 rounded text-sm font-semibold transition"
                                    >
                                        Ejecutar {rec.tool}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Workflow Builder Modal */}
                {showWorkflowBuilder && (
                    <WorkflowBuilder
                        onClose={() => setShowWorkflowBuilder(false)}
                        onExecute={handleWorkflowExecute}
                    />
                )}

                {/* Multi-Target Scanner Modal */}
                {showMultiTarget && (
                    <MultiTargetScanner
                        onClose={() => setShowMultiTarget(false)}
                        onExecute={handleMultiTargetExecute}
                    />
                )}

                {/* Shortcuts Help Modal */}
                <ShortcutsHelp
                    isOpen={showShortcutsHelp}
                    onClose={() => setShowShortcutsHelp(false)}
                />

            </div>
        </div >
    );
}
