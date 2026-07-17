import React from 'react';
import { Users, Zap } from 'lucide-react';

export function PersonaManager() {
  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Users className="text-indigo-600" /> Gestão de Personas
        </h1>
        <p className="text-slate-500 text-sm mt-1">Mapeamento de dores, objetivos e gatilhos para personalização comercial.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <PersonaCard 
          role="Diretor de Logística"
          painPoints={["Custo de frete alto", "Falta de visibilidade na frota", "Sinistros"]}
          goals={["Reduzir 15% dos custos em 6 meses", "Automação de rastreamento"]}
          _triggers={["Nova contratação de frota", "Fim de quarter"]}
        />
        <PersonaCard 
          role="CFO"
          painPoints={["Orçamento estourado", "ROI não claro das ferramentas", "Desperdício"]}
          goals={["Eficiência operacional", "Previsibilidade financeira"]}
          _triggers={["Planejamento orçamentário anual", "Corte de custos"]}
        />
        <div className="border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center p-6 text-slate-500 hover:bg-slate-100 hover:border-slate-400 transition cursor-pointer min-h-[300px]">
          <Users size={32} className="mb-2" />
          <span className="font-medium">Mapear Nova Persona</span>
        </div>
      </div>
    </div>
  );
}

function PersonaCard({ role, painPoints, goals, _triggers }: unknown) {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
      <h3 className="text-lg font-bold text-slate-800 mb-4 pb-4 border-b border-slate-100">{role}</h3>
      
      <div className="space-y-4 flex-1">
        <div>
          <h4 className="text-xs font-semibold uppercase text-slate-500 flex items-center gap-1 mb-2">
            <Zap size={14} /> Dores Principais
          </h4>
          <ul className="space-y-1">
            {painPoints.map((p: string, i: number) => (
              <li key={i} className="text-sm text-slate-700 bg-red-50 px-2 py-1 rounded text-red-700">{p}</li>
            ))}
          </ul>
        </div>
        
        <div>
          <h4 className="text-xs font-semibold uppercase text-slate-500 flex items-center gap-1 mb-2">
            <TargetIcon /> Objetivos
          </h4>
          <ul className="space-y-1">
            {goals.map((g: string, i: number) => (
              <li key={i} className="text-sm text-slate-700 bg-green-50 px-2 py-1 rounded text-green-700">{g}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function TargetIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
  );
}
