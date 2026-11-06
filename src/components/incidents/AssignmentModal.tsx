'use client';

import { useState, useEffect } from 'react';
import { X, Search, User, Shield, Briefcase } from 'lucide-react';

interface Employee {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    department?: {
        name: string;
    };
}

interface AssignmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAssign: (employeeId: string) => void;
    caseId?: string;
}

export default function AssignmentModal({ isOpen, onClose, onAssign, caseId }: AssignmentModalProps) {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            fetchEmployees();
        }
    }, [isOpen]);

    const fetchEmployees = async () => {
        try {
            // In a real implementation, we would fetch from an API
            // For now, we'll simulate some data if the API doesn't exist yet
            // const res = await fetch('/api/employees'); 
            // const data = await res.json();

            // Simulating API response for UI development
            setTimeout(() => {
                setEmployees([
                    { id: 'emp_1', firstName: 'Carlos', lastName: 'Rodriguez', email: 'carlos@numu.com', role: 'analyst', department: { name: 'SOC' } },
                    { id: 'emp_2', firstName: 'Ana', lastName: 'Martinez', email: 'ana@numu.com', role: 'analyst', department: { name: 'Forensics' } },
                    { id: 'emp_3', firstName: 'Roberto', lastName: 'Sanchez', email: 'roberto@numu.com', role: 'manager', department: { name: 'CSIRT' } },
                ]);
                setLoading(false);
            }, 500);
        } catch (error) {
            console.error('Error fetching employees:', error);
            setLoading(false);
        }
    };

    const filteredEmployees = employees.filter(emp =>
        emp.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleConfirm = () => {
        if (selectedEmployee) {
            onAssign(selectedEmployee);
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="bg-gray-900 border border-white/10 rounded-xl w-full max-w-md shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <User className="w-5 h-5 text-purple-400" />
                        Asignar Especialista
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-4 space-y-4">
                    <p className="text-sm text-gray-400">Selecciona un analista para asignar al caso <span className="text-white font-mono">{caseId}</span></p>

                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre, email o rol..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-black/30 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                        />
                    </div>

                    {/* List */}
                    <div className="max-h-60 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                        {loading ? (
                            <div className="text-center py-8 text-gray-500">Cargando usuarios...</div>
                        ) : filteredEmployees.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">No se encontraron usuarios</div>
                        ) : (
                            filteredEmployees.map((emp) => (
                                <div
                                    key={emp.id}
                                    onClick={() => setSelectedEmployee(emp.id)}
                                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${selectedEmployee === emp.id
                                            ? 'bg-purple-500/20 border-purple-500/50'
                                            : 'bg-white/5 border-transparent hover:bg-white/10 hover:border-white/10'
                                        }`}
                                >
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${selectedEmployee === emp.id ? 'bg-purple-500 text-white' : 'bg-gray-700 text-gray-300'
                                        }`}>
                                        {emp.firstName[0]}{emp.lastName[0]}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-medium text-white truncate">
                                            {emp.firstName} {emp.lastName}
                                        </h4>
                                        <p className="text-xs text-gray-400 truncate">{emp.email}</p>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <span className="px-2 py-0.5 rounded text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 capitalize">
                                            {emp.role}
                                        </span>
                                        {emp.department && (
                                            <span className="text-[10px] text-gray-500 flex items-center gap-1">
                                                <Briefcase className="w-3 h-3" />
                                                {emp.department.name}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-white/10 bg-white/5 flex items-center justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={!selectedEmployee}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedEmployee
                                ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-900/20'
                                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                            }`}
                    >
                        Confirmar Asignación
                    </button>
                </div>
            </div>
        </div>
    );
}
