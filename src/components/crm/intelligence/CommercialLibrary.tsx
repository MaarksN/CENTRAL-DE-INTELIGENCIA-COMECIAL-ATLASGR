import React, { useState } from 'react';
import { BookOpen, Search, Copy, ShieldAlert, Mail } from 'lucide-react';
import { Badge } from '../../ui/Badge';

export function CommercialLibrary() {
  const [activeTab, setActiveTab] = useState('objections');

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <BookOpen className="text-amber-600" /> Biblioteca Comercial
        </h1>
        <p className="text-slate-500 text-sm mt-1">Central de conhecimento pesquisável: Objeções, Scripts, E-mails e Frameworks.</p>
      </header>

      <div className="flex gap-4 border-b border-slate-200 mb-6">
        <TabButton active={activeTab === 'objections'} onClick={() => setActiveTab('objections')} icon={<ShieldAlert size={16}/>}>Matriz de Objeções</TabButton>
        <TabButton active={activeTab === 'templates'} onClick={() => setActiveTab('templates')} icon={<Mail size={16}/>}>Templates & Scripts</TabButton>
        <TabButton active={activeTab === 'frameworks'} onClick={() => setActiveTab('frameworks')} icon={<BookOpen size={16}/>}>Frameworks (SPIN/BANT)</TabButton>
      </div>

      <div className="mb-6 flex gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input type="text" placeholder="Buscar na biblioteca..." className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500 outline-none text-sm" />
        </div>
      </div>

      {activeTab === 'objections' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ObjectionCard 
            category="Preço"
            objection="Achamos a solução muito cara em relação ao concorrente X."
            answer="Compreendo a preocupação. O preço inicial do X é menor, mas nossa solução inclui Y e Z nativamente, o que elimina custos extras com integrações e reduz o tempo de setup em 40%."
            socialProof="A Empresa XYZ teve a mesma dúvida e hoje economiza R$ 50k anuais em licenças extras."
          />
          <ObjectionCard 
            category="Timing"
            objection="Agora não é o melhor momento, me ligue no próximo trimestre."
            answer="Entendo perfeitamente. Apenas para entender: o problema X que discutimos deixou de ser prioridade no board, ou é apenas uma questão de fluxo de caixa?"
          />
        </div>
      )}
      
      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <Badge variant="outline">E-mail</Badge>
                <h3 className="font-semibold text-slate-800 mt-2">Follow-up após Demonstração</h3>
              </div>
              <button className="text-slate-400 hover:text-slate-600 transition" title="Copiar"><Copy size={18} /></button>
            </div>
            <pre className="bg-slate-50 p-4 rounded-md text-sm text-slate-700 font-sans whitespace-pre-wrap">
              Olá [Nome],{'\n\n'}
              Agradeço muito pelo tempo hoje na nossa demonstração. Conforme conversamos, o principal gargalo atual é [Dor Principal].
              {'\n\n'}
              Envio em anexo o material sobre como resolvemos isso na prática.
              Qualquer dúvida, estou à disposição.
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

function TabButton({ active, onClick, icon, children }: unknown) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2 pb-3 px-2 border-b-2 font-medium text-sm transition ${active ? 'border-amber-600 text-amber-700' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}
    >
      {icon} {children}
    </button>
  );
}

function ObjectionCard({ category, objection, answer, socialProof }: unknown) {
  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
      <Badge variant="warning">{category}</Badge>
      <p className="mt-3 font-semibold text-slate-800 text-sm italic">"{objection}"</p>
      <div className="mt-4 bg-slate-50 p-4 rounded-lg border border-slate-100">
        <p className="text-sm text-slate-700 font-medium">Recomendação de Resposta:</p>
        <p className="text-sm text-slate-600 mt-1">{answer}</p>
        {socialProof && (
          <div className="mt-3 pt-3 border-t border-slate-200">
            <p className="text-xs font-semibold text-slate-500">Prova Social Sugerida:</p>
            <p className="text-xs text-slate-600 mt-1">{socialProof}</p>
          </div>
        )}
      </div>
    </div>
  );
}
