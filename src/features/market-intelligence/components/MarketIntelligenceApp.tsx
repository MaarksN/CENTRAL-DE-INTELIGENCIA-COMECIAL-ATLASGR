                                                <AlertTriangle className="h-3 w-3" aria-hidden="true" />DESATUALIZADO
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <dl className="mt-3 space-y-1 text-xs text-slate-600">
                                    <div><dt className="inline font-bold">Fonte: </dt><dd className="inline">{dataset.source ?? 'NÃO DISPONÍVEL'}</dd></div>
                                    <div><dt className="inline font-bold">Competência: </dt><dd className="inline">{dataset.competence ?? 'NÃO DISPONÍVEL'}</dd></div>
                                    <div><dt className="inline font-bold">Geografia: </dt><dd className="inline">{dataset.geography ?? 'NÃO DISPONÍVEL'}</dd></div>
                                    {typeof dataset.coverage === 'number' && <div><dt className="inline font-bold">Cobertura: </dt><dd className="inline">{number.format(dataset.coverage)}</dd></div>}
                                    {typeof dataset.unmatchedRate === 'number' && <div><dt className="inline font-bold">Qualidade: </dt><dd className="inline">{(1 - dataset.unmatchedRate).toLocaleString('pt-BR', { style: 'percent', minimumFractionDigits: 2 })} de match ({number.format(dataset.unmatchedRows ?? 0)} rejeitados)</dd></div>}
                                    {dataset.taxonomyVersion && <div><dt className="inline font-bold">Taxonomia: </dt><dd className="inline">{dataset.taxonomyVersion}</dd></div>}
                                </dl>
                                {freshness && (
                                    <p className={`mt-3 flex items-center gap-1.5 text-xs font-bold ${stale ? 'text-rose-700' : 'text-slate-500'}`}>
                                        <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />{freshness}
                                        {stale && ' — acima da cadência mensal esperada'}
                                    </p>
                                )}
                                {dataset.note && <p className="mt-3 text-xs leading-5 text-slate-500">{dataset.note}</p>}
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

export function MarketIntelligenceApp() {
    const [tab, setTab] = useState<TabId>('board');
    const [manifest, setManifest] = useState<MarketIntelligenceManifest | null>(null);
    const [territories, setTerritories] = useState<TerritoryRecord[]>([]);
    const [municipalities, setMunicipalities] = useState<MunicipalityRecord[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let alive = true;
        loadMarketIntelligenceSnapshot()
            .then((snapshot) => {
                if (!alive) return;
                setManifest(snapshot.manifest);
                setTerritories(snapshot.territories);
                setMunicipalities(snapshot.municipalities);
            })
            .catch((cause: unknown) => { if (!alive) return; setError(cause instanceof Error ? cause.message : 'Falha ao carregar Market Intelligence.'); });
        return () => { alive = false; };
    }, []);

    if (error) return <main className="flex-1 overflow-y-auto p-6"><div role="alert" className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-800"><AlertTriangle className="mb-2 h-5 w-5" aria-hidden="true" />{error}</div></main>;
    if (!manifest) return <main className="flex flex-1 items-center justify-center"><div className="flex items-center gap-2 text-sm font-bold text-slate-600"><Loader2 className="h-5 w-5 animate-spin text-[#FF5618]" aria-hidden="true" />Carregando inteligência territorial...</div></main>;

    return (
        <main className="flex-1 overflow-y-auto bg-[#F7F7F5] p-4 md:p-7">
            <div className="mx-auto w-full max-w-[1600px] space-y-5">
                <header className="relative overflow-hidden rounded-[28px] bg-[#333333] px-5 py-6 text-white md:px-8 md:py-8">
                    <div className="absolute inset-y-0 right-0 w-2 bg-[#FF5618]" aria-hidden="true" />
                    <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
                        <div className="max-w-4xl">
                            <img src="/tools/atlas-market-intelligence/atlas-logo-negative.png" alt="Atlas GR" className="h-auto w-28" />
                            <p className="mt-5 text-[10px] font-black uppercase tracking-[0.2em] text-[#FFC500]">National Market & Territory Intelligence System</p>
                            <h1 className="mt-2 text-3xl font-black leading-tight tracking-[-0.04em] md:text-5xl">Onde a Atlas GR deve contratar o próximo vendedor?</h1>
                            <p className="mt-3 max-w-3xl text-sm leading-6 text-white/70">Geointeligência, demanda, risco, logística, concorrência e unit economics com evidência rastreável. Sem converter lacuna de dados em certeza comercial.</p>
                        </div>
                        <div className={`rounded-2xl border px-4 py-3 ${manifest.decisionReady ? 'border-emerald-400/30 bg-emerald-400/10' : 'border-[#FFC500]/30 bg-[#FFC500]/10'}`}>
                            <div className="flex items-center gap-2 text-xs font-black">
                                {manifest.decisionReady ? <CheckCircle2 className="h-4 w-4 text-emerald-300" aria-hidden="true" /> : <AlertTriangle className="h-4 w-4 text-[#FFC500]" aria-hidden="true" />}
                                {manifest.decisionReady ? 'DECISÃO TERRITORIAL PRONTA' : 'DECISÃO TERRITORIAL BLOQUEADA'}
                            </div>
                            <p className="mt-1 text-[10px] text-white/60">Metodologia {manifest.methodologyVersion} · gerado {new Date(manifest.generatedAt).toLocaleString('pt-BR')}</p>
                            {manifest.decisionReady && <p className="mt-1 max-w-xs text-[10px] leading-4 text-emerald-100/80">Ranking geográfico liberado por evidência Core. Aprovação da contratação continua condicionada às premissas e ao ROI do simulador econômico.</p>}
                        </div>
                    </div>
                </header>

                <nav aria-label="Módulos de Market Intelligence" className="flex gap-1 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-1.5">
                    {TABS.map((item) => { const Icon = item.icon; const active = tab === item.id; return <button key={item.id} type="button" onClick={() => setTab(item.id)} aria-current={active ? 'page' : undefined} className={`flex shrink-0 items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-black transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5618] ${active ? 'bg-[#FF5618] text-white' : 'text-slate-600 hover:bg-slate-50 hover:text-[#333333]'}`}><Icon className="h-4 w-4" aria-hidden="true" />{item.label}</button>; })}
                </nav>

                {tab === 'board' && <BoardView manifest={manifest} territories={territories} />}
                {tab === 'territories' && <TerritoryView manifest={manifest} territories={territories} municipalities={municipalities} />}
                {tab === 'simulator' && <SellerSimulator />}
                {tab === 'data' && <DataHealth manifest={manifest} />}

                <footer className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-[10px] text-slate-500 md:flex-row md:items-center md:justify-between">
                    <span className="flex items-center gap-2"><BarChart3 className="h-4 w-4 text-[#FF5618]" aria-hidden="true" />Scores finais só aparecem quando o dataset e a confiança permitem.</span>
                    <span>Atlas GR · Market Intelligence</span>
                </footer>
            </div>
        </main>
    );
}
