import React, { useState, useEffect } from 'react';
import { MessageSquare, PhoneCall, Mail, Calendar, CheckCircle } from 'lucide-react';

type TimelineProps = {
  entityId: string;
  entityType: 'lead' | 'company' | 'contact' | 'deal';
};

export function Timeline({ entityId, entityType }: TimelineProps) {
  // Demo data for layout purposes since backend connection might require context
  const [events, setEvents] = useState(() => [
    { id: '1', kind: 'activity', type: 'meeting', title: 'Reunião de Descoberta', date: new Date().toISOString(), status: 'completed' },
    { id: '2', kind: 'note', content: 'Lead comentou sobre problemas de sinistro atuais.', date: new Date(Date.now() - 86400000).toISOString() },
    { id: '3', kind: 'activity', type: 'email', title: 'Cold Email Enviado', date: new Date(Date.now() - 172800000).toISOString(), status: 'completed' },
  ]);

  return (
    <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
      {events.map(event => (
        <div key={event.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
          {/* Icon */}
          <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-100 group-[.is-active]:bg-blue-50 text-slate-500 group-[.is-active]:text-blue-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
            {getEventIcon(event)}
          </div>
          
          {/* Card */}
          <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-slate-800 text-sm">
                {event.kind === 'note' ? 'Nota Adicionada' : event.title}
              </span>
              <time className="text-xs text-slate-500">{new Date(event.date).toLocaleDateString()}</time>
            </div>
            <p className="text-sm text-slate-600">
              {event.kind === 'note' ? event.content : `Status: ${event.status}`}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function getEventIcon(event: any) {
  if (event.kind === 'note') return <MessageSquare size={18} />;
  switch (event.type) {
    case 'call': return <PhoneCall size={18} />;
    case 'email': return <Mail size={18} />;
    case 'meeting': return <Calendar size={18} />;
    default: return <CheckCircle size={18} />;
  }
}
