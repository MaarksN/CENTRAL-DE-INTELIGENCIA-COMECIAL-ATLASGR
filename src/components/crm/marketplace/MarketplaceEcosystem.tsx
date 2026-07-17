import React from 'react';
import { Store, Puzzle, Star, Handshake } from 'lucide-react';

export function MarketplaceEcosystem() {
  const apps = [
    { name: 'Slack Sync', publisher: 'Atlas Labs', installs: 412, category: 'Integration' },
    { name: 'Forecast+', publisher: 'Partner Co', installs: 187, category: 'Analytics' },
    { name: 'SDR Agent Pack', publisher: 'Atlas Labs', installs: 305, category: 'Agent' },
  ];

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
          <Store className="text-orange-600" size={28} /> Marketplace Ecosystem
        </h1>
        <p className="text-slate-500 text-sm mt-1">Partner apps, revenue share and sandboxed installs</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {apps.map((app) => (
          <div key={app.name} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-start mb-3">
              <Puzzle className="text-orange-500" size={22} />
              <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-600">{app.category}</span>
            </div>
            <div className="font-semibold text-slate-800">{app.name}</div>
            <div className="text-sm text-slate-500 flex items-center gap-1 mt-1">
              <Handshake size={14} /> {app.publisher}
            </div>
            <div className="text-sm text-amber-600 flex items-center gap-1 mt-3">
              <Star size={14} /> {app.installs} installs
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
