import React from 'react';
import { Lead, LeadStatus } from '../types';
import { Building2, MapPin, MoreHorizontal, ArrowRight, Phone, TrendingUp, Mail, MessageCircle } from 'lucide-react';

interface CrmBoardProps {
    leads: Lead[];
    onUpdateStatus: (id: string, status: LeadStatus) => void;
}

const COLUMNS: { id: LeadStatus; title: string; color: string }[] = [
    { id: 'Prospect', title: 'Prospect', color: 'bg-gray-200 text-gray-700' },
    { id: 'Qualificado', title: 'Qualificado', color: 'bg-blue-100 text-blue-700' },
    { id: 'Proposta', title: 'Proposta', color: 'bg-atlas-yellow text-atlas-dark' },
    { id: 'Fechado', title: 'Fechado', color: 'bg-green-100 text-green-700' }
];

export function CrmBoard({ leads, onUpdateStatus }: CrmBoardProps) {
    
    const getNextStatus = (current: LeadStatus): LeadStatus | null => {
        const idx = COLUMNS.findIndex(c => c.id === current);
        if (idx >= 0 && idx < COLUMNS.length - 1) return COLUMNS[idx + 1].id;
        return null;
    };

    return (
        <div className="h-full min-h-[70vh] animate-in fade-in duration-500">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="font-black text-2xl text-atlas-dark">Módulo CRM</h2>
                    <p className="text-gray-500 text-sm mt-1">Gerencie seu funil de vendas e acompanhe negociações.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {COLUMNS.map(column => {
                    const columnLeads = leads.filter(l => l.status === column.id);
                    
                    return (
                        <div key={column.id} className="flex flex-col bg-gray-50 rounded-2xl p-4 border border-gray-100 h-full min-h-[500px]">
                            <div className="flex items-center justify-between mb-4 px-2">
                                <h3 className="font-bold text-sm uppercase tracking-wider text-atlas-dark">{column.title}</h3>
                                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${column.color}`}>
                                    {columnLeads.length}
                               </span>
                            </div>
                            
                            <div className="flex-1 space-y-3">
                                {columnLeads.map(lead => (
                                    <div key={lead.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all group animate-in fade-in slide-in-from-top-2">
                                        <div className="flex justify-between items-start mb-3">
                                            <h4 className="font-bold text-atlas-dark leading-tight pr-2">{lead.name}</h4>
                                            <button className="text-gray-400 hover:text-atlas-orange transition-colors shrink-0">
                                                <MoreHorizontal size={16} />
                                            </button>
                                        </div>
                                        
                                        <div className="space-y-2 mb-4">
                                            {lead.fitScore && (
                                                <div className="flex items-center gap-1.5 mb-2">
                                                    <span className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${lead.fitScore >= 90 ? 'bg-green-100 text-green-700' : lead.fitScore >= 80 ? 'bg-blue-100 text-blue-700' : 'bg-atlas-yellow/20 text-atlas-dark'}`}>
                                                        <TrendingUp size={10} />
                                                        Fit {lead.fitScore}%
                                                    </span>
                                                </div>
                                            )}
                                            <div className="flex items-center text-xs font-medium text-gray-500 gap-1.5">
                                                <Building2 size={12} className="text-gray-400 shrink-0"/>
                                                <span className="truncate">{lead.segment} • {lead.size}</span>
                                            </div>
                                            <div className="flex items-center text-xs font-medium text-gray-500 gap-1.5">
                                                <MapPin size={12} className="text-gray-400 shrink-0"/>
                                                <span className="truncate">{lead.location}</span>
                                            </div>
                                        </div>
                                        
                                        <div className="pt-3 border-t border-gray-50 flex items-center justify-between">
                                            <div className="flex items-center gap-1">
                                                <button title="Ligar" className="p-1.5 text-gray-400 hover:text-atlas-orange hover:bg-orange-50 rounded-lg transition-colors">
                                                    <Phone size={14} />
                                                </button>
                                                <button title="WhatsApp" className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                                                    <MessageCircle size={14} />
                                                </button>
                                                <button title="E-mail" className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                    <Mail size={14} />
                                                </button>
                                            </div>
                                            
                                            {getNextStatus(lead.status) && (
                                                <button 
                                                    onClick={() => onUpdateStatus(lead.id, getNextStatus(lead.status)!)}
                                                    className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-atlas-orange hover:bg-orange-50 px-2 py-1.5 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                                >
                                                    Avançar <ArrowRight size={12} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                
                                {columnLeads.length === 0 && (
                                    <div className="h-24 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center">
                                        <span className="text-xs font-bold text-gray-400 uppercase">Vazio</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
