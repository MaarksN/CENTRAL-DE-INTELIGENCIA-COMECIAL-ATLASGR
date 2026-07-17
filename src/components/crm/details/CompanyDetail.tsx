import React from 'react';
import { Building2, Globe, FileText } from 'lucide-react';
import { Badge } from '../../ui/Badge';
import { Timeline } from './Timeline';

export function CompanyDetail({ company }: { company: unknown }) {
  if (!company) return null;

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6 h-full bg-slate-50">
      <div className="w-full md:w-1/3 flex flex-col gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
              <Building2 size={32} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">{company.name}</h2>
              <Badge variant="outline">Ativa</Badge>
            </div>
          </div>
          
          <div className="space-y-4">
            <InfoRow icon={<FileText size={16}/>} label="Documento (CNPJ)" value={company.document || 'Não informado'} />
            <InfoRow icon={<Globe size={16}/>} label="Website" value={company.website || 'Não informado'} />
          </div>
        </div>
      </div>

      <div className="w-full md:w-2/3 bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
        <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
          Histórico de Atividades
        </h3>
        <div className="flex-1 overflow-y-auto">
          <Timeline entityId={company.id} entityType="company" />
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
