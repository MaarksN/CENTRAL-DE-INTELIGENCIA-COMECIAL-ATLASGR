import React from "react";
import { useState, useEffect } from 'react';
import { Lead, LeadStatus } from '../types';
import { KanbanColumn } from '../features/crm/components/KanbanColumn';

const COLUMNS: LeadStatus[] = [
    'Novo Lead',
    'Qualificação',
    'Primeiro Contato',
    'Diagnóstico',
    'Proposta',
    'Negociação',
    'Fechado Ganho',
    'Fechado Perdido'
];

export function CrmBoard() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchLeads = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/leads');
            if (res.ok) {
                const data = await res.json();
                setLeads(data);
            }
        } catch (error) {
            console.error('Error fetching leads:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeads();
    }, []);

    const handleDragStart = (e: React.DragEvent, leadId: string) => {
        e.dataTransfer.setData('leadId', leadId);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = async (e: React.DragEvent, status: LeadStatus) => {
        e.preventDefault();
        const leadId = e.dataTransfer.getData('leadId');
        if (!leadId) return;

        // Optimistic update
        setLeads(prev => prev.map(lead => lead.id === leadId ? { ...lead, status } : lead));

        try {
            await fetch(`/api/leads/${leadId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
        } catch (error) {
            console.error('Error updating lead status:', error);
            fetchLeads(); // Revert on error
        }
    };

    const handleCardClick = (lead: Lead) => {
        // To be implemented: Open Lead Detail Modal/Drawer
        console.log('Clicked lead:', lead);
    };

    return (
        <div className="flex-1 flex flex-col h-full bg-white animate-in fade-in duration-500 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
                <div>
                    <h2 className="font-bold text-2xl text-gray-900">Pipeline de Vendas</h2>
                    <p className="text-gray-500 text-sm mt-1">Arraste os cards para atualizar o estágio da negociação</p>
                </div>
            </div>

            <div className="flex-1 overflow-x-auto overflow-y-hidden p-6 custom-scrollbar bg-gray-50/30">
                {loading ? (
                    <div className="h-full flex items-center justify-center">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                            <p className="text-gray-500 font-medium">Carregando pipeline...</p>
                        </div>
                    </div>
                ) : (
                    <div className="flex gap-6 h-full items-start">
                        {COLUMNS.map(status => (
                            <KanbanColumn
                                key={status}
                                status={status}
                                leads={leads.filter(l => l.status === status)}
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                onCardDragStart={handleDragStart}
                                onCardClick={handleCardClick}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
