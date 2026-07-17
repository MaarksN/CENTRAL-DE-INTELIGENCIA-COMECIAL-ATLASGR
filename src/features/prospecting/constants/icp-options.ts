// Opções de ICP (Perfil de Cliente Ideal), Persona e Cenário-Gatilho (PIC) para os
// dropdowns do Prospector. Extraídas do "Playbook de Pré-Vendas Atlas" e do
// "Playbook Comercial - AtlasGR" fornecidos pelo time comercial.

export const SEGMENTO_OPTIONS = [
    'Transportadora (frota própria/agregados/terceiros)',
    'Embarcador',
    'Operador Logístico (3PL/4PL)',
    'Facilities / RH com terceirização (via Atlas Profile)',
];

// PIC = Perfil Ideal de Cliente por cenário/gatilho comercial (Playbook de Pré-Vendas, Matriz de Nicho).
export const PIC_OPTIONS = [
    'PIC 1 — Transportadora em expansão operacional',
    'PIC 2 — Transportadora sob pressão de risco',
    'PIC 3 — Empresa em transição de liderança',
];

export const PERSONA_OPTIONS = [
    'Dono / CEO',
    'Diretor(a) de Operações / COO',
    'Diretor(a) de Logística / Supply (Embarcador)',
    'Gerente de Risco / Compliance (GR)',
    'Gerente de Operações / Transportes',
    'Gerente de Logística',
    'Coordenador(a) de Monitoramento / Torre / Tracking',
    'TI / Integrações / Dados',
    'Jurídico / Compliance',
    'Financeiro / Controller',
];

// RJ e Grande SP aparecem no playbook como regiões de maior índice de roubo — prioridade de risco.
export const LOCALIZACAO_OPTIONS = [
    'Rio de Janeiro e Região',
    'São Paulo e Grande SP',
    'Sul (PR, SC, RS)',
    'Sudeste (MG, ES)',
    'Nordeste',
    'Centro-Oeste',
    'Norte',
    'Brasil (todas as regiões)',
];

export const QUANTIDADE_OPTIONS = [10, 25, 50, 100];
