import { LayoutDashboard, Users, Zap, Building2, User, Activity, LayoutTemplate } from 'lucide-react';
import { Logo } from '../Logo';

export type TabType = 'dashboard' | 'companies' | 'contacts' | 'crm' | 'activities' | 'prospect' | 'intelligence';

interface HeaderProps {
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
}

export function Header({ activeTab, onTabChange }: HeaderProps) {
    const tabs = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'companies', label: 'Empresas', icon: Building2 },
        { id: 'contacts', label: 'Contatos', icon: User },
        { id: 'crm', label: 'Pipeline', icon: LayoutTemplate },
        { id: 'activities', label: 'Atividades', icon: Activity },
        { id: 'prospect', label: 'Prospector', icon: Users },
        { id: 'intelligence', label: 'IA', icon: Zap, highlight: true }
    ];

    return (
        <header className="bg-white border-b-4 border-atlas-orange sticky top-0 z-30 shadow-sm overflow-x-auto">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between min-w-[800px]">
                <div className="flex items-center gap-3 shrink-0 mr-6">
                    <Logo className="h-10" />
                    <div className="h-8 w-px bg-gray-200 mx-2 hidden md:block"></div>
                    <span className="font-bold text-xs tracking-widest uppercase text-gray-400 hidden md:block">Smart CRM</span>
                </div>

                <nav className="flex gap-2 shrink-0">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id as TabType)}
                            className={`flex items-center gap-2 px-3 py-2.5 font-bold text-[11px] lg:text-sm uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                                activeTab === tab.id
                                    ? 'bg-atlas-dark text-white shadow-md'
                                    : 'text-gray-500 hover:bg-gray-100 hover:text-atlas-dark'
                            }`}
                        >
                            <tab.icon size={16} className={tab.highlight && activeTab === tab.id ? 'text-atlas-orange' : ''} />
                            <span className="hidden sm:inline">{tab.label}</span>
                        </button>
                    ))}
                </nav>
            </div>
        </header>
    );
}
