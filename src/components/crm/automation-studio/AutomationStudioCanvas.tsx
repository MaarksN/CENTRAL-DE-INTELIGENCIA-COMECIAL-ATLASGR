import React from 'react';
import { Workflow, Zap, Boxes, History } from 'lucide-react';

export function AutomationStudioCanvas() {
  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
          <Workflow className="text-blue-600" size={28} /> Automation Studio
        </h1>
        <p className="text-slate-500 text-sm mt-1">Visual flow builder on top of the Workflow Engine</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 lg:col-span-2 min-h-[320px] flex items-center justify-center">
          <div className="text-center text-slate-400">
            <Boxes size={48} className="mx-auto mb-3 opacity-50" />
            <p>Flow Canvas</p>
            <p className="text-xs mt-1">Drag triggers, conditions and actions to compose a flow</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 mb-2 text-slate-700 font-medium">
              <Zap size={16} className="text-amber-500" /> Trigger Catalog
            </div>
            <p className="text-slate-500 text-sm">5 trigger types available across CRM, Communication, Schedule and Agent categories.</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 mb-2 text-slate-700 font-medium">
              <History size={16} className="text-indigo-500" /> Version History
            </div>
            <p className="text-slate-500 text-sm">Every publish is snapshotted for rollback.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
