import { ReactNode } from 'react';
import { Header, TabType } from './Header';
import { Toaster } from '../ui/Toaster';

interface MainLayoutProps {
    children: ReactNode;
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
}

export function MainLayout({ children, activeTab, onTabChange }: MainLayoutProps) {
    return (
        <div className="h-screen w-full flex flex-col bg-gray-50 text-[#333333] font-sans overflow-hidden">
            <Header activeTab={activeTab} onTabChange={onTabChange} />
            <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
                {children}
            </main>
            <Toaster />
        </div>
    );
}
