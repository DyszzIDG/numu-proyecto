'use client';

import { useState } from 'react';
import ServicePanel from '@/components/services/ServicePanel';
import { Brain, MessageSquare, Sparkles, Send, Trash2 } from 'lucide-react';

export default function InteligenciaArtificialPanelPage() {
    const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setLoading(true);

        // Simulate AI response
        setTimeout(() => {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'Esta es una respuesta simulada del modelo de IA. En producción, aquí se integraría con la API de OpenAI u otro proveedor de LLM.'
            }]);
            setLoading(false);
        }, 1000);
    };

    const stats = [
        { label: 'Consultas Hoy', value: '156', color: 'purple' },
        { label: 'Tokens Usados', value: '45.2K', color: 'pink' },
        { label: 'Tiempo Promedio', value: '2.3s', color: 'blue' },
        { label: 'Precisión', value: '94%', color: 'green' },
    ];

    return (
        <ServicePanel
            title="Panel de Inteligencia Artificial"
            breadcrumbs={[
                { label: 'Servicios', href: '/dashboard' },
                { label: 'IA', href: '/servicios/inteligencia-artificial' }
            ]}
        >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Chat Area */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {stats.map((stat, index) => (
                            <div
                                key={index}
                                className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4"
                            >
                                <div className={`text-2xl font-bold text-${stat.color}-400 mb-1`}>
                                    {stat.value}
                                </div>
                                <p className="text-gray-400 text-sm">{stat.label}</p>
                            </div>
                        ))}
                    </div>

                    {/* Chat Interface */}
                    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl overflow-hidden">
                        <div className="p-4 border-b border-white/10 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Brain className="w-6 h-6 text-purple-400" />
                                <h2 className="text-xl font-semibold text-white">Chat con IA</h2>
                            </div>
                            <button
                                onClick={() => setMessages([])}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="h-96 overflow-y-auto p-4 space-y-4">
                            {messages.length === 0 ? (
                                <div className="text-center text-gray-400 mt-20">
                                    <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                    <p>Comienza una conversación con la IA</p>
                                </div>
                            ) : (
                                messages.map((message, index) => (
                                    <div
                                        key={index}
                                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-[80%] p-4 rounded-lg ${message.role === 'user'
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-white/10 text-gray-200'
                                                }`}
                                        >
                                            {message.content}
                                        </div>
                                    </div>
                                ))
                            )}
                            {loading && (
                                <div className="flex justify-start">
                                    <div className="bg-white/10 p-4 rounded-lg">
                                        <div className="flex gap-2">
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t border-white/10">
                            <div className="flex gap-3">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Escribe tu mensaje..."
                                    className="flex-1 px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!input.trim() || loading}
                                    className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Modelos Disponibles</h3>
                        <div className="space-y-3">
                            {['GPT-4', 'Claude 3', 'Gemini Pro', 'LLaMA 3'].map((model, index) => (
                                <button
                                    key={index}
                                    className="w-full p-3 bg-black/30 hover:bg-white/10 border border-white/10 rounded-lg text-left text-white transition-colors"
                                >
                                    {model}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Herramientas</h3>
                        <div className="space-y-2">
                            <button className="w-full p-3 bg-black/30 hover:bg-white/10 border border-white/10 rounded-lg text-left text-white transition-colors">
                                Generación de Código
                            </button>
                            <button className="w-full p-3 bg-black/30 hover:bg-white/10 border border-white/10 rounded-lg text-left text-white transition-colors">
                                Análisis de Documentos
                            </button>
                            <button className="w-full p-3 bg-black/30 hover:bg-white/10 border border-white/10 rounded-lg text-left text-white transition-colors">
                                Resumen de Texto
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </ServicePanel>
    );
}
