import React from "react";
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Contact, Company } from '../../../types';

interface ContactFormProps {
    contact?: Contact | null;
    onClose: () => void;
    onSave: () => void;
}

export function ContactForm({ contact, onClose, onSave }: ContactFormProps) {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [formData, setFormData] = useState<Partial<Contact>>({
        name: '',
        role: '',
        email: '',
        phone: '',
        whatsapp: '',
        companyId: '',
        status: 'Ativo'
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (contact) {
            setFormData(contact);
        }
        const fetchCompanies = async () => {
            try {
                const res = await fetch('/api/companies');
                if (res.ok) {
                    const data = await res.json();
                    setCompanies(data);
                }
            } catch (error) {
                console.error('Error fetching companies for contact form:', error);
            }
        };
        fetchCompanies();
    }, [contact]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const method = contact ? 'PUT' : 'POST';
            const url = contact ? `/api/contacts/${contact.id}` : '/api/contacts';
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                onSave();
            }
        } catch (error) {
            console.error('Error saving contact:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-xl">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h2 className="text-xl font-semibold text-gray-900">
                        {contact ? 'Editar Contato' : 'Novo Contato'}
                    </h2>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    <form id="contact-form" onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Nome *</label>
                                <input required type="text" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Empresa *</label>
                                <select required value={formData.companyId || ''} onChange={e => setFormData({...formData, companyId: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none">
                                    <option value="" disabled>Selecione uma empresa</option>
                                    {companies.map(company => (
                                        <option key={company.id} value={company.id}>{company.tradeName || company.legalName}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Cargo</label>
                                <input type="text" value={formData.role || ''} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">E-mail</label>
                                <input type="email" value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Telefone</label>
                                <input type="text" value={formData.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">WhatsApp</label>
                                <input type="text" value={formData.whatsapp || ''} onChange={e => setFormData({...formData, whatsapp: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-medium text-gray-700">Observações</label>
                                <textarea rows={3} value={formData.observations || ''} onChange={e => setFormData({...formData, observations: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none" />
                            </div>
                        </div>
                    </form>
                </div>

                <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors font-medium">
                        Cancelar
                    </button>
                    <button type="submit" form="contact-form" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-sm font-medium disabled:opacity-50 flex items-center gap-2">
                        {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                        {contact ? 'Salvar Alterações' : 'Criar Contato'}
                    </button>
                </div>
            </div>
        </div>
    );
}
