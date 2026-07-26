import { useState } from 'react';
import {
  Home, Shield, Truck, ChevronDown, Award, Sun, Moon,
  Search, LayoutTemplate, Target, Building2, User, Activity, Bot
} from 'lucide-react';
import { Logo } from '../Logo';
import { TotalTrackLogo } from '../TotalTrackLogo';
import { useBrand } from '../../contexts/BrandContext';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { PRESET_USERS } from '../../features/auth/constants/userPresets';

export type TabType = 'dashboard' | 'companies' | 'contacts' | 'crm' | 'activities' | 'prospect' | 'enrich' | 'intelligence' | 'prompts' | 'chatbook';

interface HeaderProps {
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
}

export function Header({ activeTab, onTabChange }: HeaderProps) {
    const { activeBrand, setActiveBrand } = useBrand();
    const { currentUser, isAdmin, loginAsPreset } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [showUserMenu, setShowUserMenu] = useState(false);

    return (
        <header className="bg-slate-950/90 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50 shadow-xl text-slate-100 font-sans">
            <div className="w-full px-4 md:px-8 h-20 flex items-center justify-between gap-4">
                
                {/* Esquerda: Logo e Alternador de Marcas */}
                <div className="flex items-center gap-4 shrink-0">
                    <div 
                        className="cursor-pointer hover:opacity-85 transition-all flex items-center gap-2"
                        onClick={() => onTabChange('dashboard')}
                    >
                        {activeBrand === 'atlasgr' ? (
                            <Logo className="h-8 text-white" />
                        ) : (
                            <TotalTrackLogo className="h-8 text-white" />
                        )}
                        <span className="text-[10px] font-black uppercase tracking-widest text-atlas-orange bg-atlas-orange/10 px-2 py-0.5 rounded-full border border-atlas-orange/20 shadow-2xs">OS</span>
                    </div>

                    {/* Alternador AtlasGR / TotalTrac (Liberado para Todos) */}
                    <div className="flex items-center bg-slate-900/90 p-1 rounded-full border border-white/10 text-xs font-black shadow-inner">
                        <button
                            onClick={() => setActiveBrand('atlasgr')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                                activeBrand === 'atlasgr'
                                    ? 'bg-gradient-to-r from-atlas-orange to-white text-slate-950 shadow-md'
                                    : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            <Shield className="w-3.5 h-3.5" />
                            <span>AtlasGR</span>
                        </button>

                        <button
                            onClick={() => setActiveBrand('totaltrac')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                                activeBrand === 'totaltrac'
                                    ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md'
                                    : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            <Truck className="w-3.5 h-3.5" />
                            <span>TotalTrac</span>
                        </button>
                    </div>
                </div>

                {/* Centro: Menu Navegacional de Ferramentas da Plataforma (Exibido apenas dentro das ferramentas) */}
                {activeTab !== 'dashboard' && (
                    <div className="hidden lg:flex items-center bg-slate-900/80 p-1.5 rounded-2xl border border-white/10 gap-1 animate-fade-in">
                        <button
                            onClick={() => onTabChange('dashboard')}
                            className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer text-gray-400 hover:text-white"
                        >
                            <Home className="w-3.5 h-3.5 text-atlas-orange" /> Início (Cards)
                        </button>
                        <button
                            onClick={() => onTabChange('prospect')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                                activeTab === 'prospect' ? 'bg-atlas-orange text-white font-extrabold shadow-md' : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            <Search className="w-3.5 h-3.5" /> Prospecção
                        </button>
                        <button
                            onClick={() => onTabChange('crm')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                                activeTab === 'crm' ? 'bg-atlas-orange text-white font-extrabold shadow-md' : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            <LayoutTemplate className="w-3.5 h-3.5" /> CRM
                        </button>
                        <button
                            onClick={() => onTabChange('intelligence')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                                activeTab === 'intelligence' ? 'bg-atlas-orange text-white font-extrabold shadow-md' : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            <Target className="w-3.5 h-3.5" /> Metodologias
                        </button>
                        <button
                            onClick={() => onTabChange('companies')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                                activeTab === 'companies' ? 'bg-atlas-orange text-white font-extrabold shadow-md' : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            <Building2 className="w-3.5 h-3.5" /> Empresas
                        </button>
                        <button
                            onClick={() => onTabChange('contacts')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                                activeTab === 'contacts' ? 'bg-atlas-orange text-white font-extrabold shadow-md' : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            <User className="w-3.5 h-3.5" /> Contatos
                        </button>
                        <button
                            onClick={() => onTabChange('activities')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                                activeTab === 'activities' ? 'bg-atlas-orange text-white font-extrabold shadow-md' : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            <Activity className="w-3.5 h-3.5" /> Agenda
                        </button>
                        <button
                            onClick={() => onTabChange('chatbook')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                                activeTab === 'chatbook' ? 'bg-atlas-orange text-white font-extrabold shadow-md' : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            <Bot className="w-3.5 h-3.5" /> Roleplay & Objeções
                        </button>
                    </div>
                )}

                {/* Direita: Alternador Tema, Perfil de Usuário & Troca de Conta */}
                <nav className="flex items-center justify-end gap-3 shrink-0">
                    {/* Botão Tema Claro / Escuro */}
                    <button
                        onClick={toggleTheme}
                        aria-label="Alternar Tema Claro / Escuro"
                        className="p-2.5 rounded-2xl bg-slate-900 border border-white/10 hover:border-atlas-orange transition-all cursor-pointer text-atlas-yellow hover:scale-105 active:scale-95 shadow-md flex items-center justify-center"
                        title={theme === 'dark' ? 'Mudar para Modo Claro (Light Mode)' : 'Mudar para Modo Escuro (Dark Mode)'}
                    >
                        {theme === 'dark' ? (
                            <Sun className="w-4 h-4 text-atlas-yellow" />
                        ) : (
                            <Moon className="w-4 h-4 text-white/70" />
                        )}
                    </button>

                    {/* Perfil do Usuário Logado */}
                    <div className="relative">
                        <button
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className="flex items-center gap-2.5 p-1.5 pr-3 rounded-2xl bg-slate-900 border border-white/10 hover:border-white/20 transition-all cursor-pointer outline-none"
                        >
                            <div className={`w-8 h-8 rounded-xl font-black text-white text-xs flex items-center justify-center shadow-md ${currentUser?.avatarBg || 'bg-atlas-orange'}`}>
                                {currentUser?.name.charAt(0) || 'M'}
                            </div>
                            <div className="text-left hidden md:block">
                                <div className="flex items-center gap-1.5">
                                    <span className="font-extrabold text-white text-xs">{currentUser?.name || 'Marcelo Nascimento'}</span>
                                    {isAdmin ? (
                                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-atlas-yellow/20 text-atlas-yellow font-black border border-atlas-yellow/30 flex items-center gap-0.5">
                                            <Award className="w-3 h-3 text-atlas-yellow" /> ADMIN
                                        </span>
                                    ) : (
                                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/10 text-gray-300 font-bold border border-white/15">
                                            USUÁRIO
                                        </span>
                                    )}
                                </div>
                                <span className="text-[10px] text-gray-400 font-medium block truncate max-w-[170px]">{currentUser?.email}</span>
                            </div>
                            <ChevronDown className="w-4 h-4 text-gray-400" />
                        </button>

                        {/* Dropdown de Perfis Pré-Autorizados */}
                        {showUserMenu && (
                            <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-white/10 rounded-2xl p-3 shadow-2xl z-50 space-y-2">
                                <div className="p-2 border-b border-white/10">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Perfil Conectado</span>
                                    <p className="text-xs font-bold text-white mt-0.5">{currentUser?.name}</p>
                                    <p className="text-[11px] text-success font-semibold">{currentUser?.roleTitle}</p>
                                </div>

                                <div className="space-y-1">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2 block mb-1">Trocar de Conta</span>
                                    {PRESET_USERS.map((preset) => (
                                        <button
                                            key={preset.id}
                                            onClick={() => {
                                                loginAsPreset(preset);
                                                setShowUserMenu(false);
                                            }}
                                            className={`w-full text-left p-2 rounded-xl text-xs flex items-center justify-between transition-all cursor-pointer ${
                                                currentUser?.email === preset.email
                                                    ? 'bg-atlas-orange/20 text-white font-bold border border-atlas-orange/40'
                                                    : 'text-gray-300 hover:bg-slate-800 hover:text-white'
                                            }`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <div className={`w-6 h-6 rounded-lg ${preset.avatarBg} text-white font-bold text-[10px] flex items-center justify-center`}>
                                                    {preset.name.charAt(0)}
                                                </div>
                                                <span className="truncate max-w-[130px] font-semibold">{preset.name}</span>
                                            </div>
                                            <span className="text-[9px] uppercase font-bold text-gray-400">{preset.brand}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </nav>

            </div>
        </header>
    );
}
