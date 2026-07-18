import { useState } from 'react';
import { MainLayout } from './components/layout/MainLayout';
import { TabType } from './components/layout/Header';

import { ProspectingHub } from './features/prospecting/components/ProspectingHub';
import { EnricherHub } from './features/prospecting/components/EnricherHub';
import { CrmBoard } from './components/CrmBoard';
import { Intelligence } from './components/Intelligence';
import { Dashboard } from './features/dashboard/components/Dashboard';
import { CompanyList } from './features/companies/components/CompanyList';
import { ContactList } from './features/contacts/components/ContactList';
import { ActivityList } from './features/activities/components/ActivityList';

export default function App() {
    const [activeTab, setActiveTab] = useState<TabType>('dashboard');

    return (
        <MainLayout activeTab={activeTab} onTabChange={setActiveTab}>
            {activeTab === 'dashboard' && <Dashboard onNavigate={setActiveTab} />}
            {activeTab === 'companies' && <CompanyList />}
            {activeTab === 'contacts' && <ContactList />}
            {activeTab === 'crm' && <CrmBoard />}
            {activeTab === 'activities' && <ActivityList />}
            {activeTab === 'prospect' && <ProspectingHub />}
            {activeTab === 'enrich' && <EnricherHub />}
            {activeTab === 'intelligence' && <Intelligence />}
        </MainLayout>
    );
}
