import { prisma } from '../../../lib/prisma';
import { leadSchema, type LeadStatus } from '../../../lib/zod';
import { z } from 'zod';
import { enrichCompany } from '../../prospecting/services/enrichment.service';
import {
    toPrismaLeadStatus,
    fromPrismaLeadStatus,
    fromPrismaCompanyStatus,
    fromPrismaActivityType,
    fromPrismaActivityStatus,
} from '../../../lib/enumMap';

function serializeLead<
    T extends {
        status: string;
        company?: { status: string } | null;
        activities?: Array<{ type: string; status: string }>;
    }
>(lead: T): T & { status: LeadStatus } {
    return {
        ...lead,
        status: fromPrismaLeadStatus(lead.status),
        ...(lead.company ? { company: { ...lead.company, status: fromPrismaCompanyStatus(lead.company.status) } } : {}),
        ...(lead.activities
            ? {
                  activities: lead.activities.map((a) => ({
                      ...a,
                      type: fromPrismaActivityType(a.type),
                      status: fromPrismaActivityStatus(a.status),
                  })),
              }
            : {}),
    };
}

export class LeadService {
    async findAll(organizationId: string, status?: string, page: number = 1, limit: number = 50) {
        const where = status ? { organizationId, status: toPrismaLeadStatus(status as LeadStatus) as any } : { organizationId };

        const skip = (page - 1) * limit;

        const [data, total] = await prisma.$transaction([
            prisma.lead.findMany({
                where,
                skip,
                take: limit,
                include: { company: true, contact: true },
                orderBy: { updatedAt: 'desc' }
            }),
            prisma.lead.count({ where })
        ]);

        return { data: data.map(serializeLead), meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
    }

    async findById(organizationId: string, id: string) {
        const lead = await prisma.lead.findFirst({
            where: { id, organizationId },
            include: {
                company: true,
                contact: true,
                activities: { orderBy: { date: 'desc' } },
                timeline: { orderBy: { createdAt: 'desc' } },
                internalNotes: { orderBy: { createdAt: 'desc' } }
            }
        });
        return lead ? serializeLead(lead) : null;
    }

    async create(organizationId: string, data: z.infer<typeof leadSchema>) {
        const validated = leadSchema.parse(data);
        const lead = await prisma.lead.create({
            data: {
                ...validated,
                status: toPrismaLeadStatus(validated.status) as any,
                organizationId,
                timeline: {
                    create: {
                        type: 'creation',
                        description: 'Lead criado no sistema'
                    }
                }
            },
            include: { company: true, contact: true }
        });
        return serializeLead(lead);
    }

    async updateStatus(organizationId: string, id: string, newStatus: string) {
        const currentLead = await prisma.lead.findFirst({ where: { id, organizationId } });
        if (!currentLead) throw new Error('Lead not found');

        const previousStatusLabel = fromPrismaLeadStatus(currentLead.status);
        const lead = await prisma.lead.update({
            where: { id },
            data: {
                status: toPrismaLeadStatus(newStatus as LeadStatus) as any,
                timeline: {
                    create: {
                        type: 'movement',
                        description: `Lead movido de '${previousStatusLabel}' para '${newStatus}'`
                    }
                }
            },
            include: { company: true, contact: true, timeline: { orderBy: { createdAt: 'desc' }, take: 1 } }
        });
        return serializeLead(lead);
    }

    async update(organizationId: string, id: string, data: Partial<z.infer<typeof leadSchema>>) {
        const currentLead = await prisma.lead.findFirst({ where: { id, organizationId } });
        if (!currentLead) throw new Error('Lead not found');

        const lead = await prisma.lead.update({
            where: { id },
            data: {
                ...data,
                ...(data.status ? { status: toPrismaLeadStatus(data.status) as any } : {}),
                timeline: {
                    create: {
                        type: 'edition',
                        description: 'Dados do lead atualizados'
                    }
                }
            }
        });
        return serializeLead(lead);
    }

    async delete(organizationId: string, id: string) {
        const currentLead = await prisma.lead.findFirst({ where: { id, organizationId } });
        if (!currentLead) throw new Error('Lead not found');
        return prisma.lead.delete({ where: { id } });
    }

    /**
     * Exporta todos os leads da organização no formato exato de importação de Leads do Bitrix24
     * (107 colunas, mesmo cabeçalho gerado pela exportação nativa do Bitrix — modelo fornecido pelo usuário).
     * Campos que o Bitrix espera mas que não coletamos (qualificação manual de venda, ex: "ERP/TMS Utilizado",
     * "Seguradora", "Dor Principal Mapeada") ficam em branco para o time preencher após a importação.
     */
    async exportCsv(organizationId: string): Promise<string> {
        const leads = await prisma.lead.findMany({
            where: { organizationId },
            include: { company: true, contact: true },
            orderBy: { createdAt: 'desc' },
        });

        // Cabeçalho idêntico ao exigido pela importação de Leads do Bitrix24 (posição importa).
        const headers = [
            'ID', 'Nome', 'Saudação', 'Primeiro nome', 'Sobrenome', 'Segundo nome', 'Nome completo',
            'Data de nascimento', 'Endereço: Endereço', 'Endereço: Rua, edifício', 'Endereço: Suíte / Apartamento',
            'Endereço: Cidade', 'Endereço: Região', 'Endereço: Estado / Província', 'Endereço: CEP', 'Endereço: País',
            'Telefone de trabalho', 'Celular', 'Fax', 'Telefone de casa', 'Número de pager',
            'Telefone de SMS Marketing', 'Outro número de telefone', 'Site Corporativo', 'Página pessoal',
            'Página do Facebook', 'Página VK', 'LiveJournal', 'Twitter', 'Outro site', 'Email de trabalho',
            'E-mail de casa', 'E-mail para boletins', 'Outro e-mail', 'Conta do Facebook', 'Conta Telegram',
            'Conta VK', 'Contato Viber', 'Comentários do Instagram', 'Contato da rede', 'Bate-papo ao vivo',
            'Conta Canal Aberto', 'Outro contato', 'Usuário vinculado', 'Nome da empresa', 'Cargo', 'Comentário',
            'Etapa', 'Informações da etapa', 'Product', 'Price', 'Quantity', 'Valor', 'Moeda', 'Fonte',
            'Informações da fonte', 'Disponível para todos', 'Pessoa responsável', 'Criado em', 'Criado por',
            'Atualizado em', 'Atualizado por', 'Data da mudança de etapa', 'Etapa alterada por', 'UTM Source',
            'UTM Medium', 'UTM Campaign', 'UTM Content', 'UTM Term', 'Origem', 'deal_ID', 'Etapa da Cadência',
            'Fluxo do Lead', 'Motivo de desqualificação', 'Data de Retomada', 'Segmento da Operação', 'Tipo de Carga',
            'Média mensal de contratação de terceiros', 'Frota Própria (Quantidade)', 'Agregados (Quantidade)',
            'Principais Rotas', 'ERP/TMS Utilizado', 'Rastreador Utilizado', 'Seguradora', 'Corretora',
            'Fornecedor de GR Atual', 'Possui Gestão de Risco?', 'Usa Motoristas Terceiros?',
            'Possui Software Logístico?', 'Software Logístico Atual', 'Possui Consulta e Cadastro de Motorista?',
            'Consulta e Cadastro Atual', 'Dor Principal Mapeada', 'Detalhamento da dor',
            'Dor se conecta a qual solução Atlas?', 'Linkedin', 'Cargo', 'Nível de autoridade',
            'Interesse percebido', 'Horizonte de Decisão', 'Média de viagem / mês', 'Telefone ', 'Observações',
            'Perfil da Operação?', 'O que você busca? ', 'Finalidade Principal', 'Média de Contratações Mês',
        ];

        const escape = (value: unknown) => {
            const s = value == null ? '' : String(value);
            return /[";\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
        };

        const rows = leads.map((l) => {
            const company = l.company;
            const contact = l.contact;
            const [firstName, ...restName] = (contact?.name || '').trim().split(/\s+/);
            const lastName = restName.join(' ');
            const linkedin = contact?.linkedin || company?.linkedin || '';
            const phone = contact?.phone || company?.phones?.[0] || '';

            const cols: unknown[] = new Array(headers.length).fill('');
            cols[1] = company?.tradeName || company?.legalName || l.source || ''; // Nome (título do lead)
            cols[3] = firstName || ''; // Primeiro nome
            cols[4] = lastName || ''; // Sobrenome
            cols[6] = contact?.name || ''; // Nome completo
            cols[8] = company?.address || ''; // Endereço: Endereço
            cols[11] = company?.city || ''; // Endereço: Cidade
            cols[13] = company?.state || ''; // Endereço: Estado / Província
            cols[14] = company?.zipCode || ''; // Endereço: CEP
            cols[15] = 'Brasil'; // Endereço: País
            cols[16] = phone; // Telefone de trabalho
            cols[17] = contact?.whatsapp || ''; // Celular
            cols[23] = company?.website || ''; // Site Corporativo
            cols[30] = contact?.email || ''; // Email de trabalho
            cols[44] = company?.tradeName || company?.legalName || ''; // Nome da empresa
            cols[45] = contact?.role || ''; // Cargo
            cols[46] = company?.observations || ''; // Comentário
            cols[47] = fromPrismaLeadStatus(l.status); // Etapa
            cols[54] = l.source || ''; // Fonte
            cols[57] = l.owner || ''; // Pessoa responsável
            cols[58] = l.createdAt.toISOString(); // Criado em
            cols[69] = l.channel || ''; // Origem
            cols[75] = company?.segment || ''; // Segmento da Operação
            cols[95] = linkedin; // Linkedin
            cols[96] = contact?.role || ''; // Cargo (2ª coluna, mesmo nome no template)
            cols[101] = phone; // Telefone (2ª coluna, com espaço no template)
            cols[102] = company?.observations || ''; // Observações
            return cols.map(escape).join(';');
        });

        return [headers.map(escape).join(';'), ...rows].join('\n');
    }

    /** Reenriquece o lead já prospectado: roda Receita Federal + heurísticas na empresa vinculada e recalcula o fit score. */
    async enrich(organizationId: string, id: string) {
        const lead = await prisma.lead.findFirst({ where: { id, organizationId }, include: { company: true } });
        if (!lead) throw new Error('Lead not found');
        if (!lead.companyId) throw new Error('Lead sem empresa vinculada — não é possível enriquecer');

        const result = await enrichCompany(lead.companyId, {
            segmentKeywords: lead.company?.segment ? [lead.company.segment] : undefined,
            fleetSizeHint: lead.company?.size || undefined,
        });

        const updated = await prisma.lead.update({
            where: { id },
            data: {
                score: result.fit.score,
                temperature: result.fit.temperature,
                timeline: {
                    create: {
                        type: 'generic',
                        description: `Lead reenriquecido — novo fit score ${result.fit.score}% (${result.fit.temperature})`,
                    },
                },
            },
            include: { company: true, contact: true, timeline: { orderBy: { createdAt: 'desc' }, take: 1 } },
        });

        return { lead: serializeLead(updated), fit: result.fit, enrichment: result };
    }
}
export const leadService = new LeadService();
