import { useState, useEffect } from 'react';
import { TimelineEvent } from '../../../types';
import { History, Activity, MessageCircle, ArrowRight, User } from 'lucide-react';

interface TimelineProps {
    leadId: string;
}

export function Timeline({ leadId }: TimelineProps) {
    const [events, setEvents] = useState<TimelineEvent[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTimeline = async () => {
            try {
                // In a real app, this would be a dedicated endpoint or included in the lead details
                const res = await fetch(`/api/leads/${leadId}`);
                if (res.ok) {
                    const data = await res.json();
                    setEvents(data.timeline || []);
                }
            } catch (error) {
                console.error('Error fetching timeline:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchTimeline();
    }, [leadId]);

    const getEventIcon = (type: string, className = 'w-4 h-4') => {
        switch (type) {
            case 'creation': return <User className={className} />;
            case 'movement': return <ArrowRight className={className} />;
            case 'activity': return <Activity className={className} />;
            case 'comment': return <MessageCircle className={className} />;
            default: return <History className={className} />;
        }
    };

    const getEventColor = (type: string) => {
        switch (type) {
            case 'creation': return 'bg-blue-100 text-blue-600 border-blue-200';
            case 'movement': return 'bg-orange-100 text-orange-600 border-orange-200';
            case 'activity': return 'bg-green-100 text-green-600 border-green-200';
            case 'comment': return 'bg-purple-100 text-purple-600 border-purple-200';
            default: return 'bg-gray-100 text-gray-600 border-gray-200';
        }
    };

    if (loading) {
        return <div className="p-4 text-center text-sm text-gray-500">Carregando timeline...</div>;
    }

    if (events.length === 0) {
        return <div className="p-4 text-center text-sm text-gray-500">Nenhum evento registrado.</div>;
    }

    return (
        <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
                <History className="w-4 h-4" /> Histórico
            </h3>
            <div className="relative border-l-2 border-gray-100 ml-3 space-y-6">
                {events.map((event) => (
                    <div key={event.id} className="relative pl-6">
                        <div className={`absolute -left-[11px] top-1 w-5 h-5 rounded-full border flex items-center justify-center ${getEventColor(event.type)}`}>
                        {getEventIcon(event.type, 'w-2.5 h-2.5')}
                        </div>
                        <div>
                            <p className="text-sm text-gray-900">{event.description}</p>
                            <span className="text-xs text-gray-500 mt-1 block">
                                {new Date(event.createdAt).toLocaleString('pt-BR')}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
