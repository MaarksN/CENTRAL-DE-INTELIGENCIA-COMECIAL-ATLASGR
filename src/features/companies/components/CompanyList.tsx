import { useState, useEffect } from 'react';
import { Search, Plus, Building2, MapPin, Building, Edit, Trash } from 'lucide-react';
import { Company } from '../../../types';
import { CompanyForm } from './CompanyForm';
import { CompanyDetail } from './CompanyDetail';

export function CompanyList() {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
    const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');

    const fetchCompanies = async () => {
        setLoading(true);
        try {
            const url = searchTerm ? `/api/companies?q=${encodeURIComponent(searchTerm)}` : '/api/companies';
            const res = await fetch(url);
            if (res.ok) {
                const data = await res.json();
                setCompanies(data);
            }
        } catch (error) {
            console.error('Error fetching companies:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchCompanies();
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [searchTerm]);

    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir esta empresa?')) return;
        try {
            const res = await fetch(`/api/companies/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setCompanies(prev => prev.filter(c => c.id !== id));
            }
        } catch (error) {
            console.error('Error deleting company:', error);
        }
    };

    const handleSave = () => {
        setIsFormOpen(false);
        fetchCompanies();
    };

    if (viewMode === 'detail' && selectedCompany) {
        return <CompanyDetail companyId={selectedCompany.id} onBack={() => { setViewMode('list'); setSelectedCompany(null); }} />;
    }

    return (
        <div className="flex-1 overflow-y-auto bg-gray-50/50 p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">Empresas</h1>
                        <p className="text-gray-500 mt-1">Gerencie a carteira de clientes e prospects</p>
                    </div>
                    <button
                        onClick={() => { setSelectedCompany(null); setIsFormOpen(true); }}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
                    >
                        <Plus className="w-5 h-5" />
                        Nova Empresa
                    </button>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar por nome, CNPJ..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                        />
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-50/50">
                                    <th className="p-4 text-sm font-medium text-gray-500">Empresa</th>
                                    <th className="p-4 text-sm font-medium text-gray-500 hidden md:table-cell">Segmento</th>
                                    <th className="p-4 text-sm font-medium text-gray-500 hidden lg:table-cell">Localização</th>
                                    <th className="p-4 text-sm font-medium text-gray-500">Status</th>
                                    <th className="p-4 text-sm font-medium text-gray-500 text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-gray-500">
                                            <div className="flex justify-center items-center gap-2">
                                                <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                                                Carregando empresas...
                                            </div>
                                        </td>
                                    </tr>
                                ) : companies.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-gray-500">
                                            Nenhuma empresa encontrada.
                                        </td>
                                    </tr>
                                ) : (
                                    companies.map((company) => (
                                        <tr key={company.id} className="hover:bg-gray-50/50 transition-colors group">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3 cursor-pointer" onClick={() => { setSelectedCompany(company); setViewMode('detail'); }}>
                                                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                                                        <Building2 className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">{company.tradeName || company.legalName}</p>
                                                        <p className="text-sm text-gray-500">{company.cnpj || 'Sem CNPJ'}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 hidden md:table-cell">
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <Building className="w-4 h-4 text-gray-400" />
                                                    {company.segment || '-'}
                                                </div>
                                            </td>
                                            <td className="p-4 hidden lg:table-cell">
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <MapPin className="w-4 h-4 text-gray-400" />
                                                    {company.city ? `${company.city}, ${company.state}` : '-'}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                                    company.status === 'Ativo' ? 'bg-green-50 text-green-700 border border-green-200' :
                                                    'bg-gray-100 text-gray-700 border border-gray-200'
                                                }`}>
                                                    {company.status}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => { setSelectedCompany(company); setIsFormOpen(true); }}
                                                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Editar"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(company.id)}
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
                </div>
            </div>

            {isFormOpen && (
                <CompanyForm
                    company={selectedCompany}
                    onClose={() => { setIsFormOpen(false); setSelectedCompany(null); }}
                    onSave={handleSave}
                />
            )}
        </div>
    );
}
