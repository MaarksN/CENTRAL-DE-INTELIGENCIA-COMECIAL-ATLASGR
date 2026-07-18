import { useState, useEffect, useCallback } from 'react';
import {
    X, Building2, MapPin, Phone, Mail, Linkedin, Globe, Star, Sparkles, Loader2,
    Trash, Send, Clock, User, FileText,
} from 'lucide-react';
import { Lead, Note, LeadStatus, LEAD_STATUS } from '../../../types';
import { api } from '../../../lib/api';
import { toast } from '../../../lib/toast';

const STATUS_EMOJI: Record<string, string> = {
    'Novo Lead': '🆕', 'Qualificação': '🔎', 'Primeiro Contato': '☎️', 'Diagnóstico': '🩺',
    'Proposta': '📄', 'Negociação': '🤝', 'Fechado Ganho': '🏆', 'Fechado Perdido': '❌',
};

const TEMPERATURE_EMOJI: Record<string, string> = { Quente: '🔥', Morno: '🌤️', Frio: '❄️' };

const LEAD_STATUSES: LeadStatus[] = [
    'Novo Lead', 'Qualificação', 'Primeiro Contato', 'Diagnóstico',
    'Proposta', 'Negociação', 'Fechado Ganho', 'Fechado Perdido',
];
void ({} as typeof LEAD_STATUS); // mantém o import de tipo referenciado

interface LeadDetailDrawerProps {
    leadId: string;
    onClose: () => void;
    /** Chamado sempre que o lead muda (status, enriquecimento, exclusão) para o board recarregar. */
    onChanged: () => void;
}

