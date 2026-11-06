"use client";

import React, { useState, useEffect } from "react";
import CSIRTModuleLayout from "@/components/csirt/CSIRTModuleLayout";
import { Fingerprint, Search, HardDrive, FileSearch, Plus, Save } from "lucide-react";
import NeonCard from "@/components/ui/NeonCard";
import GlassCard from "@/components/ui/GlassCard";
import CyberButton from "@/components/ui/CyberButton";

export default function ForensicsPage() {
    const [evidence, setEvidence] = useState<any[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);

    // New Evidence Form State
    const [formData, setFormData] = useState({
        description: "",
        type: "disk_image", // disk_image, memory_dump, etc.
        location: "",
        acquiredBy: ""
    });

    useEffect(() => {
        fetchEvidence();
    }, []);

    const fetchEvidence = async () => {
        try {
            const res = await fetch('http://localhost:4000/api/csirt/forensics');
            if (res.ok) {
                setEvidence(await res.json());
            }
        } catch (error) {
            console.error("Error fetching evidence:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:4000/api/csirt/forensics', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setShowForm(false);
                setFormData({ description: "", type: "disk_image", location: "", acquiredBy: "" });
                fetchEvidence();
            }
        } catch (error) {
            console.error("Error creating evidence:", error);
        }
    };

    return (
        <CSIRTModuleLayout
            title="Forense Digital"
            description="Adquisición, análisis y preservación de evidencia digital."
            icon={Fingerprint}
            iconColor="text-blue-400"
        >
            <div className="flex justify-end mb-6">
                <CyberButton onClick={() => setShowForm(!showForm)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Nueva Evidencia
                </CyberButton>
            </div>

            {/* Formulario Nueva Evidencia */}
            {showForm && (
                <GlassCard className="mb-8 p-6 animate-in slide-in-from-top-4">
                    <h3 className="text-xl font-bold text-white mb-4">Registrar Cadena de Custodia</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Descripción</label>
                                <input
                                    type="text"
                                    className="w-full bg-black/40 border border-white/10 rounded p-2 text-white"
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Tipo de Evidencia</label>
                                <select
                                    className="w-full bg-black/40 border border-white/10 rounded p-2 text-white"
                                    value={formData.type}
                                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                                >
                                    <option value="disk_image">Imagen de Disco</option>
                                    <option value="memory_dump">Volcado de Memoria</option>
                                    <option value="log_file">Archivo de Log</option>
                                    <option value="physical_device">Dispositivo Físico</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Ubicación Física/Digital</label>
                                <input
                                    type="text"
                                    className="w-full bg-black/40 border border-white/10 rounded p-2 text-white"
                                    value={formData.location}
                                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Adquirido Por</label>
                                <input
                                    type="text"
                                    className="w-full bg-black/40 border border-white/10 rounded p-2 text-white"
                                    value={formData.acquiredBy}
                                    onChange={e => setFormData({ ...formData, acquiredBy: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="flex justify-end pt-4">
                            <CyberButton type="submit" variant="primary">
                                <Save className="w-4 h-4 mr-2" />
                                Guardar Registro
                            </CyberButton>
                        </div>
                    </form>
                </GlassCard>
            )}

            {/* Lista de Evidencias */}
            <div className="grid grid-cols-1 gap-4">
                {loading ? (
                    <div className="text-center text-gray-400 py-10">Cargando evidencias...</div>
                ) : evidence.length === 0 ? (
                    <div className="text-center py-10 border border-dashed border-gray-700 rounded-lg">
                        <p className="text-gray-400">No hay evidencias registradas.</p>
                    </div>
                ) : (
                    evidence.map((item) => (
                        <GlassCard key={item.id} className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-500/10 rounded-lg">
                                    {item.type === 'disk_image' ? <HardDrive className="w-6 h-6 text-blue-400" /> :
                                        item.type === 'memory_dump' ? <Fingerprint className="w-6 h-6 text-purple-400" /> :
                                            <FileSearch className="w-6 h-6 text-green-400" />}
                                </div>
                                <div>
                                    <h4 className="text-white font-bold">{item.description}</h4>
                                    <p className="text-sm text-gray-400">
                                        Custodio: {item.custodian} | Ubicación: {item.location}
                                    </p>
                                    <span className="text-xs text-blue-400 mt-1 inline-block bg-blue-900/20 px-2 py-0.5 rounded">
                                        {item.status}
                                    </span>
                                </div>
                            </div>
                            <div className="text-right text-xs text-gray-500">
                                <p>Adquirido: {new Date(item.createdAt).toLocaleDateString()}</p>
                                <p>Hash: {item.hashValue || 'Pendiente'}</p>
                            </div>
                        </GlassCard>
                    ))
                )}
            </div>
        </CSIRTModuleLayout>
    );
}
