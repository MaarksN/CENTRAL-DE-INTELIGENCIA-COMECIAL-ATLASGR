import type {
    MarketIntelligenceManifest,
    MunicipalityRecord,
    SourceEvidence,
    TerritoryRecord,
} from './domain/MarketIntelligence';
import {
    buildCoreTerritories,
    hydrateCoreEvidence,
    type MdfeMunicipalRow,
} from './domain/coreEvidence';

const BASE = '/tools/atlas-market-intelligence/data';

async function readJson<T>(path: string): Promise<T> {
    const response = await fetch(path, { headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error(`Falha ao carregar ${path}: HTTP ${response.status}`);
    return response.json() as Promise<T>;
}

async function readOptionalJson<T>(path: string, fallback: T): Promise<T> {
    const response = await fetch(path, { headers: { Accept: 'application/json' } });
    if (response.status === 404) return fallback;
    if (!response.ok) throw new Error(`Falha ao carregar ${path}: HTTP ${response.status}`);
    return response.json() as Promise<T>;
}

export async function loadMarketManifest(): Promise<MarketIntelligenceManifest> {
    return readJson<MarketIntelligenceManifest>(`${BASE}/manifest.json`);
}

export async function loadMunicipalities(manifest: MarketIntelligenceManifest): Promise<MunicipalityRecord[]> {
    if (!manifest.files.municipalities) return [];
    return readJson<MunicipalityRecord[]>(`${BASE}/${manifest.files.municipalities}`);
}

export async function loadTerritories(manifest: MarketIntelligenceManifest): Promise<TerritoryRecord[]> {
    if (!manifest.files.territories) return [];
    return readJson<TerritoryRecord[]>(`${BASE}/${manifest.files.territories}`);
}

export async function loadEvidences(manifest: MarketIntelligenceManifest): Promise<SourceEvidence[]> {
    if (!manifest.files.evidences) return [];
    return readJson<SourceEvidence[]>(`${BASE}/${manifest.files.evidences}`);
}

async function loadMdfeMunicipalFlow(): Promise<{ origins: MdfeMunicipalRow[]; destinations: MdfeMunicipalRow[] }> {
    const [origins, destinations] = await Promise.all([
        readOptionalJson<MdfeMunicipalRow[]>(`${BASE}/mdfe_origens_municipios.json`, []),
        readOptionalJson<MdfeMunicipalRow[]>(`${BASE}/mdfe_destinos_municipios.json`, []),
    ]);
    return { origins, destinations };
}

export interface MarketIntelligenceSnapshot {
    manifest: MarketIntelligenceManifest;
    municipalities: MunicipalityRecord[];
    territories: TerritoryRecord[];
    evidences: SourceEvidence[];
}

export async function loadMarketIntelligenceSnapshot(): Promise<MarketIntelligenceSnapshot> {
    const manifest = await loadMarketManifest();
    const [municipalitiesBase, publishedTerritories, evidences, mdfe] = await Promise.all([
        loadMunicipalities(manifest),
        loadTerritories(manifest),
        loadEvidences(manifest),
        loadMdfeMunicipalFlow(),
    ]);

    // O snapshot municipal publicado pode ter sido gerado antes do CIOT mais recente. A hidratação
    // client-side recompõe somente os componentes matematicamente reproduzíveis a partir dos
    // arquivos versionados: RNTRC, CIOT e Need=risco PROXY_UF. Nenhuma lacuna de concorrência é
    // convertida em zero. Quando um territorios.json oficial existir, ele continua tendo precedência.
    const municipalities = mdfe.origins.length || mdfe.destinations.length
        ? hydrateCoreEvidence(municipalitiesBase, mdfe.origins, mdfe.destinations)
        : municipalitiesBase;
    const territories = publishedTerritories.length
        ? publishedTerritories
        : buildCoreTerritories(municipalities);

    return { manifest, municipalities, territories, evidences };
}
