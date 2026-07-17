import React from 'react';
import { Layers, Plus, Mail, Phone, MessageCircle } from 'lucide-react';
import { Badge } from '../../ui/Badge';

export function CadenceBuilder() {
  const steps = [
    { day: 1, type: 'email', name: 'E-mail de Apresentação', status: 'active' },
    { day: 2, type: 'linkedin', name: 'Conexão + Mensagem Curta', status: 'active' },
    { day: 4, type: 'call', name: 'Cold Call de Acompanhamento', status: 'active' },
    { day: 7, type: 'email', name: 'E-mail Break-up', status: 'active' }
  ];

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Layers className="text-emerald-600" /> Construtor de Cadências
          </h1>
          <p className="text-slate-500 text-sm mt-1">Configure o ritmo de interações determinísticas para novas prospecções.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition font-medium text-sm">
          <Plus size={16} /> Nova Cadência
        </button>
      </header>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 max-w-3xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-slate-800">Cadência: Inbound - Enterprise (7 Dias)</h2>
          <Badge variant="success">Ativa</Badge>
        </div>

        <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-slate-200">
          {steps.map((step, index) => (
            <div key={index} className="relative flex items-center gap-4">
              <div className="w-10 h-10 rounded-full border-2 border-slate-200 bg-white flex items-center justify-center font-bold text-slate-600 text-xs shadow-sm z-10 shrink-0">
                D{step.day}
              </div>
              <div className="flex-1 bg-slate-50 border border-slate-200 p-4 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${getIconBg(step.type)}`}>
                    {getIcon(step.type)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 text-sm">{step.name}</h4>
                    <p className="text-xs text-slate-500 capitalize">{step.type}</p>
                  </div>
                </div>
                <button className="text-sm font-medium text-blue-600 hover:text-blue-800">Editar</button>
              </div>
            </div>
          ))}

          <div className="relative flex items-center gap-4 pt-2">
             <div className="w-10 h-10 rounded-full border-2 border-dashed border-slate-300 bg-slate-50 flex items-center justify-center text-slate-400 z-10 shrink-0 cursor-pointer hover:border-blue-400 hover:text-blue-500 transition">
               <Plus size={18} />
             </div>
             <div className="text-sm font-medium text-slate-500">Adicionar nova etapa</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getIcon(type: string) {
  switch (type) {
    case 'email': return <Mail size={16} />;
    case 'call': return <Phone size={16} />;
    case 'linkedin': return <MessageCircle size={16} />;
    default: return <Layers size={16} />;
  }
}

function getIconBg(type: string) {
  switch (type) {
    case 'email': return 'bg-blue-100 text-blue-600';
    case 'call': return 'bg-orange-100 text-orange-600';
    case 'linkedin': return 'bg-blue-100 text-blue-800';
    default: return 'bg-slate-100 text-slate-600';
  }
}
