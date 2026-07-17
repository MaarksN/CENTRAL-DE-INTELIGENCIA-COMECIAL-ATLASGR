import React from "react";
import { LeadStatus, Lead } from '../../../types';
import { KanbanCard } from './KanbanCard';

interface KanbanColumnProps {
    key?: string;
    status: LeadStatus;
    leads: Lead[];
    onDrop: (e: React.DragEvent, status: LeadStatus) => void;
    onDragOver: (e: React.DragEvent) => void;
    onCardDragStart: (e: React.DragEvent, leadId: string) => void;
    onCardClick: (lead: Lead) => void;
}

export const KanbanColumn = React.memo(function KanbanColumn({ status, leads, onDrop, onDragOver, onCardDragStart, onCardClick }: KanbanColumnProps) {
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        onDrop(e, status);
    };

    return (
        <div
            className="flex flex-col bg-gray-50 rounded-2xl min-w-[320px] max-w-[320px] shrink-0 border border-gray-200 shadow-sm"
            onDrop={handleDrop}
            onDragOver={onDragOver}
        >
            <div className="p-4 border-b border-gray-200 bg-gray-50/80 rounded-t-2xl sticky top-0 backdrop-blur-sm z-10 flex justify-between items-center">
                <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    {status}
                </h3>
                <span className="bg-gray-200 text-gray-600 text-xs font-medium px-2.5 py-1 rounded-full">
                    {leads.length}
                </span>
            </div>

            <div className="p-3 flex-1 overflow-y-auto space-y-3 min-h-[150px] custom-scrollbar">
                {leads.map(lead => (
                    <KanbanCard
                        key={lead.id}
                        lead={lead}
                        onDragStart={onCardDragStart}
                        onClick={onCardClick}
                    />
                ))}
                {leads.length === 0 && (
                    <div className="h-full min-h-[100px] border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center text-gray-400 text-sm">
                        Solte cards aqui
                    </div>
                )}
            </div>
        </div>
    );
});