export function LeadDetailDrawer({ leadId, onClose, onChanged }: LeadDetailDrawerProps) {
    const [lead, setLead] = useState<Lead | null>(null);
    const [loading, setLoading] = useState(true);
    const [enriching, setEnriching] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [noteText, setNoteText] = useState('');
    const [savingNote, setSavingNote] = useState(false);

    const fetchLead = useCallback(async () => {
        try {
            const data = await api.get<Lead>(`/api/leads/${leadId}`);
            setLead(data);
        } catch {
            toast.error('Não foi possível carregar o lead.');
            onClose();
        } finally {
            setLoading(false);
        }
    }, [leadId, onClose]);

    useEffect(() => {
        fetchLead();
    }, [fetchLead]);

    // Fecha com Esc
    useEffect(() => {
        const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [onClose]);

    const handleStatusChange = async (newStatus: string) => {
        try {
            await api.put(`/api/leads/${leadId}`, { status: newStatus });
            toast.success(`Lead movido para "${newStatus}"`);
            await fetchLead();
            onChanged();
        } catch {
            toast.error('Falha ao mudar o estágio do lead.');
        }
    };

    const handleEnrich = async () => {
        setEnriching(true);
        try {
            await api.post(`/api/leads/${leadId}/enrich`);
            toast.success('✨ Lead reenriquecido com sucesso!');
            await fetchLead();
            onChanged();
        } catch (e) {
            toast.error(e instanceof Error ? e.message : 'Falha ao enriquecer o lead.');
        } finally {
            setEnriching(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Tem certeza que deseja excluir este lead? Essa ação não pode ser desfeita.')) return;
        setDeleting(true);
        try {
            await api.delete(`/api/leads/${leadId}`);
            toast.success('Lead excluído.');
            onChanged();
            onClose();
        } catch {
            toast.error('Falha ao excluir o lead.');
            setDeleting(false);
        }
    };

    const handleAddNote = async () => {
        if (!noteText.trim()) return;
        setSavingNote(true);
        try {
            await api.post<Note>(`/api/leads/${leadId}/notes`, { content: noteText.trim(), author: 'Equipe Atlas' });
            setNoteText('');
            toast.success('Nota adicionada.');
            await fetchLead();
        } catch {
            toast.error('Falha ao salvar a nota.');
        } finally {
            setSavingNote(false);
        }
    };

    const company = lead?.company;

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" onClick={onClose} />

            {/* Drawer */}
            <div className="relative w-full max-w-xl h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
                <div className="p-5 border-b border-gray-100 flex items-start justify-between gap-4 shrink-0">
                    <div className="min-w-0">
                        <h2 className="font-black text-xl text-atlas-dark truncate">
                            🎯 {company?.tradeName || company?.legalName || 'Lead'}
                        </h2>
                        <p className="text-xs text-gray-500 mt-0.5 truncate">
                            {lead?.source || 'Origem desconhecida'}
                            {lead?.createdAt && ` · criado em ${new Date(lead.createdAt).toLocaleDateString('pt-BR')}`}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors shrink-0">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {loading || !lead ? (
                    <div className="flex-1 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 animate-spin text-atlas-orange" />
                    </div>
                ) : (
                    <div className="flex-1 overflow-y-auto p-5 space-y-6">
                        {/* Estágio + score */}
                        <div className="flex flex-wrap items-center gap-3">
                            <select
                                value={lead.status}
                                onChange={(e) => handleStatusChange(e.target.value)}
                                className="p-2.5 bg-gray-50 rounded-xl border border-gray-200 text-sm font-bold text-atlas-dark outline-none focus:border-atlas-orange"
                            >
                                {LEAD_STATUSES.map((s) => (
                                    <option key={s} value={s}>{STATUS_EMOJI[s]} {s}</option>
                                ))}
                            </select>
                            {lead.score != null && (
                                <span className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm font-bold">
                                    {lead.temperature ? `${TEMPERATURE_EMOJI[lead.temperature] || ''} ` : ''}Fit {lead.score}%
                                </span>
                            )}
                            <button
                                onClick={handleEnrich}
                                disabled={enriching || !lead.companyId}
                                className="flex items-center gap-1.5 bg-gradient-to-r from-atlas-orange to-amber-500 text-white px-4 py-2 rounded-xl font-bold text-xs hover:opacity-90 transition-all disabled:opacity-50"
                            >
                                {enriching ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                                {enriching ? 'Enriquecendo...' : '✨ Enriquecer'}
                            </button>
                        </div>

                        {/* Empresa */}
                        {company && (
                            <section>
                                <h3 className="text-[10px] tracking-wider font-bold uppercase text-gray-400 mb-2">🏢 Empresa</h3>
                                <div className="bg-gray-50/70 rounded-xl p-4 space-y-2 text-sm text-gray-700">
                                    <p className="font-bold text-atlas-dark">{company.legalName}</p>
                                    {company.cnpj && <p className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5 text-gray-400" /> {company.cnpj}</p>}
                                    {(company.city || company.state) && (
                                        <p className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-gray-400" /> {[company.city, company.state].filter(Boolean).join(', ')}</p>
                                    )}
                                    {company.segment && <p className="flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5 text-gray-400" /> {company.segment}</p>}
                                    {company.phones?.[0] && <p className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-gray-400" /> {company.phones.join(' · ')}</p>}
                                    {company.emails?.[0] && <p className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-gray-400" /> {company.emails[0]}</p>}
                                    {company.website && (
                                        <p className="flex items-center gap-1.5">
                                            <Globe className="w-3.5 h-3.5 text-gray-400" />
                                            <a href={company.website.split(' ')[0]} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline truncate">{company.website}</a>
                                        </p>
                                    )}
                                    {company.linkedin && (
                                        <p className="flex items-center gap-1.5">
                                            <Linkedin className="w-3.5 h-3.5 text-gray-400" />
                                            <a href={company.linkedin} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">LinkedIn</a>
                                        </p>
                                    )}
                                    {company.googleRating != null && (
                                        <p className="flex items-center gap-1.5">
                                            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                                            {company.googleRating.toFixed(1)} no Google ({company.googleReviewsCount ?? 0} avaliações)
                                        </p>
                                    )}
                                </div>
                            </section>
                        )}

                        {/* Contato */}
                        {lead.contact && (
                            <section>
                                <h3 className="text-[10px] tracking-wider font-bold uppercase text-gray-400 mb-2">👤 Contato</h3>
                                <div className="bg-gray-50/70 rounded-xl p-4 space-y-1.5 text-sm text-gray-700">
                                    <p className="font-bold text-atlas-dark flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-gray-400" /> {lead.contact.name}</p>
                                    {lead.contact.role && <p className="text-gray-500 pl-5">{lead.contact.role}</p>}
                                    {lead.contact.email && <p className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-gray-400" /> {lead.contact.email}</p>}
                                    {lead.contact.phone && <p className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-gray-400" /> {lead.contact.phone}</p>}
                                </div>
                            </section>
                        )}

                        {/* Observações do enriquecimento */}
                        {company?.observations && (
                            <section>
                                <h3 className="text-[10px] tracking-wider font-bold uppercase text-gray-400 mb-2">📝 Resumo do Enriquecimento</h3>
                                <p className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-4 text-xs text-gray-600 leading-relaxed">{company.observations}</p>
                            </section>
                        )}

                        {/* Notas */}
                        <section>
                            <h3 className="text-[10px] tracking-wider font-bold uppercase text-gray-400 mb-2">💬 Notas ({lead.internalNotes?.length || 0})</h3>
                            <div className="flex gap-2 mb-3">
                                <input
                                    value={noteText}
                                    onChange={(e) => setNoteText(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
                                    placeholder="Escreva uma nota e pressione Enter..."
                                    className="flex-1 p-2.5 bg-gray-50 rounded-xl border border-gray-200 text-sm outline-none focus:border-atlas-orange"
                                />
                                <button
                                    onClick={handleAddNote}
                                    disabled={savingNote || !noteText.trim()}
                                    className="p-2.5 bg-atlas-dark text-white rounded-xl hover:bg-black transition-colors disabled:opacity-50"
                                >
                                    {savingNote ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                </button>
                            </div>
                            <div className="space-y-2">
                                {(lead.internalNotes || []).map((note) => (
                                    <div key={note.id} className="bg-yellow-50/70 border border-yellow-100 rounded-xl p-3 text-sm text-gray-700">
                                        <p className="whitespace-pre-wrap">{note.content}</p>
                                        <p className="text-[10px] text-gray-400 mt-1.5">
                                            {note.author} · {new Date(note.createdAt).toLocaleString('pt-BR')}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Timeline */}
                        <section>
                            <h3 className="text-[10px] tracking-wider font-bold uppercase text-gray-400 mb-2">🕐 Histórico ({lead.timeline?.length || 0})</h3>
                            <div className="space-y-0 relative before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-px before:bg-gray-200">
                                {(lead.timeline || []).map((event) => (
                                    <div key={event.id} className="relative pl-6 pb-4">
                                        <div className="absolute left-0 top-1 w-[15px] h-[15px] rounded-full bg-white border-2 border-atlas-orange" />
                                        <p className="text-sm text-gray-700">{event.description}</p>
                                        <p className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
                                            <Clock className="w-3 h-3" /> {new Date(event.createdAt).toLocaleString('pt-BR')}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                )}

                {/* Rodapé */}
                <div className="p-4 border-t border-gray-100 flex justify-between items-center shrink-0">
                    <button
                        onClick={handleDelete}
                        disabled={deleting}
                        className="flex items-center gap-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-xl text-sm font-bold transition-colors disabled:opacity-50"
                    >
                        {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash className="w-4 h-4" />}
                        Excluir lead
                    </button>
                    <button onClick={onClose} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-200 transition-colors">
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    );
}
