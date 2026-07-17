import React from 'react';
import { LayoutGrid, Server, Radio, ShieldCheck } from 'lucide-react';

export function AtlasOSShell() {
  const services = [
    { name: 'CRM Core', domain: 'crm' },
    { name: 'Workflow Engine', domain: 'workflow' },
    { name: 'Agent Runtime', domain: 'agent-runtime' },
    { name: 'Revenue AI OS', domain: 'revenue-ai-os' },
    { name: 'Knowledge Platform', domain: 'knowledge' },
  ];

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
          <LayoutGrid className="text-slate-800" size={28} /> Atlas OS
        </h1>
        <p className="text-slate-500 text-sm mt-1">Unified module kernel, service registry, platform event bus and identity</p>
      </header>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
        <div className="flex items-center gap-2 mb-4 text-slate-700 font-medium">
          <Server size={16} className="text-slate-500" /> Registered Services
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {services.map((s) => (
            <div key={s.domain} className="flex items-center justify-between border border-slate-100 rounded-lg p-3">
              <span className="text-sm font-medium text-slate-700">{s.name}</span>
              <span className="flex items-center gap-1 text-xs text-emerald-600">
                <ShieldCheck size={14} /> healthy
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center gap-3">
        <Radio className="text-indigo-500" size={20} />
        <p className="text-slate-500 text-sm">Platform event bus is broadcasting cross-module events in real time.</p>
      </div>
    </div>
  );
}
