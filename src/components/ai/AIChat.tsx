'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, Bot, User, X, Loader2, Sparkles, Code as CodeIcon, AlertTriangle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    isTyping?: boolean;
}

interface AIChatProps {
    context?: any; // Scan context, selected vulnerability, etc.
}

export function AIChat({ context }: AIChatProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            content: 'Hola 👋 Soy tu asistente de ciberseguridad. Puedo ayudarte a interpretar resultados de escaneos, sugerir remediaciones o explicar conceptos técnicos. ¿En qué puedo ayudarte hoy?',
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);

        // Simulate AI response delay
        setTimeout(() => {
            const responseContent = generateMockResponse(userMessage.content);
            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: responseContent,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, assistantMessage]);
            setIsTyping(false);
        }, 2000);
    };

    const generateMockResponse = (query: string): string => {
        const q = query.toLowerCase();
        if (q.includes('vulnerabilidad') || q.includes('critica')) {
            return 'He analizado las vulnerabilidades críticas. La más urgente es **CVE-2021-41773** en el servidor Apache. \n\n**Recomendación:**\nActualizar Apache a la versión 2.4.52 inmediatamente. \n\n```bash\napt-get update && apt-get install apache2\n```\nEsto mitigará el riesgo de Path Traversal.';
        }
        if (q.includes('reporte') || q.includes('informe')) {
            return 'Puedo generar un reporte ejecutivo resumiendo los hallazgos. ¿Te gustaría que incluya también la sección de cumplimiento para ISO 27001?';
        }
        if (q.includes('scan') || q.includes('escanear')) {
            return 'Para este objetivo, recomiendo un escaneo en **Modo Profundo** utilizando Nmap y Nikto. ¿Quieres que configure este escaneo por ti?';
        }
        return 'Entiendo. Como asistente de seguridad, estoy aquí para analizar tus datos y proporcionar insights accionables. ¿Podrías darme más detalles sobre lo que necesitas analizar?';
    };

    return (
        <>
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(true)}
                className={`fixed bottom-6 right-6 p-4 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-full shadow-lg hover:shadow-cyan-500/20 transition-all transform hover:scale-105 z-50 ${isOpen ? 'hidden' : 'flex'}`}
            >
                <MessageSquare className="w-6 h-6 text-white" />
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center border-2 border-slate-900">1</span>
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">

                    {/* Header */}
                    <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950 rounded-t-2xl">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg">
                                <Bot className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold">AI Cyber Assistant</h3>
                                <div className="flex items-center gap-1.5 text-xs text-green-400">
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                    Online
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-2 hover:bg-slate-800 rounded-full transition text-slate-400 hover:text-white"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map(msg => (
                            <div
                                key={msg.id}
                                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                            >
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-slate-700' : 'bg-cyan-600/20 text-cyan-400'
                                    }`}>
                                    {msg.role === 'user' ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                                </div>
                                <div className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                                        ? 'bg-blue-600 text-white rounded-tr-none'
                                        : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'
                                    }`}>
                                    <ReactMarkdown
                                        components={{
                                            code: ({ node, ...props }) => (
                                                <code className="bg-slate-950 px-1 py-0.5 rounded text-xs font-mono text-yellow-500" {...props} />
                                            )
                                        }}
                                    >
                                        {msg.content}
                                    </ReactMarkdown>
                                    <div className="mt-1 text-[10px] opacity-50 text-right">
                                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-cyan-600/20 text-cyan-400 flex items-center justify-center flex-shrink-0">
                                    <Sparkles className="w-4 h-4" />
                                </div>
                                <div className="bg-slate-800 p-3 rounded-2xl rounded-tl-none border border-slate-700 flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                                    <span className="text-xs text-slate-400">Analizando...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 border-t border-slate-800 bg-slate-950 rounded-b-2xl">
                        {/* Suggested Actions (Optional - could be dynamic) */}
                        {messages.length < 3 && (
                            <div className="flex gap-2 overflow-x-auto pb-3 mb-1 no-scrollbar">
                                <button onClick={() => setInput('Resultados críticos')} className="whitespace-nowrap px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-full text-xs text-cyan-400 border border-slate-700 transition">
                                    🚨 Resultados críticos
                                </button>
                                <button onClick={() => setInput('Generar reporte')} className="whitespace-nowrap px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-full text-xs text-cyan-400 border border-slate-700 transition">
                                    📄 Generar reporte
                                </button>
                                <button onClick={() => setInput('¿Cómo remediar?')} className="whitespace-nowrap px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-full text-xs text-cyan-400 border border-slate-700 transition">
                                    🛠️ ¿Cómo remediar?
                                </button>
                            </div>
                        )}

                        <div className="relative">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Escribe tu consulta..."
                                className="w-full pl-4 pr-12 py-3 bg-slate-900 border border-slate-700 rounded-xl focus:border-cyan-500 outline-none text-sm"
                            />
                            <button
                                onClick={handleSend}
                                disabled={!input.trim() || isTyping}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-700 rounded-lg transition text-white"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="text-center mt-2">
                            <span className="text-[10px] text-slate-600 flex items-center justify-center gap-1">
                                <Shield className="w-3 h-3" />
                                AI Security Assistant v2.0
                            </span>
                        </div>
                    </div>

                </div>
            )}
        </>
    );
}
