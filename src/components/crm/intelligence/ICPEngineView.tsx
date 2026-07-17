import React, { useState } from 'react';
import { Target, Plus, Save } from 'lucide-react';
import { Badge } from '../../ui/Badge';

export function ICPEngineView() {
  const [profiles] = useState([
    { id: 1, name: 'Enterprise Logística', baseScore: 40, active: true },
    { id: 2, name: 'Mid-Market SaaS', baseScore: 20, active: false }
  ]);

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Target className="text-blue-600" /> Motor de ICP
          </h1>
          <p className="text-slate-500 text-sm mt-1">Configure os perfis de cliente ideal (ICP) para scoring automático.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition font-medium text-sm">
          <Plus size={16} /> Novo Perfil ICP
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <h3 className="font-semibold text-slate-700">Perfis Cadastrados</h3>
          {profiles.map(profile => (
            <div key={profile.id} className={`p-4 rounded-lg border cursor-pointer transition ${profile.active ? 'bg-white border-blue-500 shadow-sm ring-1 ring-blue-500' : 'bg-white border-slate-200 hover:border-blue-300'}`}>
              <div className="flex justify-between items-start">
                <h4 className="font-medium text-slate-800">{profile.name}</h4>
                <Badge variant={profile.active ? 'success' : 'outline'}>{profile.active ? 'Ativo' : 'Inativo'}</Badge>
              </div>
              <p className="text-xs text-slate-500 mt-2">Score Base: {profile.baseScore} pts</p>
            </div>
          ))}
        </div>

        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Editar Perfil: Enterprise Logística</h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nome do Perfil</label>
                <input type="text" defaultValue="Enterprise Logística" className="w-full rounded-md border border-slate-300 p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Score Base</label>
                <input type="number" defaultValue={40} className="w-full rounded-md border border-slate-300 p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Segmentos Alvo (Enter separados por vírgula)</label>
              <textarea defaultValue="Logística, Transportes, Supply Chain" className="w-full rounded-md border border-slate-300 p-2 text-sm h-20 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Faturamento Mínimo (R$)</label>
                <input type="number" defaultValue={10000000} className="w-full rounded-md border border-slate-300 p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tecnologias Utilizadas</label>
                <input type="text" defaultValue="SAP, TOTVS" className="w-full rounded-md border border-slate-300 p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
              <button className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-md transition text-sm font-medium">Cancelar</button>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-sm font-medium">
                <Save size={16} /> Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
