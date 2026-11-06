'use client';

import React, { useState } from 'react';
import { Sparkles, Loader2, Terminal, AlertCircle, CheckCircle2, Copy, Play } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ParsedIntent {
  tool: string;
  target: string | null;
  scanType: string;
  flags: string[];
  confidence: number;
  explanation: string;
  command?: string;
}

const SUGGESTED_PROMPTS = [
  {
    text: "Scan numu.group for open ports and services",
    icon: "🔍",
    category: "Network"
  },
  {
    text: "Quick vulnerability scan on 192.168.1.1",
    icon: "⚡",
    category: "Vulnerability"
  },
  {
    text: "Find all open web ports on example.com",
    icon: "🌐",
    category: "Web"
  }
];

export default function CiberAsistenteIA() {
  const [prompt, setPrompt] = useState('');
  const [target, setTarget] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ParsedIntent | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);

    try {
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
    } catch (err) {
      setError('Error al analizar la solicitud. Inténtalo de nuevo.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestedPrompt = (suggestedText: string) => {
    setPrompt(suggestedText);
    setResult(null);
  };

  const handleCopyCommand = () => {
    if (result?.command) {
      navigator.clipboard.writeText(result.command);
    }
  };

  const handleExecute = async () => {
    if (!result?.command) return;
    
    // TODO: Implementar ejecución real
    console.log('Ejecutando:', result.command);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-400';
    if (confidence >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getToolIcon = (tool: string) => {
    const icons: Record<string, string> = {
      nmap: '🗺️',
      nikto: '🕷️',
      sqlmap: '💉',
      rustscan: '⚡',
      theharvester: '🌾'
    };
    return icons[tool] || '🔧';
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
              <Sparkles className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-bold">Ciber-Asistente IA</h1>
          </div>
          <p className="text-slate-400">
            Describe tu objetivo en lenguaje natural. La IA configurará el escaneo.
          </p>
        </div>

        {/* Main Card */}
        <Card className="bg-slate-900 border-slate-800 mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              {result ? (
                <>
                  {getToolIcon(result.tool)} Configurando {result.tool.toUpperCase()}
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 text-purple-500" />
                  Nueva Configuración
                </>
              )}
            </CardTitle>
            {result && (
              <button 
                onClick={() => setResult(null)}
                className="text-sm text-slate-400 hover:text-white"
              >
                Cambiar Herramienta
              </button>
            )}
          </CardHeader>

          <CardContent className="space-y-6">
            
            {/* Input Principal */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                <Terminal className="h-4 w-4" />
                ¿Qué deseas escanear hoy?
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder='Ejemplo: "Scan numu.group for open ports and services"'
                className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition resize-none"
                rows={3}
                disabled={loading}
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-slate-500">
                  DESCRIBE TU OBJETIVO EN LENGUAJE NATURAL
                </span>
                <div className="flex gap-2">
                  <button className="text-xs text-slate-400 hover:text-slate-300 px-2 py-1 rounded border border-slate-700">
                    + Completo
                  </button>
                  <button className="text-xs text-slate-400 hover:text-slate-300 px-2 py-1 rounded border border-slate-700">
                    + Rápido
                  </button>
                  <button className="text-xs text-slate-400 hover:text-slate-300 px-2 py-1 rounded border border-slate-700">
                    + Vulns
                  </button>
                </div>
              </div>
            </div>

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
                <button className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded text-xs text-slate-300 transition">
                  OPCIONAL
                </button>
              </div>
            </div>

            {/* Prompts Sugeridos */}
            {!result && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  PROMPTS SUGERIDOS:
                </label>
                <div className="space-y-2">
                  {SUGGESTED_PROMPTS.map((suggested, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSuggestedPrompt(suggested.text)}
                      className="w-full text-left px-4 py-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-purple-500/50 rounded-lg transition group flex items-center gap-3"
                    >
                      <span className="text-2xl">{suggested.icon}</span>
                      <div className="flex-1">
                        <div className="text-sm text-slate-300 group-hover:text-white">
                          {suggested.text}
                        </div>
                        <div className="text-xs text-slate-500">{suggested.category}</div>
                      </div>
                      <span className="text-purple-400 opacity-0 group-hover:opacity-100 transition">→</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Nota de Advertencia */}
            {!result && (
              <div className="flex items-start gap-2 p-3 bg-yellow-950/20 border border-yellow-900/50 rounded-lg">
                <AlertCircle className="h-4 w-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-yellow-200/80">
                  <strong>Nota:</strong> Cada escaneo consume créditos. La ejecución comenzará automáticamente tras la configuración de la IA.
                </p>
              </div>
            )}

            {/* Resultado del Análisis */}
            {result && (
              <div className="space-y-4 animate-in fade-in duration-300">
                
                {/* Explicación */}
                <div className="flex items-start gap-3 p-4 bg-purple-950/20 border border-purple-900/50 rounded-lg">
                  <CheckCircle2 className="h-5 w-5 text-purple-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-purple-100">{result.explanation}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-xs text-slate-400">Confianza:</span>
                      <div className="flex-1 bg-slate-800 rounded-full h-2 max-w-xs">
                        <div 
                          className={`h-full rounded-full ${
                            result.confidence >= 80 ? 'bg-green-500' :
                            result.confidence >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${result.confidence}%` }}
                        />
                      </div>
                      <span className={`text-xs font-bold ${getConfidenceColor(result.confidence)}`}>
                        {Math.round(result.confidence)}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Comando Generado */}
                {result.command && (
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Comando Generado:
                    </label>
                    <div className="relative">
                      <div className="bg-black border border-slate-800 rounded-lg p-4 font-mono text-sm text-green-400 overflow-x-auto">
                        <code>{result.command}</code>
                      </div>
                      <button
                        onClick={handleCopyCommand}
                        className="absolute top-2 right-2 p-2 bg-slate-800 hover:bg-slate-700 rounded transition"
                        title="Copiar comando"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Detalles Técnicos */}
                <details className="bg-slate-950 border border-slate-800 rounded-lg">
                  <summary className="px-4 py-3 cursor-pointer hover:bg-slate-900 transition text-sm font-medium">
                    Ver Detalles Técnicos
                  </summary>
                  <div className="px-4 py-3 border-t border-slate-800 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Herramienta:</span>
                      <span className="font-mono text-purple-400">{result.tool}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Tipo de Escaneo:</span>
                      <span className="font-mono text-cyan-400">{result.scanType}</span>
                    </div>
                    {result.target && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">Objetivo:</span>
                        <span className="font-mono text-white">{result.target}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-slate-400">Flags:</span>
                      <span className="font-mono text-slate-300">{result.flags.join(' ')}</span>
                    </div>
                  </div>
                </details>

              </div>
            )}

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2 p-3 bg-red-950/20 border border-red-900/50 rounded-lg">
                <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-200">{error}</p>
              </div>
            )}

            {/* Botón Principal */}
            {!result ? (
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
                    GENERAR ESCANEO CON IA
                  </>
                )}
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setResult(null)}
                  className="bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-lg font-semibold transition"
                >
                  Modificar
                </button>
                <button
                  onClick={handleExecute}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition shadow-lg shadow-green-900/50"
                >
                  <Play className="h-5 w-5" />
                  Ejecutar Escaneo
                </button>
              </div>
            )}

          </CardContent>
        </Card>

      </div>
    </div>
  );
}
