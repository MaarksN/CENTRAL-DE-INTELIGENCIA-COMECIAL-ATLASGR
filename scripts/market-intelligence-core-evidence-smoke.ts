import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { MunicipalityRecord } from '../src/features/market-intelligence/domain/MarketIntelligence';
import {
    buildCoreTerritories,
    hydrateCoreEvidence,
    type MdfeMunicipalRow,
} from '../src/features/market-intelligence/domain/coreEvidence';

const DATA_DIR = resolve(process.cwd(), 'public/tools/atlas-market-intelligence/data');

function readJson<T>(filename: string): T {
    return JSON.parse(readFileSync(resolve(DATA_DIR, filename), 'utf8')) as T;
}

const municipalities = readJson<MunicipalityRecord[]>('municipios_scored.json');
const origins = readJson<MdfeMunicipalRow[]>('mdfe_origens_municipios.json');
const destinations = readJson<MdfeMunicipalRow[]>('mdfe_destinos_municipios.json');

if (municipalities.length < 5_000) {
    throw new Error(`Snapshot municipal incompleto: ${municipalities.length} linhas.`);
}
if (!origins.length || !destinations.length) {
    throw new Error('Snapshot CIOT origem/destino não foi publicado ou está vazio.');
}

const hydrated = hydrateCoreEvidence(municipalities, origins, destinations);
const scored = hydrated.filter((row) => row.scores.confidenceAdjustedOpportunity.value !== null);
const territories = buildCoreTerritories(hydrated);

if (scored.length < 1_000) {
    throw new Error(`Cobertura Core Evidence insuficiente: somente ${scored.length} municípios pontuados.`);
}
if (territories.length < 5) {
    throw new Error(`Ranking territorial insuficiente: somente ${territories.length} candidatos.`);
}
if (territories.some((territory) => territory.opportunityScore === null)) {
    throw new Error('Ranking territorial contém candidato sem Opportunity Score.');
}

const top5 = territories.slice(0, 5).map((territory, index) => ({
    rank: index + 1,
    baseCity: territory.baseCity,
    uf: territory.uf,
    radiusKm: territory.radiusKm,
    municipalities: territory.municipalityCount,
    opportunityScore: Number(territory.opportunityScore?.toFixed(2)),
    confidence: territory.confidence,
    icpAccounts: territory.icp.total,
    ciotTrips: territory.mdfe.trips,
}));

console.log(JSON.stringify({
    methodology: 'national-v1.1-core-evidence',
    municipalities: municipalities.length,
    scoredMunicipalities: scored.length,
    ciotOrigins: origins.length,
    ciotDestinations: destinations.length,
    territoryCandidates: territories.length,
    top5,
}, null, 2));
