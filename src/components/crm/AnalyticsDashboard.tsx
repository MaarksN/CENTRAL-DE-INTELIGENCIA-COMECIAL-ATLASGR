import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { DollarSign, Users, Briefcase, TrendingUp, Sparkles } from 'lucide-react';

const revenueData = [
  { name: 'Jan', value: 4000 },
  { name: 'Fev', value: 3000 },
  { name: 'Mar', value: 5000 },
  { name: 'Abr', value: 4500 },
  { name: 'Mai', value: 6000 },
  { name: 'Jun', value: 8000 },
];

const funnelData = [
  { stage: 'Leads', count: 1200 },
  { stage: 'Qualificados', count: 800 },
  { stage: 'Propostas', count: 400 },
  { stage: 'Fechados', count: 100 },
];

export function AnalyticsDashboard() {
  return (
    <div className="p-6 bg-slate-50 min-h-screen space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard Comercial</h1>
          <p className="text-slate-500">Acompanhamento de métricas de vendas e pipeline</p>
        </div>
      </div>

      {/* KPIs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="ICP Médio (Mês)" value="82 pts" icon={<Users size={20} />} trend="+5%" trendUp />
        <KPICard title="Score Médio (Mês)" value="65 pts" icon={<TrendingUp size={20} />} trend="+12%" trendUp />
        <KPICard title="Conversão Global" value="4.2%" icon={<TrendingUp size={20} />} trend="+0.5%" trendUp />
        <KPICard title="Follow-ups Atrasados" value="12" icon={<DollarSign size={20} />} trend="-3" trendUp={false} />
      </div>

      {/* Recommendations & Intelligence */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 shadow-sm">
        <h3 className="font-semibold text-amber-900 mb-3 flex items-center gap-2">
          <Sparkles size={18} /> Recomendações Determinísticas (Sales Intelligence)
        </h3>
        <ul className="space-y-2">
          <li className="flex items-center gap-2 text-sm text-amber-800 bg-amber-100/50 p-2 rounded">
             <span className="w-2 h-2 rounded-full bg-red-500"></span> Lead "Logística Global SA" está Quente (Score: 88) mas sem follow-up agendado.
          </li>
          <li className="flex items-center gap-2 text-sm text-amber-800 bg-amber-100/50 p-2 rounded">
             <span className="w-2 h-2 rounded-full bg-orange-500"></span> Deal "Expansão Frota Sul" inativo há mais de 15 dias. Retome o contato.
          </li>
        </ul>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-semibold text-slate-800 mb-6">Projeção de Receita (H1)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} tickFormatter={(value) => `R$${value/1000}k`} />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#3b82f6" fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-semibold text-slate-800 mb-6">Funil de Vendas Atual</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} layout="vertical" margin={{ top: 10, right: 30, left: 40, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis dataKey="stage" type="category" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <Tooltip />
                <Bar dataKey="count" fill="#10b981" radius={[0, 4, 4, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function KPICard({ title, value, icon, trend, trendUp }: any) {
  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <h4 className="text-2xl font-bold text-slate-900">{value}</h4>
        {trend && (
          <span className={`text-xs font-medium mt-2 inline-block ${trendUp ? 'text-green-600' : 'text-red-500'}`}>
            {trend} vs último mês
          </span>
        )}
      </div>
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${trendUp ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-600'}`}>
        {icon}
      </div>
    </div>
  );
}
