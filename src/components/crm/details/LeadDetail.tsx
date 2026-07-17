import React from 'react';
import { Badge } from '../../ui/Badge';
import { Building2, Mail, Phone, MapPin, User, Calendar, Activity, Tag, Sparkles } from 'lucide-react';
import { Timeline } from './Timeline';

type LeadDetailProps = {
  lead: any;
};

export function LeadDetail({ lead }: LeadDetailProps) {
  if (!lead) return null;

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6 h-full bg-slate-50">
      {/* Sidebar - Profile & Info */}
      <div className="w-full md:w-1/3 flex flex-col gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-2xl">
              {lead.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">{lead.name}</h2>
              <p className="text-slate-500">{lead.segment || 'Sem segmento'}</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-6">
            <Badge variant="outline">{lead.status}</Badge>
            <Badge variant={lead.fitScore > 80 ? 'success' : 'warning'}>
               Score: {lead.fitScore || 0}
            </Badge>
          </div>

          <div className="space-y-4">
            <InfoRow icon={<Mail size={16}/>} label="E-mail" value={lead.email || 'Não informado'} />
            <InfoRow icon={<Phone size={16}/>} label="Telefone" value={lead.phone || 'Não informado'} />
            <InfoRow icon={<MapPin size={16}/>} label="Localização" value={lead.location || 'Não informado'} />
            <InfoRow icon={<Building2 size={16}/>} label="Tamanho" value={lead.size || 'Não informado'} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Sparkles size={18} className="text-indigo-500"/>
            Análise ICP & Personas
          </h3>
          <p className="text-sm text-slate-600 mb-4">
            Este lead tem alta afinidade com o Perfil de Cliente Ideal (ICP), principalmente devido ao tamanho da frota e segmento logístico.
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">Decisor</Badge>
            <Badge variant="outline">Logística</Badge>
            <Badge variant="outline">Enterprise</Badge>
          </div>
        </div>
      </div>

      {/* Main Content - Timeline & Notes */}
      <div className="w-full md:w-2/3 bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
        <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <Activity size={18} className="text-blue-500"/>
          Histórico e Atividades
        </h3>
        <div className="flex-1 overflow-y-auto">
          <Timeline entityId={lead.id} entityType="lead" />
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="text-slate-400 mt-0.5">{icon}</div>
      <div>
        <p className="text-xs font-medium text-slate-500">{label}</p>
        <p className="text-sm text-slate-800">{value}</p>
      </div>
    </div>
  );
}
