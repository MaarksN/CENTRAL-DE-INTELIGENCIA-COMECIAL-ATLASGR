import React from 'react';
import { HeartPulse, ShieldAlert, Rocket, TrendingUp } from 'lucide-react';

export function CustomerSuccessCloud() {
  const accounts = [
    { name: 'Acme Corp', score: 82, band: 'healthy' as const },
    { name: 'Globex Ltda', score: 51, band: 'at_risk' as const },
    { name: 'Initech', score: 28, band: 'critical' as const },
  ];

  const bandStyles: Record<string, string> = {
    healthy: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    at_risk: 'bg-amber-50 text-amber-700 border-amber-200',
    critical: 'bg-rose-50 text-rose-700 border-rose-200',
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
          <HeartPulse className="text-rose-500" size={28} /> Customer Success Cloud
        </h1>
        <p className="text-slate-500 text-sm mt-1">Health scoring, churn prediction, onboarding and expansion signals</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 border-l-4 border-l-rose-500">
          <div className="flex justify-between items-start mb-2">
            <span className="text-slate-500 font-medium">Accounts At Risk</span>
            <ShieldAlert className="text-rose-500" size={20} />
          </div>
          <div className="text-3xl font-bold text-slate-800">2</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 border-l-4 border-l-indigo-500">
          <div className="flex justify-between items-start mb-2">
            <span className="text-slate-500 font-medium">Onboarding Completion</span>
            <Rocket className="text-indigo-500" size={20} />
          </div>
          <div className="text-3xl font-bold text-slate-800">50%</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 border-l-4 border-l-emerald-500">
          <div className="flex justify-between items-start mb-2">
            <span className="text-slate-500 font-medium">Expansion Signals</span>
            <TrendingUp className="text-emerald-500" size={20} />
          </div>
          <div className="text-3xl font-bold text-slate-800">3</div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 divide-y divide-slate-100">
        {accounts.map((a) => (
          <div key={a.name} className="p-4 flex items-center justify-between">
            <span className="font-medium text-slate-800">{a.name}</span>
            <span className={`text-xs px-2 py-1 rounded-full border ${bandStyles[a.band]}`}>
              {a.score} · {a.band.replace('_', ' ')}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
