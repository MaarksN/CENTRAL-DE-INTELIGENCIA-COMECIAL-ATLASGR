import { useState } from 'react';
import {
    Search, Loader2, ShieldCheck, AlertTriangle, Building2, MapPin, Users,
    TrendingUp, Cpu, Database, Globe, CheckCircle2, Landmark, UserPlus, Sparkles, type LucideIcon
} from 'lucide-react';
import { api } from '../../../lib/api';
import type { CnpjLookupResult, FitScoreResult } from '../services/enrichment.service';
import type { ProspectCandidate, ProspectCriteria, DiscoverResult } from '../services/prospecting.service';
import {
    SEGMENTO_OPTIONS, LOCALIZACAO_OPTIONS, QUANTIDADE_OPTIONS,
} from '../constants/icp-options';

type HubTab = 'cnpj' | 'discovery';

const dropdownFields: Array<{ key: keyof Omit<ProspectCriteria, 'quantidade'>; label: string; options: string[] }> = [
    { key: 'segmento', label: 'Segmento (ICP)', options: SEGMENTO_OPTIONS },
    { key: 'localizacao', label: 'Região de Atuação', options: LOCALIZACAO_OPTIONS },
];

const loadingSteps = [
    'Buscando empresas via Google Places e Apollo.io...',
    'Consultando bases públicas (Receita Federal)...',
    'Cruzando dados com heurísticas de mercado...',
    'Calculando Score de Propensão...',
    'Finalizando prospecção...',
];

interface PromoteResult {
    lead: { id: string };
    fit?: FitScoreResult;
    enrichment?: {
        company: {
            googleRating?: number;
            googleReviewsCount?: number;
            observations?: string;
        };
        apolloContacts?: Array<{ name: string; title: string | null; email: string | null }>;
    };
}

function getErrorMessage(error: unknown, fallback: string): string {
    return error instanceof Error ? error.message : fallback;
}

