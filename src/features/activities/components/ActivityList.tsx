import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle2, Clock, Phone, Mail, MessageCircle, Users, Activity as ActivityIcon } from 'lucide-react';
import { Activity } from '../../../types';

export function ActivityList() {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchActivities = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/activities');
            if (res.ok) {
                const data = await res.json();
                setActivities(data);
            }
        } catch (error) {
            console.error('Error fetching activities:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchActivities();
    }, []);

    const handleStatusToggle = async (activity: Activity) => {
        const newStatus = activity.status === 'Pendente' ? 'Concluída' : 'Pendente';
        try {
            const res = await fetch(`/api/activities/${activity.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            if (res.ok) {
                setActivities(prev => prev.map(a => a.id === activity.id ? { ...a, status: newStatus } : a));
            }
        } catch (error) {
            console.error('Error updating activity status:', error);
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type.toLowerCase()) {
            case 'ligação': return <Phone className="w-4 h-4" />;
            case 'e-mail': return <Mail className="w-4 h-4" />;
            case 'whatsapp': return <MessageCircle className="w-4 h-4" />;
            case 'reunião': return <Users className="w-4 h-4" />;
            default: return <ActivityIcon className="w-4 h-4" />;
        }
    };

    const getTypeEmoji = (type: string) => {
        switch (type.toLowerCase()) {
            case 'ligação': return '📞';
            case 'e-mail': return '📧';
            case 'whatsapp': return '💬';
            case 'reunião': return '🤝';
            case 'visita': return '🚗';
            case 'follow-up': return '🔁';
            case 'tarefa': return '✅';
            default: return '📌';
        }
    };

    return (
        <div className="flex-1 overflow-y-auto bg-gray-50/50 p-8">
            <div className="max-w-5xl mx-auto space-y-6">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">📅 Atividades</h1>
                    <p className="text-gray-500 mt-1">Gerencie suas tarefas e compromissos</p>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center text-gray-500 flex items-center justify-center gap-2">
                            <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                            ⏳ Carregando atividades...
                        </div>
                    ) : activities.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">📭 Nenhuma atividade agendada.</div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {activities.map(activity => (
                                <div key={activity.id} className="p-4 hover:bg-gray-50/50 transition-colors flex items-center gap-4 group">
                                    <button
                                        onClick={() => handleStatusToggle(activity)}
                                        className={`shrink-0 transition-colors ${activity.status === 'Concluída' ? 'text-green-500' : 'text-gray-300 hover:text-green-500'}`}
                                    >
                                        <CheckCircle2 className="w-6 h-6" />
                                    </button>

                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-medium">
                                                {getTypeIcon(activity.type)}
                                                {getTypeEmoji(activity.type)} {activity.type}
                                            </span>
                                            {activity.lead?.company && (
                                                <span className="text-sm font-medium text-gray-900">
                                                    {activity.lead.company.tradeName || activity.lead.company.legalName}
                                                </span>
                                            )}
                                        </div>
                                        {activity.observations && (
                                            <p className="text-sm text-gray-600 line-clamp-1">{activity.observations}</p>
                                        )}
                                    </div>

                                    <div className="flex flex-col items-end gap-1 text-sm text-gray-500 shrink-0">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {new Date(activity.date).toLocaleDateString('pt-BR')}
                                        </div>
                                        {activity.time && (
                                            <div className="flex items-center gap-1.5">
                                                <Clock className="w-3.5 h-3.5" />
                                                {activity.time}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
