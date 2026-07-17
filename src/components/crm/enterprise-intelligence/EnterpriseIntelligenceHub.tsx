import React, { useState } from 'react';
import { BrainCircuit, Network, BarChart3, Search } from 'lucide-react';

export function EnterpriseIntelligenceHub() {
  const [query, setQuery] = useState('');

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
          <BrainCircuit className="text-purple-600" size={28} /> Enterprise Intelligence
        </h1>
        <p className="text-slate-500 text-sm mt-1">Entity graph, peer benchmarking, risk scoring and natural language queries</p>
      </header>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6 flex items-center gap-2">
        <Search className="text-slate-400" size={18} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask a question about your revenue data..."
          className="flex-1 outline-none text-sm text-slate-700"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 mb-2 text-slate-700 font-medium">
            <Network size={16} className="text-purple-500" /> Entity Graph
          </div>
          <p className="text-slate-500 text-sm">Accounts, contacts and deals mapped as a relationship graph.</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 mb-2 text-slate-700 font-medium">
            <BarChart3 size={16} className="text-indigo-500" /> Peer Benchmarking
          </div>
          <p className="text-slate-500 text-sm">Your win rate sits in the 68th percentile among similar accounts.</p>
        </div>
      </div>
    </div>
  );
}
