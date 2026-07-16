import { LayoutDashboard, Users, Zap } from 'lucide-react';
import { Logo } from '../Logo';

export type TabType = 'prospect' | 'crm' | 'intelligence';

interface HeaderProps {
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
}

export function Header({ activeTab, onTabChange }: HeaderProps) {
    return (
        <header className="bg-white border-b-4 border-atlas-orange sticky top-0 z-30 shadow-sm">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Logo className="h-10" />
                    <div className="h-8 w-px bg-gray-200 mx-2 hidden md:block"></div>
                    <span className="font-bold text-xs tracking-widest uppercase text-gray-400 hidden md:block">Smart CRM</span>
                </div>

                <nav className="flex gap-2">
                    <button
                        onClick={() => onTabChange('prospect')}
                        className={`flex items-center gap-2 px-4 py-2.5 font-bold text-sm uppercase tracking-wider rounded-xl transition-all cursor-pointer ${activeTab === 'prospect' ? 'bg-atlas-dark text-white shadow-md' : 'text-gray-500 hover:bg-gray-100 hover:text-atlas-dark'}`}
                    >
                        <Users size={16} /> <span className="hidden sm:inline">Prospector</span>
                    </button>
                    <button
                        onClick={() => onTabChange('crm')}
                        className={`flex items-center gap-2 px-4 py-2.5 font-bold text-sm uppercase tracking-wider rounded-xl transition-all cursor-pointer ${activeTab === 'crm' ? 'bg-atlas-dark text-white shadow-md' : 'text-gray-500 hover:bg-gray-100 hover:text-atlas-dark'}`}
                    >
                        <LayoutDashboard size={16} /> <span className="hidden sm:inline">CRM</span>
                    </button>
                    <button
                        onClick={() => onTabChange('intelligence')}
                        className={`flex items-center gap-2 px-4 py-2.5 font-bold text-sm uppercase tracking-wider rounded-xl transition-all cursor-pointer ${activeTab === 'intelligence' ? 'bg-atlas-dark text-white shadow-md' : 'text-gray-500 hover:bg-gray-100 hover:text-atlas-dark'}`}
                    >
                        <Zap size={16} className={activeTab === 'intelligence' ? 'text-atlas-orange' : ''} /> <span className="hidden sm:inline">Intelligence</span>
                    </button>
                </nav>
            </div>
        </header>
    );
}
