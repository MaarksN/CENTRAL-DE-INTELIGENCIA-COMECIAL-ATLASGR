import React, { useState, useEffect } from 'react';
import { Building2, Target, Activity, CheckCircle2 } from 'lucide-react';
import { Lead, Activity as ActivityType, Company } from '../../../types';
import { api } from '../../../lib/api';

export function Dashboard() {
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
        { title: 'Empresas Cadastradas', value: stats.totalCompanies, icon: Building2, color: 'text-blue-600', bg: 'bg-blue-50' },
        { title: 'Leads Ativos', value: stats.activeLeads, icon: Target, color: 'text-orange-600', bg: 'bg-orange-50' },
        { title: 'Atividades Pendentes', value: stats.pendingActivities, icon: Activity, color: 'text-purple-600', bg: 'bg-purple-50' },
        { title: 'Negócios Ganhos', value: stats.wonDeals, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' }
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
            <div className="max-w-7xl mx-auto space-y-6">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
                    <p className="text-gray-500 mt-1">Visão geral do sistema</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {cards.map((card, index) => (
                        <div key={index} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
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
    );
}
