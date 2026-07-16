import { useState } from 'react';
import { Prospector } from './components/Prospector';
import { CrmBoard } from './components/CrmBoard';
import { Intelligence } from './components/Intelligence';
import { MainLayout } from './components/layout/MainLayout';
import { TabType } from './components/layout/Header';
import { Lead, LeadStatus } from './types/index';

export default function App() {
    const [activeTab, setActiveTab] = useState<TabType>('prospect');
    const [leads, setLeads] = useState<Lead[]>([
        { id: '1', name: 'Logística Alfa', segment: 'Carga Fechada', size: '100 veículos', location: 'São Paulo, SP', status: 'Qualificado', fitScore: 82 },
        { id: '2', name: 'Transportes Beta', segment: 'Fracionado', size: '250 veículos', location: 'Campinas, SP', status: 'Proposta', fitScore: 95 }
    ]);

    const handleSaveLead = (newLead: Omit<Lead, 'id' | 'status'>) => {
        const lead: Lead = {
            ...newLead,
            id: Math.random().toString(36).substr(2, 9),
            status: 'Prospect'
        };
        setLeads(prev => [lead, ...prev]);
        setActiveTab('crm');
    };

    const handleUpdateLeadStatus = (id: string, status: LeadStatus) => {
        setLeads(prev => prev.map(lead => lead.id === id ? { ...lead, status } : lead));
    };

    return (
        <MainLayout activeTab={activeTab} onTabChange={setActiveTab}>
            {activeTab === 'prospect' && <Prospector onSaveLead={handleSaveLead} />}
            {activeTab === 'crm' && <CrmBoard leads={leads} onUpdateStatus={handleUpdateLeadStatus} />}
            {activeTab === 'intelligence' && <Intelligence />}
        </MainLayout>
    );
}
