import { prisma } from '../../src/lib/prisma.js';
import {
  type CrmCompany,
  type CrmContact,
  type CrmDeal,
  type CrmLead,
  type CrmPipeline,
  type CrmPipelineStage,
  type CrmStatus,
  type DealStatus,
  type LeadStatus
} from '../../src/shared/types/crm.js';

export const CrmService = {
  async listLeads(): Promise<CrmLead[]> {
    const records = await prisma.lead.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return records.map(record => ({
      ...record,
      id: record.id,
      kind: 'lead',
      name: record.name,
      email: record.email || undefined,
      phone: record.phone || undefined,
      status: record.status as LeadStatus,
      source: (record.source as any) || 'unknown'
    }));
  },

  async listContacts(): Promise<CrmContact[]> {
    const records = await prisma.contact.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return records.map(record => ({
      ...record,
      id: record.id,
      kind: 'contact',
      name: record.name,
      email: record.email || undefined,
      phone: record.phone || undefined,
      companyId: record.companyId || undefined,
      status: 'active',
      source: 'unknown'
    }));
  },

  async listCompanies(): Promise<CrmCompany[]> {
    const records = await prisma.company.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return records.map(record => ({
      ...record,
      id: record.id,
      kind: 'company',
      name: record.name,
      document: record.document || undefined,
      website: record.website || undefined,
      status: 'active',
      source: 'unknown'
    }));
  },

  async listDeals(): Promise<CrmDeal[]> {
    const records = await prisma.deal.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return records.map(record => ({
      ...record,
      id: record.id,
      kind: 'deal',
      title: record.title,
      amount: record.amount || undefined,
      currency: record.currency || undefined,
      status: record.status as DealStatus,
      pipelineId: record.pipelineId || undefined,
      stageId: record.stageId || undefined,
      companyId: record.companyId || undefined,
      contactId: record.contactId || undefined
    }));
  },

  async listPipelines(): Promise<CrmPipeline[]> {
    const [pipelines, stages] = await Promise.all([
      prisma.pipeline.findMany({ orderBy: { createdAt: 'asc' } }),
      prisma.pipelineStage.findMany({ orderBy: { order: 'asc' } })
    ]);

    return pipelines.map(record => ({
      ...record,
      id: record.id,
      kind: 'pipeline',
      name: record.name,
      status: record.status as CrmStatus,
      stages: stages.filter(s => s.pipelineId === record.id).map(stage => ({
        ...stage,
        id: stage.id,
        kind: 'pipeline_stage',
        name: stage.name,
        order: stage.order,
        status: stage.status as CrmStatus,
        pipelineId: stage.pipelineId
      }))
    }));
  },

  async createDeal(data: any): Promise<CrmDeal> {
    const record = await prisma.deal.create({
      data: {
        title: data.title,
        amount: data.amount,
        currency: data.currency || 'BRL',
        status: 'open',
        pipelineId: data.pipelineId,
        stageId: data.stageId,
        companyId: data.companyId,
        contactId: data.contactId,
        ownerId: data.ownerId
      }
    });
    
    return {
      ...record,
      id: record.id,
      kind: 'deal',
      title: record.title,
      amount: record.amount || undefined,
      currency: record.currency || undefined,
      status: record.status as DealStatus,
      pipelineId: record.pipelineId || undefined,
      stageId: record.stageId || undefined,
      companyId: record.companyId || undefined,
      contactId: record.contactId || undefined
    };
  },

  async moveDealToStage(dealId: string, stageId: string): Promise<CrmDeal | null> {
    const record = await prisma.deal.update({
      where: { id: dealId },
      data: { stageId }
    });
    return {
      ...record,
      id: record.id,
      kind: 'deal',
      title: record.title,
      amount: record.amount || undefined,
      currency: record.currency || undefined,
      status: record.status as DealStatus,
      pipelineId: record.pipelineId || undefined,
      stageId: record.stageId || undefined,
      companyId: record.companyId || undefined,
      contactId: record.contactId || undefined
    };
  },

  async createPipeline(data: any): Promise<CrmPipeline> {
    const pipelineRecord = await prisma.pipeline.create({
      data: {
        name: data.name,
        status: 'active'
      }
    });
    
    const stageNames = data.stages?.length ? data.stages : ['Novo', 'Proposta', 'Fechado'];
    const stages = await Promise.all(stageNames.map((stageName: string, index: number) =>
      prisma.pipelineStage.create({
        data: {
          pipelineId: pipelineRecord.id,
          name: stageName,
          order: index,
          status: 'active'
        }
      })
    ));

    return {
      ...pipelineRecord,
      id: pipelineRecord.id,
      kind: 'pipeline',
      name: pipelineRecord.name,
      status: pipelineRecord.status as CrmStatus,
      stages: stages.map(stage => ({
        ...stage,
        id: stage.id,
        kind: 'pipeline_stage',
        name: stage.name,
        order: stage.order,
        status: stage.status as CrmStatus,
        pipelineId: stage.pipelineId
      }))
    };
  },

  async addNote(data: any) {
    return prisma.note.create({
      data: {
        content: data.content,
        leadId: data.leadId,
        companyId: data.companyId,
        contactId: data.contactId,
        dealId: data.dealId
      }
    });
  },

  async getTimeline(entityId: string, entityType: 'lead' | 'company' | 'contact' | 'deal') {
    const filter = { [`${entityType}Id`]: entityId };
    
    const [notes, activities] = await Promise.all([
      prisma.note.findMany({ where: filter, orderBy: { createdAt: 'desc' } }),
      prisma.activity.findMany({ where: filter, orderBy: { createdAt: 'desc' } })
    ]);

    const timeline = [
      ...notes.map(n => ({ ...n, kind: 'note', date: n.createdAt })),
      ...activities.map(a => ({ ...a, kind: 'activity', date: a.createdAt }))
    ].sort((a, b) => b.date.getTime() - a.date.getTime());

    return timeline;
  }
};
