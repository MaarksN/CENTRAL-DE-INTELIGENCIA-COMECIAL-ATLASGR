import { useState } from 'react';
import { Logo } from './components/Logo';
import { Prospector } from './components/Prospector';
import { CrmBoard } from './components/CrmBoard';
import { Intelligence } from './components/Intelligence';
import { Lead, LeadStatus } from './types';
import { LayoutDashboard, Users, Zap } from 'lucide-react';

type TabType = 'prospect' | 'crm' | 'intelligence';

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
        <div className="min-h-screen bg-gray-50 text-[#333333] font-sans">
            {/* Header com identidade Atlas */}
            <header className="bg-white border-b-4 border-atlas-orange sticky top-0 z-30 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Logo className="h-10" />
                        <div className="h-8 w-px bg-gray-200 mx-2 hidden md:block"></div>
                        <span className="font-bold text-xs tracking-widest uppercase text-gray-400 hidden md:block">Smart CRM</span>
                    </div>
                    
                    <nav className="flex gap-2">
                        <button
                            onClick={() => setActiveTab('prospect')}
                            className={`flex items-center gap-2 px-4 py-2.5 font-bold text-sm uppercase tracking-wider rounded-xl transition-all cursor-pointer ${activeTab === 'prospect' ? 'bg-atlas-dark text-white shadow-md' : 'text-gray-500 hover:bg-gray-100 hover:text-atlas-dark'}`}
                        >
                            <Users size={16} /> <span className="hidden sm:inline">Prospector</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('crm')}
                            className={`flex items-center gap-2 px-4 py-2.5 font-bold text-sm uppercase tracking-wider rounded-xl transition-all cursor-pointer ${activeTab === 'crm' ? 'bg-atlas-dark text-white shadow-md' : 'text-gray-500 hover:bg-gray-100 hover:text-atlas-dark'}`}
                        >
                            <LayoutDashboard size={16} /> <span className="hidden sm:inline">CRM</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('intelligence')}
                            className={`flex items-center gap-2 px-4 py-2.5 font-bold text-sm uppercase tracking-wider rounded-xl transition-all cursor-pointer ${activeTab === 'intelligence' ? 'bg-atlas-dark text-white shadow-md' : 'text-gray-500 hover:bg-gray-100 hover:text-atlas-dark'}`}
                        >
                            <Zap size={16} className={activeTab === 'intelligence' ? 'text-atlas-orange' : ''} /> <span className="hidden sm:inline">Intelligence</span>
                        </button>
                    </nav>
                </div>
            </header>

            <main className="max-w-7xl mx-auto p-6 md:py-10">
                {activeTab === 'prospect' && <Prospector onSaveLead={handleSaveLead} />}
                {activeTab === 'crm' && <CrmBoard leads={leads} onUpdateStatus={handleUpdateLeadStatus} />}
                {activeTab === 'intelligence' && <Intelligence />}
            </main>
        </div>
    );
}