export function ProspectingHub() {
    const [tab, setTab] = useState<HubTab>('cnpj');

    // --- CNPJ real lookup ---
    const [cnpjInput, setCnpjInput] = useState('');
    const [cnpjLoading, setCnpjLoading] = useState(false);
    const [cnpjResult, setCnpjResult] = useState<CnpjLookupResult | null>(null);
    const [cnpjError, setCnpjError] = useState<string | null>(null);

    // --- discovery via Google Places + Apollo ---
    const [criteria, setCriteria] = useState<ProspectCriteria>({
        segmento: SEGMENTO_OPTIONS[0],
        localizacao: LOCALIZACAO_OPTIONS[0],
        quantidade: QUANTIDADE_OPTIONS[0],
    });
    const [isSearching, setIsSearching] = useState(false);
    const [loadingStepIdx, setLoadingStepIdx] = useState(0);
    const [candidates, setCandidates] = useState<ProspectCandidate[]>([]);
    const [discoverError, setDiscoverError] = useState<string | null>(null);
    const [apolloError, setApolloError] = useState<string | null>(null);

    // --- shared: promote-to-CRM state ---
    const [promotingKey, setPromotingKey] = useState<string | null>(null);
    const [promoted, setPromoted] = useState<Record<string, PromoteResult>>({});

    // --- quick filter sobre os resultados já carregados (busca instantânea, sem nova chamada externa) ---
    const [resultFilter, setResultFilter] = useState('');
    const filteredCandidates = candidates
        .map((c, i) => ({ c, i }))
        .filter(({ c }) => {
            const q = resultFilter.trim().toLowerCase();
            if (!q) return true;
            return (
                c.tradeName.toLowerCase().includes(q) ||
                c.segment.toLowerCase().includes(q) ||
                c.location.toLowerCase().includes(q) ||
                c.size.toLowerCase().includes(q)
            );
        });

    const handleCnpjLookup = async () => {
        setCnpjLoading(true);
        setCnpjError(null);
        setCnpjResult(null);
        try {
            const result = await api.post<CnpjLookupResult>('/api/prospecting/enrich-cnpj', { cnpj: cnpjInput });
            setCnpjResult(result);
        } catch (error) {
            setCnpjError(getErrorMessage(error, 'Falha ao consultar CNPJ'));
        } finally {
            setCnpjLoading(false);
        }
    };

    const handleDiscover = async () => {
        setIsSearching(true);
        setDiscoverError(null);
        setApolloError(null);
        setCandidates([]);
        setLoadingStepIdx(0);
        const interval = setInterval(() => {
            setLoadingStepIdx((prev) => Math.min(prev + 1, loadingSteps.length - 1));
        }, 800);
        try {
            const result = await api.post<DiscoverResult>('/api/prospecting/discover', criteria);
            setCandidates(result.candidates);
            setApolloError(result.apolloError || null);
        } catch (error) {
            setDiscoverError(getErrorMessage(error, 'Falha ao buscar leads'));
        } finally {
            clearInterval(interval);
            setIsSearching(false);
        }
    };

    const promoteCnpjResult = async () => {
        if (!cnpjResult?.found || !cnpjResult.data) return;
        const key = `cnpj-${cnpjResult.cnpj}`;
        setPromotingKey(key);
        try {
            const result = await api.post<PromoteResult>('/api/prospecting/promote', {
                tradeName: cnpjResult.data.tradeName,
                legalName: cnpjResult.data.legalName,
                cnpj: cnpjResult.cnpj,
                segment: cnpjResult.data.cnaeDescription,
                size: cnpjResult.data.size,
                city: cnpjResult.data.city,
                state: cnpjResult.data.state,
                source: 'Busca por CNPJ (Receita Federal)',
                autoEnrich: true, // reaplica o enriquecimento no servidor para popular todos os campos e o fit score
            });
            setPromoted((prev) => ({ ...prev, [key]: result }));
        } catch (error) {
            setCnpjError(getErrorMessage(error, 'Falha ao adicionar ao CRM'));
        } finally {
            setPromotingKey(null);
        }
    };

    const promoteCandidate = async (candidate: ProspectCandidate, idx: number) => {
        const key = `discovery-${idx}`;
        setPromotingKey(key);
        try {
            const result = await api.post<PromoteResult>('/api/prospecting/promote', {
                tradeName: candidate.tradeName,
                legalName: candidate.legalNameGuess,
                cnpj: candidate.cnpjGuess,
                segment: candidate.segment,
                size: candidate.size,
                location: candidate.location,
                source: 'Prospecção (Google Places / Apollo)',
                autoEnrich: true,
            });
            setPromoted((prev) => ({ ...prev, [key]: result }));
        } catch (error) {
            setDiscoverError(getErrorMessage(error, 'Falha ao adicionar ao CRM'));
        } finally {
            setPromotingKey(null);
        }
    };

    return (
        <div className="flex-1 overflow-y-auto bg-gray-50/50 p-6 sm:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                <div>
                    <h1 className="text-2xl font-black text-atlas-dark">🔍 Prospecção & Enriquecimento ⚡</h1>
                    <p className="text-gray-500 mt-1">Encontre empresas reais, valide na Receita Federal e leve leads qualificados direto para o CRM.</p>
                </div>

                <div className="flex gap-2 bg-white p-1.5 rounded-2xl border border-gray-200 shadow-sm w-fit">
                    <button
                        onClick={() => setTab('cnpj')}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${tab === 'cnpj' ? 'bg-atlas-dark text-white shadow' : 'text-gray-500 hover:bg-gray-100'}`}
                    >
                        <Landmark size={16} /> 🏛️ Busca por CNPJ (Dados Reais)
                    </button>
                    <button
                        onClick={() => setTab('discovery')}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${tab === 'discovery' ? 'bg-atlas-dark text-white shadow' : 'text-gray-500 hover:bg-gray-100'}`}
                    >
                        <Sparkles size={16} /> 🗺️ Descoberta (Google Places + Apollo)
                    </button>
                </div>

                {tab === 'cnpj' && (
                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                        <div className="xl:col-span-4 bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-atlas-orange">
                                    <Landmark size={18} />
                                </div>
                                <h2 className="font-black text-xl text-atlas-dark">🏛️ Consulta Receita Federal</h2>
                            </div>
                            <p className="text-xs text-gray-500 mb-4">Dados oficiais via BrasilAPI — sem chave, sem custo, direto da base da Receita Federal.</p>
                            <label className="block text-[10px] tracking-wider font-bold uppercase mb-1.5 text-gray-500">CNPJ</label>
                            <input
                                className="w-full p-3 bg-gray-50/50 rounded-xl border border-gray-200 outline-none focus:border-atlas-orange focus:ring-1 focus:ring-atlas-orange transition-all text-sm font-medium text-atlas-dark mb-4"
                                value={cnpjInput}
                                placeholder="Ex: 19.131.243/0001-97"
                                onChange={(e) => setCnpjInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleCnpjLookup()}
                            />
                            <button
                                onClick={handleCnpjLookup}
                                disabled={cnpjLoading || !cnpjInput}
                                className="w-full bg-atlas-orange text-white py-3.5 rounded-xl font-bold hover:bg-[#E04B12] disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg shadow-atlas-orange/20"
                            >
                                {cnpjLoading ? <Loader2 className="animate-spin" size={18} /> : <Search size={18} />}
                                {cnpjLoading ? '⏳ Consultando...' : '🔎 Consultar'}
                            </button>
                            {cnpjError && (
                                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
                                    <AlertTriangle size={14} className="mt-0.5 shrink-0" /> {cnpjError}
                                </div>
                            )}
                        </div>

                        <div className="xl:col-span-8">
                            {!cnpjResult && !cnpjLoading && (
                                <div className="bg-white rounded-2xl border border-dashed border-gray-200 flex flex-col items-center justify-center p-10 min-h-[400px]">
                                    <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5">
                                        <Landmark className="text-gray-300" size={32} />
                                    </div>
                                    <h3 className="font-black text-xl text-atlas-dark mb-2">Nenhuma consulta feita</h3>
                                    <p className="text-sm text-gray-500 text-center max-w-sm">Digite um CNPJ para trazer dados cadastrais reais direto da Receita Federal.</p>
                                </div>
                            )}

                            {cnpjResult && !cnpjResult.found && (
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 flex flex-col items-center justify-center min-h-[300px]">
                                    <AlertTriangle className="text-amber-500 mb-4" size={40} />
                                    <h3 className="font-black text-xl text-atlas-dark mb-2">
                                        {cnpjResult.error === 'invalid_format' ? 'CNPJ inválido' : 'CNPJ não encontrado na base da Receita'}
                                    </h3>
                                    <p className="text-sm text-gray-500 text-center max-w-sm">
                                        {cnpjResult.error === 'invalid_format'
                                            ? 'Verifique os dígitos verificadores e tente novamente.'
                                            : 'Confira o número digitado — esse CNPJ não foi localizado na base pública.'}
                                    </p>
                                </div>
                            )}

                            {cnpjResult?.found && cnpjResult.data && (
                                <CnpjResultCard
                                    result={cnpjResult}
                                    onPromote={promoteCnpjResult}
                                    isPromoting={promotingKey === `cnpj-${cnpjResult.cnpj}`}
                                    promoted={!!promoted[`cnpj-${cnpjResult.cnpj}`]}
                                />
                            )}
                        </div>
                    </div>
                )}

                {tab === 'discovery' && (
                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                        <div className="xl:col-span-4 bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden flex flex-col h-full max-h-[800px]">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-atlas-orange opacity-5 transform rotate-45 translate-x-20 -translate-y-20" />
                            <div className="flex items-center gap-2 mb-6 relative z-10">
                                <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-atlas-orange">
                                    <Database size={18} />
                                </div>
                                <h2 className="font-black text-xl text-atlas-dark">🗺️ Motor de Busca Turbo</h2>
                            </div>
                            <p className="text-xs text-gray-500 mb-4 relative z-10">Busca real via Google Places e Apollo.io (Organization Search); cada candidato é validado na Receita Federal antes de virar Lead.</p>

                            <div className="space-y-4 relative z-10 flex-1 overflow-y-auto pr-2">
                                {dropdownFields.map(({ key, label, options }) => (
                                    <div key={key}>
                                        <label className="block text-[10px] tracking-wider font-bold uppercase mb-1.5 text-gray-500">{label}</label>
                                        <select
                                            className="w-full p-3 bg-gray-50/50 rounded-xl border border-gray-200 outline-none focus:border-atlas-orange focus:ring-1 focus:ring-atlas-orange transition-all text-sm font-medium text-atlas-dark"
                                            value={criteria[key]}
                                            onChange={(e) => setCriteria({ ...criteria, [key]: e.target.value })}
                                        >
                                            {options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                                        </select>
                                    </div>
                                ))}
                                <div>
                                    <label className="block text-[10px] tracking-wider font-bold uppercase mb-1.5 text-gray-500">Quantidade de Leads</label>
                                    <select
                                        className="w-full p-3 bg-gray-50/50 rounded-xl border border-gray-200 outline-none focus:border-atlas-orange focus:ring-1 focus:ring-atlas-orange transition-all text-sm font-medium text-atlas-dark"
                                        value={criteria.quantidade}
                                        onChange={(e) => setCriteria({ ...criteria, quantidade: Number(e.target.value) })}
                                    >
                                        {QUANTIDADE_OPTIONS.map((n) => <option key={n} value={n}>{n} leads</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="pt-6 mt-2 relative z-10 border-t border-gray-100">
                                <button
                                    onClick={handleDiscover}
                                    disabled={isSearching}
                                    className="w-full bg-atlas-orange text-white py-4 rounded-xl font-bold hover:bg-[#E04B12] disabled:opacity-80 transition-all flex items-center justify-center gap-2 shadow-lg shadow-atlas-orange/20"
                                >
                                    {isSearching ? (
                                        <><Loader2 className="animate-spin" size={20} /> <span>⏳ Buscando...</span></>
                                    ) : (
                                        <><Cpu size={20} /> <span>🚀 Encontrar Leads Ideais</span></>
                                    )}
                                </button>
                                {discoverError && <p className="text-xs text-red-600 mt-2">{discoverError}</p>}
                            </div>
                        </div>

                        <div className="xl:col-span-8 flex flex-col h-full">
                            <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
                                <h2 className="font-black text-2xl text-atlas-dark">✨ Resultados</h2>
                                {candidates.length > 0 && (
                                    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold">🎯 {filteredCandidates.length}/{candidates.length} Candidatos</span>
                                )}
                            </div>

                            {candidates.length > 0 && !isSearching && (
                                <div className="relative mb-4">
                                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="⚡ Filtrar resultados instantaneamente por nome, segmento, cidade..."
                                        value={resultFilter}
                                        onChange={(e) => setResultFilter(e.target.value)}
                                        className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-atlas-orange/20 focus:border-atlas-orange transition-all outline-none"
                                    />
                                </div>
                            )}

                            {apolloError && !isSearching && (
                                <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start gap-2">
                                    <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                                    Apollo.io não retornou resultados: {apolloError}
                                </div>
                            )}

                            {isSearching ? (
                                <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center p-10 min-h-[400px]">
                                    <div className="w-24 h-24 relative mb-8">
                                        <div className="absolute inset-0 border-4 border-gray-100 rounded-full" />
                                        <div className="absolute inset-0 border-4 border-atlas-orange rounded-full border-t-transparent animate-spin" />
                                        <div className="absolute inset-0 flex items-center justify-center text-atlas-orange">
                                            <Globe size={32} className="animate-pulse" />
                                        </div>
                                    </div>
                                    <h3 className="font-black text-xl text-atlas-dark mb-4 text-center">🌎 Mapeando Mercado...</h3>
                                    <div className="space-y-3 w-full max-w-sm">
                                        {loadingSteps.map((step, idx) => (
                                            <div key={idx} className={`flex items-center gap-3 text-sm font-medium ${idx === loadingStepIdx ? 'text-atlas-orange' : idx < loadingStepIdx ? 'text-gray-400' : 'text-gray-200 opacity-50'}`}>
                                                {idx < loadingStepIdx ? <CheckCircle2 size={16} /> : idx === loadingStepIdx ? <Loader2 size={16} className="animate-spin" /> : <div className="w-4 h-4 rounded-full border-2 border-current" />}
                                                {step}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : candidates.length > 0 ? (
                                <div className="space-y-4">
                                    {filteredCandidates.length === 0 && (
                                        <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-8 text-center text-sm text-gray-500">
                                            🔍 Nenhum candidato bate com "{resultFilter}".
                                        </div>
                                    )}
                                    {filteredCandidates.map(({ c, i }) => (
                                        <CandidateCard
                                            key={i}
                                            candidate={c}
                                            onPromote={() => promoteCandidate(c, i)}
                                            isPromoting={promotingKey === `discovery-${i}`}
                                            promoted={!!promoted[`discovery-${i}`]}
                                            promotedResult={promoted[`discovery-${i}`]}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="flex-1 bg-white rounded-2xl border border-dashed border-gray-200 flex flex-col items-center justify-center p-10 min-h-[400px]">
                                    <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5">
                                        <Search className="text-gray-300" size={32} />
                                    </div>
                                    <h3 className="font-black text-xl text-atlas-dark mb-2">🔍 Nenhum lead encontrado</h3>
                                    <p className="text-sm text-gray-500 text-center max-w-sm">
                                        Preencha os critérios de ICP ao lado e busque oportunidades reais de mercado via Google Places e Apollo.io.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function CnpjResultCard({
    result, onPromote, isPromoting, promoted,
}: {
    result: CnpjLookupResult; onPromote: () => void; isPromoting: boolean; promoted: boolean;
}) {
    const d = result.data!;
    const isActive = d.situacaoCadastral?.toUpperCase() === 'ATIVA';

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-black text-2xl text-atlas-dark">{d.tradeName}</h3>
                        <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            <ShieldCheck size={10} /> {d.situacaoCadastral}
                        </span>
                    </div>
                    <p className="text-sm text-gray-500">{d.legalName} · {result.cnpj}</p>
                </div>
                <span className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-xs font-bold">
                    <CheckCircle2 size={12} /> ✅ Dados oficiais — Receita Federal
                </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <InfoTile icon={Building2} label="Natureza Jurídica" value={d.naturezaJuridica} />
                <InfoTile icon={Users} label="Porte / Funcionários" value={`${d.size} (${d.employeeCountEstimate}+ estimado)`} />
                <InfoTile icon={TrendingUp} label="Capital Social" value={d.capitalSocial.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} />
                <InfoTile icon={MapPin} label="Localização" value={`${d.city}, ${d.state}`} />
            </div>

            <div>
                <p className="text-[10px] tracking-wider font-bold uppercase text-gray-500 mb-1">Atividade Principal (CNAE {d.cnae})</p>
                <p className="text-sm text-gray-700">{d.cnaeDescription}</p>
            </div>

            <div>
                <p className="text-[10px] tracking-wider font-bold uppercase text-gray-500 mb-2">Endereço</p>
                <p className="text-sm text-gray-700">{d.address}, {d.city} - {d.state}, {d.zipCode}</p>
            </div>

            {d.qsa.length > 0 && (
                <div>
                    <p className="text-[10px] tracking-wider font-bold uppercase text-gray-500 mb-2">Quadro Societário</p>
                    <div className="flex flex-wrap gap-2">
                        {d.qsa.map((s, i) => (
                            <span key={i} className="bg-gray-50 border border-gray-200 rounded-full px-3 py-1 text-xs text-gray-700">
                                {s.nome} <span className="text-gray-400">· {s.qualificacao}</span>
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {d.phones.length > 0 && (
                <div>
                    <p className="text-[10px] tracking-wider font-bold uppercase text-gray-500 mb-2">Telefones (Receita Federal)</p>
                    <p className="text-sm text-gray-700">{d.phones.join(' · ')}</p>
                </div>
            )}

            <div className="pt-4 border-t border-gray-100 flex justify-end">
                {promoted ? (
                    <span className="flex items-center gap-2 text-green-700 font-bold text-sm"><CheckCircle2 size={16} /> ✅ Adicionado ao CRM</span>
                ) : (
                    <button
                        onClick={onPromote}
                        disabled={isPromoting}
                        className="bg-atlas-dark text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-black transition-colors flex items-center gap-2 disabled:opacity-60"
                    >
                        {isPromoting ? <Loader2 className="animate-spin" size={16} /> : <UserPlus size={16} />}
                        {isPromoting ? '⏳ Adicionando...' : '➕ Adicionar ao CRM como Lead'}
                    </button>
                )}
            </div>
        </div>
    );
}

function InfoTile({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
    return (
        <div className="bg-gray-50/70 rounded-xl p-3">
            <div className="flex items-center gap-1.5 text-gray-400 mb-1">
                <Icon size={12} />
                <span className="text-[10px] tracking-wider font-bold uppercase">{label}</span>
            </div>
            <p className="text-sm font-bold text-atlas-dark truncate" title={value}>{value}</p>
        </div>
    );
}

function CandidateCard({
    candidate, onPromote, isPromoting, promoted, promotedResult,
}: {
    candidate: ProspectCandidate; onPromote: () => void; isPromoting: boolean; promoted: boolean; promotedResult?: PromoteResult;
}) {
    const finalScore = promotedResult?.fit?.score ?? candidate.fitScoreEstimate;
    const isEstimate = !promotedResult?.fit;
    const enrichment = promotedResult?.enrichment;

    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 hover:border-atlas-orange/40 transition-all shadow-sm group">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h3 className="font-black text-lg text-atlas-dark group-hover:text-atlas-orange transition-colors">{candidate.tradeName}</h3>
                        <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${finalScore >= 75 ? 'bg-green-100 text-green-700' : finalScore >= 45 ? 'bg-blue-100 text-blue-700' : 'bg-atlas-yellow/20 text-atlas-dark'}`}>
                            <TrendingUp size={10} /> Fit {finalScore}% {isEstimate && '(estimado)'}
                        </div>
                        {enrichment?.company.googleRating && (
                            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-yellow-50 text-yellow-700 border border-yellow-200">
                                ⭐ {enrichment.company.googleRating} Google ({enrichment.company.googleReviewsCount})
                            </span>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-4 text-xs font-semibold text-gray-500 mb-2">
                        <span className="flex items-center gap-1.5"><Building2 size={14} className="text-gray-400" /> {candidate.segment}</span>
                        <span className="flex items-center gap-1.5"><Users size={14} className="text-gray-400" /> {candidate.size}</span>
                        <span className="flex items-center gap-1.5"><MapPin size={14} className="text-gray-400" /> {candidate.location}</span>
                    </div>

                    {!enrichment && candidate.rationale && (
                        <p className="text-xs text-gray-400 italic mb-2">"{candidate.rationale}"</p>
                    )}

                    {enrichment?.company.observations && (
                        <div className="mt-3 p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl">
                            <p className="text-[10px] tracking-wider font-bold uppercase text-indigo-500 mb-1 flex items-center gap-1">
                                <Sparkles size={12} /> 📝 Resumo do Enriquecimento
                            </p>
                            <p className="text-xs text-gray-600 leading-relaxed">{enrichment.company.observations}</p>
                        </div>
                    )}

                    {enrichment?.apolloContacts && enrichment.apolloContacts.length > 0 && (
                        <div className="mt-3">
                            <p className="text-[10px] tracking-wider font-bold uppercase text-gray-500 mb-2 flex items-center gap-1">
                                <Users size={12} /> Decisores Descobertos (Apollo)
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {enrichment.apolloContacts.map((contact, idx) => (
                                    <span key={idx} className="bg-gray-50 border border-gray-200 rounded-full px-3 py-1 text-xs text-gray-700 flex items-center gap-1">
                                        <strong>{contact.name}</strong>
                                        {contact.title && <span className="text-gray-400">· {contact.title}</span>}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                {promoted ? (
                    <span className="flex items-center gap-2 text-green-700 font-bold text-sm shrink-0"><CheckCircle2 size={16} /> ✅ No CRM</span>
                ) : (
                    <button
                        onClick={onPromote}
                        disabled={isPromoting}
                        className="bg-gray-50 text-atlas-dark px-6 py-2.5 rounded-full font-bold text-sm hover:bg-atlas-orange hover:text-white transition-colors flex items-center gap-2 border border-gray-200 hover:border-atlas-orange w-full sm:w-auto justify-center shrink-0 disabled:opacity-60"
                    >
                        {isPromoting ? <Loader2 className="animate-spin" size={16} /> : <ShieldCheck size={16} />}
                        {isPromoting ? '⏳ Enriquecendo...' : '✨ Enriquecer e Adicionar'}
                    </button>
                )}
            </div>
        </div>
    );
}
