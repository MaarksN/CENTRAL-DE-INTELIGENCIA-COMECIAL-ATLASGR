// Opções de ICP (Perfil de Cliente Ideal) para os dropdowns do Prospector.
// Extraídas do "Playbook de Pré-Vendas Atlas" e do "Playbook Comercial - AtlasGR"
// fornecidos pelo time comercial.

export const SEGMENTO_OPTIONS = [
    'Transportadora (frota própria/agregados/terceiros)',
    'Embarcador',
    'Operador Logístico (3PL/4PL)',
    'Facilities / RH com terceirização (via Atlas Profile)',
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

// Estados do Brasil — usados para refinar a busca (Google Places + Apollo) além da região ampla do playbook.
export const ESTADO_OPTIONS = [
    'Acre', 'Alagoas', 'Amapá', 'Amazonas', 'Bahia', 'Ceará', 'Distrito Federal',
    'Espírito Santo', 'Goiás', 'Maranhão', 'Mato Grosso', 'Mato Grosso do Sul',
    'Minas Gerais', 'Pará', 'Paraíba', 'Paraná', 'Pernambuco', 'Piauí',
    'Rio de Janeiro', 'Rio Grande do Norte', 'Rio Grande do Sul', 'Rondônia',
    'Roraima', 'Santa Catarina', 'São Paulo', 'Sergipe', 'Tocantins',
];

// Faixas de funcionários no formato exigido pela Apollo Organization Search API
// (organization_num_employees_ranges: "min,max").
export const PORTE_OPTIONS = [
    { label: 'Qualquer porte', value: '' },
    { label: '1-10 funcionários', value: '1,10' },
    { label: '11-50 funcionários', value: '11,50' },
    { label: '51-200 funcionários', value: '51,200' },
    { label: '201-500 funcionários', value: '201,500' },
    { label: '501-1000 funcionários', value: '501,1000' },
    { label: '1001+ funcionários', value: '1001,1000000' },
];
