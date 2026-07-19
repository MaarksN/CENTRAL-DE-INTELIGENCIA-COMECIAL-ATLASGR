import { useState, useEffect } from 'react';
import { Building2, Target, Activity, CheckCircle2, LayoutTemplate, Users, Search, Sparkles, ArrowRight } from 'lucide-react';
import { Lead, Activity as ActivityType, Company } from '../../../types';
import { api } from '../../../lib/api';
import type { TabType } from '../../../components/layout/Header';

interface DashboardProps {
    onNavigate: (tab: TabType) => void;
}

const NAV_CARDS: Array<{ tab: TabType; emoji: string; title: string; desc: string; icon: typeof LayoutTemplate; color: string; bg: string }> = [
    { tab: 'crm', emoji: '🎯', title: 'CRM / Pipeline', desc: 'Acompanhe negociações estágio por estágio.', icon: LayoutTemplate, color: 'text-blue-600', bg: 'bg-blue-50' },
    { tab: 'companies', emoji: '🏢', title: 'Empresas & Contatos', desc: 'Gerencie sua carteira de clientes e pessoas.', icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { tab: 'prospect', emoji: '🔍', title: 'Prospector', desc: 'Descubra novas empresas via Google Places e Apollo.', icon: Search, color: 'text-orange-600', bg: 'bg-orange-50' },
    { tab: 'enrich', emoji: '🧪', title: 'Enriquecedor', desc: 'Rode o enriquecimento completo em qualquer empresa.', icon: Sparkles, color: 'text-purple-600', bg: 'bg-purple-50' },
];

/** Isolado num componente próprio para que o tick de 1s não re-renderize o resto do Dashboard. */
function LiveClock() {
    const [now, setNow] = useState(() => new Date());

    useEffect(() => {
        const interval = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    const dateLabel = now.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
    const timeLabel = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    return (
        <div className="text-right">
            <p className="text-sm font-medium text-gray-600 capitalize">{dateLabel}</p>
            <p className="text-2xl font-black text-atlas-dark tabular-nums">🕐 {timeLabel}</p>
        </div>
    );
}

export function Dashboard({ onNavigate }: DashboardProps) {
    const [stats, setStats] = useState({
        totalCompanies: 0,
        activeLeads: 0,
        pendingActivities: 0,
        wonDeals: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [companiesRes, leadsRes, activities] = await Promise.all([
                    api.get<{ data: Company[] }>('/api/companies?limit=1000'),
                    api.get<{ data: Lead[] }>('/api/leads?limit=1000'),
                    api.get<ActivityType[]>('/api/activities')
                ]);
                const companies = companiesRes.data;
                const leads = leadsRes.data;

                setStats({
                    totalCompanies: companies.length,
                    activeLeads: leads.filter((l: Lead) => l.status !== 'Fechado Ganho' && l.status !== 'Fechado Perdido').length,
                    pendingActivities: activities.filter((a: ActivityType) => a.status === 'Pendente').length,
                    wonDeals: leads.filter((l: Lead) => l.status === 'Fechado Ganho').length
                });
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const cards = [
        { title: '🏢 Empresas Cadastradas', value: stats.totalCompanies, icon: Building2, color: 'text-blue-600', bg: 'bg-blue-50' },
        { title: '🎯 Leads Ativos', value: stats.activeLeads, icon: Target, color: 'text-orange-600', bg: 'bg-orange-50' },
        { title: '⏰ Atividades Pendentes', value: stats.pendingActivities, icon: Activity, color: 'text-purple-600', bg: 'bg-purple-50' },
        { title: '🏆 Negócios Ganhos', value: stats.wonDeals, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' }
    ];

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center bg-gray-50/50">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto bg-gray-50/50 p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">📊 Dashboard</h1>
                        <p className="text-gray-500 mt-1">Visão geral do sistema</p>
                    </div>
                    <LiveClock />
                </div>

                <div>
                    <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Atalhos Rápidos</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {NAV_CARDS.map((card) => (
                            <button
                                key={card.tab}
                                onClick={() => onNavigate(card.tab)}
                                className="text-left bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-atlas-orange/40 transition-all group"
                            >
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${card.bg} ${card.color}`}>
                                    <card.icon className="w-6 h-6" />
                                </div>
                                <h3 className="font-black text-lg text-atlas-dark flex items-center gap-2 mb-1">
                                    {card.emoji} {card.title}
                                </h3>
                                <p className="text-sm text-gray-500 mb-3">{card.desc}</p>
                                <span className="text-xs font-bold uppercase tracking-wider text-atlas-orange flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    Abrir <ArrowRight className="w-3 h-3" />
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Números Gerais</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {cards.map((card, index) => (
                            <div key={index} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${card.bg} ${card.color}`}>
                                    {<card.icon className="w-6 h-6" />}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">{card.title}</p>
                                    <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
