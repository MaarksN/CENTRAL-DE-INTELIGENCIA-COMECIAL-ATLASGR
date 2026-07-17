import React from 'react';
import { MessagesSquare, Mail, Smartphone, Linkedin } from 'lucide-react';

export function CommunicationHubPanel() {
  const threads = [
    { id: 'thr-1', channel: 'Email', contact: 'Ana Souza', icon: Mail, unread: true },
    { id: 'thr-2', channel: 'WhatsApp', contact: 'Bruno Lima', icon: Smartphone, unread: false },
    { id: 'thr-3', channel: 'LinkedIn', contact: 'Carla Reis', icon: Linkedin, unread: true },
  ];

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
          <MessagesSquare className="text-teal-600" size={28} /> Communication Hub
        </h1>
        <p className="text-slate-500 text-sm mt-1">Unified inbox across email, SMS, WhatsApp, LinkedIn and voice</p>
      </header>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 divide-y divide-slate-100">
        {threads.map((t) => {
          const Icon = t.icon;
          return (
            <div key={t.id} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Icon className="text-slate-400" size={18} />
                <div>
                  <div className="font-medium text-slate-800">{t.contact}</div>
                  <div className="text-xs text-slate-500">{t.channel}</div>
                </div>
              </div>
              {t.unread && <span className="w-2 h-2 rounded-full bg-teal-500" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
