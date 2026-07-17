import React, { useState } from 'react';
import { Sparkles, FlaskConical, GitBranch, Bot } from 'lucide-react';

export function AIStudioWorkbench() {
  const [tab, setTab] = useState<'prompts' | 'evals' | 'agents'>('prompts');

  const tabs: { id: 'prompts' | 'evals' | 'agents'; label: string; icon: React.ReactNode }[] = [
    { id: 'prompts', label: 'Prompt Registry', icon: <Sparkles size={16} /> },
    { id: 'evals', label: 'Evaluations', icon: <FlaskConical size={16} /> },
    { id: 'agents', label: 'Agent Blueprints', icon: <Bot size={16} /> },
  ];

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
          <GitBranch className="text-violet-600" size={28} /> AI Studio
        </h1>
        <p className="text-slate-500 text-sm mt-1">Prompt engineering, evaluation and agent blueprint workbench</p>
      </header>

      <div className="flex gap-2 mb-6 border-b border-slate-200">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 text-sm font-medium flex items-center gap-2 border-b-2 -mb-px ${
              tab === t.id ? 'border-violet-600 text-violet-700' : 'border-transparent text-slate-500'
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 min-h-[300px]">
        {tab === 'prompts' && <p className="text-slate-500 text-sm">2 templates registered — sdr-outreach, deal-summary.</p>}
        {tab === 'evals' && <p className="text-slate-500 text-sm">Latest eval run: 9/10 cases passed.</p>}
        {tab === 'agents' && <p className="text-slate-500 text-sm">3 agent blueprints published to the Agent Runtime registry.</p>}
      </div>
    </div>
  );
}
