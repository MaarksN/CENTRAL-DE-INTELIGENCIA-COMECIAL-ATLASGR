import React from 'react';
import { Activity, Clock, AlertTriangle, CheckCircle, Settings, Play } from 'lucide-react';
import { Badge } from '../../ui/Badge';

export function WorkflowMonitor() {
  const executions = [
    { id: 'ex_1', wf: 'Onboarding Lead', status: 'success', time: '1.2s', date: 'Há 5 min' },
    { id: 'ex_2', wf: 'Score Update', status: 'success', time: '0.8s', date: 'Há 12 min' },
    { id: 'ex_3', wf: 'Webhook ERP', status: 'error', time: '5.0s (timeout)', date: 'Há 45 min' },
    { id: 'ex_4', wf: 'Follow-up', status: 'pending', time: '-', date: 'Aguardando' }
  ];

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Activity className="text-purple-600" /> Monitoramento de Workflows
          </h1>
          <p className="text-slate-500 text-sm mt-1">Telemetria, performance e logs de execução do Workflow Engine.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 transition font-medium text-sm">
          <Settings size={16} /> Configurações Globais
        </button>
      </header>

      {/* Telemetry Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <TelemetryCard title="Execuções (Hoje)" value="1.240" icon={<Play size={20}/>} color="blue" />
        <TelemetryCard title="Throughput Médio" value="1.5s" icon={<Clock size={20}/>} color="indigo" />
        <TelemetryCard title="Falhas (Retries)" value="12" icon={<AlertTriangle size={20}/>} color="red" />
        <TelemetryCard title="Eventos na Fila" value="0" icon={<Activity size={20}/>} color="emerald" />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="font-semibold text-slate-800">Últimas Execuções</h3>
          <span className="text-xs font-medium text-slate-500">Auto-refresh em 5s</span>
        </div>
        
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 bg-slate-50 uppercase border-b border-slate-100">
            <tr>
              <th className="px-4 py-3">Execution ID</th>
              <th className="px-4 py-3">Workflow</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Duração</th>
              <th className="px-4 py-3 text-right">Acionado</th>
            </tr>
          </thead>
          <tbody>
            {executions.map(ex => (
              <tr key={ex.id} className="border-b border-slate-50 hover:bg-slate-50 transition cursor-pointer">
                <td className="px-4 py-3 font-mono text-xs text-slate-500">{ex.id}</td>
                <td className="px-4 py-3 font-medium text-slate-800">{ex.wf}</td>
                <td className="px-4 py-3">
                  <Badge variant={ex.status === 'success' ? 'success' : ex.status === 'error' ? 'error' : 'warning'}>
                    {ex.status}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-slate-600">{ex.time}</td>
                <td className="px-4 py-3 text-right text-slate-500">{ex.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TelemetryCard({ title, value, icon, color }: any) {
  const colorMap: any = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    red: 'bg-red-50 text-red-600 border-red-200',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-200',
  };

  return (
    <div className={`p-5 rounded-xl border ${colorMap[color]} shadow-sm flex flex-col`}>
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-sm font-medium text-slate-700">{title}</h4>
        {icon}
      </div>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}
