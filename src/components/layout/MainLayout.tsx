import { ReactNode } from 'react';
import { Header, TabType } from './Header';

interface MainLayoutProps {
    children: ReactNode;
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
}

export function MainLayout({ children, activeTab, onTabChange }: MainLayoutProps) {
    return (
        <div className="min-h-screen bg-gray-50 text-[#333333] font-sans">
            <Header activeTab={activeTab} onTabChange={onTabChange} />
            <main className="max-w-7xl mx-auto p-6 md:py-10">
                {children}
            </main>
        </div>
    );
}
