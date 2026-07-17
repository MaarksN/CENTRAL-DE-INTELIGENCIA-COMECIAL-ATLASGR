import { useState } from 'react';
import { MainLayout } from './components/layout/MainLayout';
import { TabType } from './components/layout/Header';
import { Lead } from './types/index';

import { Prospector } from './components/Prospector';
import { CrmBoard } from './components/CrmBoard';
import { Intelligence } from './components/Intelligence';
import { Dashboard } from './features/dashboard/components/Dashboard';
import { CompanyList } from './features/companies/components/CompanyList';
import { ContactList } from './features/contacts/components/ContactList';
import { ActivityList } from './features/activities/components/ActivityList';

export default function App() {
    const [activeTab, setActiveTab] = useState<TabType>('dashboard');

    const handleSaveLead = async (newLead: Omit<Lead, 'id' | 'status'>) => {
        try {
            await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...newLead, status: 'Novo Lead' })
            });
            setActiveTab('crm');
        } catch (error) {
            console.error("Error saving prospect as lead", error);
        }
    };

    return (
        <MainLayout activeTab={activeTab} onTabChange={setActiveTab}>
            {activeTab === 'dashboard' && <Dashboard />}
            {activeTab === 'companies' && <CompanyList />}
            {activeTab === 'contacts' && <ContactList />}
            {activeTab === 'crm' && <CrmBoard />}
            {activeTab === 'activities' && <ActivityList />}
            {activeTab === 'prospect' && <Prospector onSaveLead={handleSaveLead} />}
            {activeTab === 'intelligence' && <Intelligence />}
        </MainLayout>
    );
}
