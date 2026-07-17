import React, { useState } from 'react';
import { Zap, TrendingUp, RefreshCw, DollarSign } from 'lucide-react';

export function AutonomousRevenueConsole() {
  const [running, setRunning] = useState(false);

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
            <Zap className="text-amber-500" size={28} /> Autonomous Revenue System
          </h1>
          <p className="text-slate-500 text-sm mt-1">Self-running playbooks, pricing and renewal orchestration</p>
        </div>
        <button
          onClick={() => setRunning(!running)}
          className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${
            running ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-800 text-white'
          }`}
        >
          <RefreshCw size={16} className={running ? 'animate-spin' : ''} />
          {running ? 'Orchestrator Running' : 'Start Orchestrator'}
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 border-l-4 border-l-amber-500">
          <div className="flex justify-between items-start mb-2">
            <span className="text-slate-500 font-medium">Playbooks Active</span>
            <TrendingUp className="text-amber-500" size={20} />
          </div>
          <div className="text-3xl font-bold text-slate-800">6</div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 border-l-4 border-l-emerald-500">
          <div className="flex justify-between items-start mb-2">
            <span className="text-slate-500 font-medium">Renewals Automated</span>
            <RefreshCw className="text-emerald-500" size={20} />
          </div>
          <div className="text-3xl font-bold text-slate-800">18</div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 border-l-4 border-l-indigo-500">
          <div className="flex justify-between items-start mb-2">
            <span className="text-slate-500 font-medium">Dynamic Pricing Delta</span>
            <DollarSign className="text-indigo-500" size={20} />
          </div>
          <div className="text-3xl font-bold text-slate-800">+4.2%</div>
        </div>
      </div>
    </div>
  );
}
