import React, { useState } from 'react';
import { LineChart, BarChart2, AlertTriangle, TrendingUp, DollarSign } from 'lucide-react';

export function ExecutiveCockpit() {
  const [timeframe, setTimeframe] = useState('YTD');

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
            <LineChart className="text-indigo-600" size={28} /> Executive Cockpit
          </h1>
          <p className="text-slate-500 text-sm mt-1">Enterprise Analytics & Predictive Intelligence</p>
        </div>
        <select 
          className="border border-slate-200 rounded-lg p-2 text-sm text-slate-700 bg-white"
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
        >
          <option value="QTD">Quarter to Date</option>
          <option value="YTD">Year to Date</option>
          <option value="ALL">All Time</option>
        </select>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 border-l-4 border-l-indigo-500">
          <div className="flex justify-between items-start mb-2">
            <span className="text-slate-500 font-medium">ARR Forecast</span>
            <DollarSign className="text-indigo-500" size={20} />
          </div>
          <div className="text-3xl font-bold text-slate-800">$1.2M</div>
          <div className="text-emerald-500 text-sm mt-2 flex items-center gap-1">
            <TrendingUp size={14} /> +12% vs last {timeframe}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 border-l-4 border-l-blue-500">
          <div className="flex justify-between items-start mb-2">
            <span className="text-slate-500 font-medium">Pipeline Velocity</span>
            <BarChart2 className="text-blue-500" size={20} />
          </div>
          <div className="text-3xl font-bold text-slate-800">24 Days</div>
          <div className="text-emerald-500 text-sm mt-2 flex items-center gap-1">
            <TrendingUp size={14} /> 15% faster
          </div>
        </div>

        <div className="bg-rose-50 p-6 rounded-xl shadow-sm border border-rose-200 border-l-4 border-l-rose-500">
          <div className="flex justify-between items-start mb-2">
            <span className="text-rose-700 font-medium">Anomaly Detected</span>
            <AlertTriangle className="text-rose-600" size={20} />
          </div>
          <div className="text-lg font-semibold text-rose-800">Win Rate Drop</div>
          <div className="text-rose-600 text-sm mt-2">
            CRITICAL: Win Rate dropped below 50% of historical average in Outbound segment.
          </div>
        </div>
      </div>

      {/* Main Charts Area */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8 min-h-[300px] flex items-center justify-center">
        <div className="text-center text-slate-400">
          <BarChart2 size={48} className="mx-auto mb-3 opacity-50" />
          <p>Dashboard Builder Visualization Area</p>
          <p className="text-xs mt-1">Data Warehouse Sync Active</p>
        </div>
      </div>
    </div>
  );
}
