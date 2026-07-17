import { useCallback, useEffect, useState } from 'react';
import { Building, Edit, Mail, Phone, Plus, Search, Trash, User, Sparkles, Loader2 } from 'lucide-react';

import { Contact } from '../../../types';
import { ContactForm } from './ContactForm';
import { api } from '../../../lib/api';

export function ContactList() {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
    const [enrichingId, setEnrichingId] = useState<string | null>(null);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchContacts = useCallback(async () => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams({
                page: page.toString(),
                limit: '20'
            });
            if (searchTerm) {
                queryParams.append('q', searchTerm);
            }
            
            const url = `/api/contacts?${queryParams.toString()}`;
            // Because our api wrapper returns { data, meta } if meta exists
            const response = await api.get<{data: Contact[], meta: { totalPages: number }}>(url);
            
            if (Array.isArray(response)) {
                setContacts(response);
            } else if (response && response.data) {
                setContacts(response.data);
                if (response.meta) {
                    setTotalPages(response.meta.totalPages);
                }
            }
        } catch (error) {
            console.error('Error fetching contacts:', error);
        } finally {
            setLoading(false);
        }
    }, [searchTerm, page]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchContacts();
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [fetchContacts]);

    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir este contato?')) return;
        try {
            await api.delete(`/api/contacts/${id}`);
            setContacts(prev => prev.filter(c => c.id !== id));
        } catch (error) {
            console.error('Error deleting contact:', error);
        }
    };

    const handleSave = () => {
        setIsFormOpen(false);
        fetchContacts();
    };

    const handleEnrich = async (id: string) => {
        setEnrichingId(id);
        try {
            const result = await api.post<{ contact: Contact }>(`/api/contacts/${id}/enrich`);
            setContacts(prev => prev.map(c => c.id === id ? result.contact : c));
        } catch (error) {
            console.error('Error enriching contact:', error);
        } finally {
            setEnrichingId(null);
        }
    };

    return (
        <div className="flex-1 overflow-y-auto bg-gray-50/50 p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">👥 Contatos</h1>
                        <p className="text-gray-500 mt-1">Gerencie pessoas e pontos de contato</p>
                    </div>
                    <button
                        onClick={() => { setSelectedContact(null); setIsFormOpen(true); }}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
                    >
                        <Plus className="w-5 h-5" />
                        ➕ Novo Contato
                    </button>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="🔎 Buscar por nome, e-mail, telefone, cargo, empresa..."
                                    value={searchTerm}
                                    onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                                />
                            </div>
                        </div>
        
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-gray-200 bg-gray-50/50">
                                            <th className="p-4 text-sm font-medium text-gray-500">Contato</th>
                                            <th className="p-4 text-sm font-medium text-gray-500 hidden md:table-cell">Empresa</th>
                                            <th className="p-4 text-sm font-medium text-gray-500 hidden lg:table-cell">Canais</th>
                                            <th className="p-4 text-sm font-medium text-gray-500 text-right">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {loading ? (
                                            <tr>
                                                <td colSpan={4} className="p-8 text-center text-gray-500">
                                                    <div className="flex justify-center items-center gap-2">
                                                        <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                                                        ⏳ Carregando contatos...
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : contacts.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} className="p-8 text-center text-gray-500">
                                                    🔍 Nenhum contato encontrado.
                                                </td>
                                            </tr>
                                        ) : (
                                            contacts.map((contact) => (
                                                <tr key={contact.id} className="hover:bg-gray-50/50 transition-colors group">
                                                    <td className="p-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                                                                <User className="w-5 h-5" />
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-gray-900">{contact.name}</p>
                                                                <p className="text-sm text-gray-500">{contact.role || '-'}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-4 hidden md:table-cell">
                                                        <div className="flex items-center gap-2 text-gray-600">
                                                            <Building className="w-4 h-4 text-gray-400" />
                                                            {contact.company?.tradeName || contact.company?.legalName || '-'}
                                                        </div>
                                                    </td>
                                                    <td className="p-4 hidden lg:table-cell">
                                                        <div className="flex flex-col gap-1 text-sm text-gray-600">
                                                            {contact.email && <div className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-gray-400" /> {contact.email}</div>}
                                                            {contact.phone && <div className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-gray-400" /> {contact.phone}</div>}
                                                        </div>
                                                    </td>
                                                    <td className="p-4 text-right">
                                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button
                                                                onClick={() => handleEnrich(contact.id)}
                                                                disabled={enrichingId === contact.id || !contact.companyId}
                                                                className="p-2 text-gray-400 hover:text-atlas-orange hover:bg-orange-50 rounded-lg transition-colors disabled:opacity-50"
                                                                title={contact.companyId ? '✨ Enriquecer empresa com IA' : 'Contato sem empresa vinculada'}
                                                            >
                                                                {enrichingId === contact.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                                                            </button>
                                                            <button
                                                                onClick={() => { setSelectedContact(contact); setIsFormOpen(true); }}
                                                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                                title="Editar"
                                                            >
                                                                <Edit className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(contact.id)}
                                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                                title="Excluir"
                                                            >
                                                                <Trash className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            
                            {/* Pagination Controls */}
                            {totalPages > 1 && (
                                <div className="p-4 border-t border-gray-200 bg-gray-50/50 flex justify-between items-center">
                                    <span className="text-sm text-gray-500">
                                        Página {page} de {totalPages}
                                    </span>
                                    <div className="flex gap-2">
                                        <button
                                            disabled={page === 1}
                                            onClick={() => setPage(p => Math.max(1, p - 1))}
                                            className="px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 disabled:opacity-50 transition-colors text-sm font-medium"
                                        >
                                            Anterior
                                        </button>
                                        <button
                                            disabled={page === totalPages}
                                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                            className="px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 disabled:opacity-50 transition-colors text-sm font-medium"
                                        >
                                            Próxima
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
        
                    {isFormOpen && (
                        <ContactForm
                            contact={selectedContact}
                            onClose={() => { setIsFormOpen(false); setSelectedContact(null); }}
                            onSave={handleSave}
                        />
                    )}
                </div>
            );
        }
