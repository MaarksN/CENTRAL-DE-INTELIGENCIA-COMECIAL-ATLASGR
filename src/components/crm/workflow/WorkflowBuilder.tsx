import React, { useState } from 'react';
import { GitBranch, Plus, Zap, Save, CheckCircle } from 'lucide-react';
import { Badge } from '../../ui/Badge';

export function WorkflowBuilder() {
  const [nodes] = useState([
    { id: 1, type: 'trigger', label: 'Quando Lead for Criado', icon: <Zap size={16}/>, color: 'text-amber-500 bg-amber-50 border-amber-200' },
    { id: 2, type: 'condition', label: 'Se ICP Score > 80', icon: <GitBranch size={16}/>, color: 'text-indigo-500 bg-indigo-50 border-indigo-200' },
    { id: 3, type: 'action', label: 'Adicionar Tag "Estratégico"', icon: <CheckCircle size={16}/>, color: 'text-emerald-500 bg-emerald-50 border-emerald-200' },
    { id: 4, type: 'action', label: 'Criar Task p/ BDR', icon: <CheckCircle size={16}/>, color: 'text-emerald-500 bg-emerald-50 border-emerald-200' }
  ]);

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <GitBranch className="text-indigo-600" /> Construtor de Automação
          </h1>
          <p className="text-slate-500 text-sm mt-1">Crie e versione pipelines determinísticos usando o Workflow Engine.</p>
        </div>
        <div className="flex gap-2">
           <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 transition font-medium text-sm">
             Draft v2
           </button>
           <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition font-medium text-sm">
             <Save size={16} /> Publicar Workflow
           </button>
        </div>
      </header>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 min-h-[500px] flex flex-col items-center relative">
        {/* Simple visual representation for MVP */}
        <div className="w-full max-w-lg space-y-4">
          {nodes.map((node, i) => (
            <div key={node.id} className="relative">
              <div className={`p-4 rounded-lg border shadow-sm flex items-center justify-between ${node.color}`}>
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded bg-white shadow-sm">
                    {node.icon}
                  </div>
                  <span className="font-medium text-sm text-slate-800">{node.label}</span>
                </div>
                <Badge variant="outline">{node.type}</Badge>
              </div>
              
              {/* Connector line */}
              {i < nodes.length - 1 && (
                <div className="h-6 w-0.5 bg-slate-300 mx-auto"></div>
              )}
            </div>
          ))}

          <div className="h-6 w-0.5 bg-slate-300 mx-auto"></div>
          
          <button className="w-full border-2 border-dashed border-slate-300 rounded-lg p-4 flex items-center justify-center gap-2 text-slate-500 hover:text-indigo-600 hover:border-indigo-400 hover:bg-indigo-50 transition">
            <Plus size={18} /> <span className="font-medium text-sm">Adicionar Etapa</span>
          </button>
        </div>
      </div>
    </div>
  );
}
