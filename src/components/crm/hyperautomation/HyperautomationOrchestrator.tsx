import React from 'react';
import { Cog, Bot, GitMerge, Activity } from 'lucide-react';

export function HyperautomationOrchestrator() {
  const bots = [
    { name: 'Invoice Data Entry', status: 'idle' },
    { name: 'CRM Field Cleanup', status: 'running' },
  ];

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
          <Cog className="text-cyan-600" size={28} /> Hyperautomation
        </h1>
        <p className="text-slate-500 text-sm mt-1">Process mining, RPA bots, decision rules and end-to-end orchestration</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 border-l-4 border-l-cyan-500">
          <div className="flex justify-between items-start mb-2">
            <span className="text-slate-500 font-medium">Success Rate</span>
            <Activity className="text-cyan-500" size={20} />
          </div>
          <div className="text-3xl font-bold text-slate-800">96%</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 border-l-4 border-l-indigo-500">
          <div className="flex justify-between items-start mb-2">
            <span className="text-slate-500 font-medium">Discovered Paths</span>
            <GitMerge className="text-indigo-500" size={20} />
          </div>
          <div className="text-3xl font-bold text-slate-800">7</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 border-l-4 border-l-emerald-500">
          <div className="flex justify-between items-start mb-2">
            <span className="text-slate-500 font-medium">Active Bots</span>
            <Bot className="text-emerald-500" size={20} />
          </div>
          <div className="text-3xl font-bold text-slate-800">{bots.filter((b) => b.status === 'running').length}</div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 divide-y divide-slate-100">
        {bots.map((b) => (
          <div key={b.name} className="p-4 flex items-center justify-between">
            <span className="font-medium text-slate-800">{b.name}</span>
            <span className={`text-xs px-2 py-1 rounded-full ${b.status === 'running' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
              {b.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
