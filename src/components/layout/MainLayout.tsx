import { ReactNode } from 'react';
import { Header, TabType } from './Header';
import { Toaster } from '../ui/Toaster';
import { motion, AnimatePresence } from 'motion/react';

interface MainLayoutProps {
    children: ReactNode;
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
}

export function MainLayout({ children, activeTab, onTabChange }: MainLayoutProps) {
    return (
        <div className="h-screen w-full flex flex-col bg-gray-50 text-[#333333] font-sans overflow-hidden">
            <Header activeTab={activeTab} onTabChange={onTabChange} />
            <main className="flex-1 flex flex-col min-h-0 overflow-hidden relative bg-[#F9FAFB]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="flex-1 flex flex-col min-h-0 overflow-hidden"
                    >
                        {children}
                    </motion.div>
                </AnimatePresence>
            </main>
            <Toaster />
        </div>
    );
}
