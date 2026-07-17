import React from 'react';
import { Bot, Activity, CheckCircle, Clock, ShieldAlert } from 'lucide-react';
import { Badge } from '../../ui/Badge';

export function AgentMonitor() {
  const agentExecutions = [
    { id: 'ag_exec_1', agent: 'SDR Agent', status: 'running', task: 'Qualificação via LeadCreated', time: '12s' },
    { id: 'ag_exec_2', agent: 'BDR Agent', status: 'completed', task: 'Prospecção (Aprovado HIL)', time: '4s' },
    { id: 'ag_exec_3', agent: 'Research Agent', status: 'completed', task: 'Análise de Sinais', time: '1s' },
    { id: 'ag_exec_4', agent: 'ICP Agent', status: 'running', task: 'Re-calculo de score', time: '3s' },
    { id: 'ag_exec_5', agent: 'Cadence Agent', status: 'failed', task: 'Seleção de Fluxo', time: '2s' },
    { id: 'ag_exec_6', agent: 'CRM Assistant Agent', status: 'running', task: 'Deduplicação', time: '8s' },
    { id: 'ag_exec_7', agent: 'Analytics Agent', status: 'completed', task: 'Geração de Report', time: '5s' },
    { id: 'ag_exec_8', agent: 'Sales Manager Agent', status: 'completed', task: 'SLA check', time: '1s' },
    { id: 'ag_exec_9', agent: 'Revenue Director Agent', status: 'completed', task: 'Estratégia Diária', time: '10s' }
  ];

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Bot className="text-purple-600" /> Revenue AI Operating System
          </h1>
          <p className="text-slate-500 text-sm mt-1">Multi-Agent Ecosystem Monitor (9 Agentes Operando via EventBus).</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <TelemetryCard title="Agentes Ativos" value="1" icon={<Activity size={20}/>} color="emerald" />
        <TelemetryCard title="Ferramentas Usadas" value="45" icon={<Bot size={20}/>} color="indigo" />
        <TelemetryCard title="Tokens Gastos" value="~0" icon={<Clock size={20}/>} color="blue" />
        <TelemetryCard title="Bloqueios (Safety)" value="1" icon={<ShieldAlert size={20}/>} color="red" />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 bg-slate-50 uppercase border-b border-slate-100">
            <tr>
              <th className="px-4 py-3">Exec ID</th>
              <th className="px-4 py-3">Agente</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Tarefa Atual</th>
              <th className="px-4 py-3 text-right">Duração</th>
            </tr>
          </thead>
          <tbody>
            {agentExecutions.map(ex => (
              <tr key={ex.id} className="border-b border-slate-50 hover:bg-slate-50 transition cursor-pointer">
                <td className="px-4 py-3 font-mono text-xs text-slate-500">{ex.id}</td>
                <td className="px-4 py-3 font-medium text-slate-800">{ex.agent}</td>
                <td className="px-4 py-3">
                  <Badge variant={ex.status === 'completed' ? 'success' : ex.status === 'failed' ? 'error' : 'warning'}>
                    {ex.status}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-slate-600">{ex.task}</td>
                <td className="px-4 py-3 text-right text-slate-500">{ex.time}</td>
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
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-200',
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    red: 'bg-red-50 text-red-600 border-red-200',
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
