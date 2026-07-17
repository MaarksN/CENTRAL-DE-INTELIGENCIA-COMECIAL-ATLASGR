import React from "react";
import { Lead } from '../../../types';
import { Building2, User, Calendar } from 'lucide-react';

interface KanbanCardProps {
    key?: string;
    lead: Lead;
    onDragStart: (e: React.DragEvent, leadId: string) => void;
    onClick: (lead: Lead) => void;
}

export const KanbanCard = React.memo(function KanbanCard({ lead, onDragStart, onClick }: KanbanCardProps) {
    const handleDragStart = (e: React.DragEvent) => {
        e.dataTransfer.setData('leadId', lead.id);
        onDragStart(e, lead.id);
    };

    return (
        <div
            draggable
            onDragStart={handleDragStart}
            onClick={() => onClick(lead)}
            className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm cursor-grab active:cursor-grabbing hover:border-blue-300 hover:shadow-md transition-all group"
        >
            <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                    {lead.company?.tradeName || lead.company?.legalName || lead.name || 'Sem Empresa'}
                </h4>
                {lead.score && (
                    <span className="text-xs font-semibold bg-blue-50 text-blue-700 px-2 py-1 rounded-lg">
                        {lead.score}
                    </span>
                )}
            </div>

            <div className="space-y-2 mt-3 text-sm text-gray-500">
                {lead.contact && (
                    <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-gray-400" />
                        <span className="truncate">{lead.contact.name}</span>
                    </div>
                )}
                {lead.company?.segment && (
                    <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-gray-400" />
                        <span className="truncate">{lead.company.segment}</span>
                    </div>
                )}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(lead.updatedAt || lead.createdAt || '').toLocaleDateString('pt-BR')}
                    </div>
                </div>
            </div>
        </div>
    );
});
