export type CrmEntityId = string;
export type CrmSource = 'manual' | 'referral' | 'website' | 'import' | 'unknown';
export type CrmPriority = 'low' | 'medium' | 'high' | 'urgent';
export type CrmStatus = 'draft' | 'active' | 'archived';
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'disqualified';
export type DealStatus = 'open' | 'won' | 'lost';
export type ActivityType = 'call' | 'email' | 'meeting' | 'task' | 'note';

export type CrmOwner = {
  id: CrmEntityId;
  displayName: string;
  email?: string;
  status: CrmStatus;
};

export type CrmBaseModel = {
  id: CrmEntityId;
  createdAt?: Date | string;
  updatedAt?: Date | string;
};

export type CrmLead = CrmBaseModel & {
  kind: 'lead';
  name: string;
  email?: string;
  phone?: string;
  companyName?: string;
  status: LeadStatus;
  source: CrmSource;
  priority?: CrmPriority;
  ownerId?: string;
  owner?: CrmOwner;
};

export type CrmContact = CrmBaseModel & {
  kind: 'contact';
  name: string;
  email?: string;
  phone?: string;
  companyId?: CrmEntityId;
  status: CrmStatus;
  source: CrmSource;
  ownerId?: string;
  owner?: CrmOwner;
};

export type CrmCompany = CrmBaseModel & {
  kind: 'company';
  name: string;
  document?: string;
  website?: string;
  status: CrmStatus;
  source: CrmSource;
  ownerId?: string;
  owner?: CrmOwner;
};

export type CrmDeal = CrmBaseModel & {
  kind: 'deal';
  title: string;
  status: DealStatus;
  amount?: number;
  currency?: string;
  pipelineId?: CrmEntityId;
  stageId?: CrmEntityId;
  companyId?: CrmEntityId;
  contactId?: CrmEntityId;
  priority?: CrmPriority;
  ownerId?: string;
  owner?: CrmOwner;
};

export type CrmPipeline = CrmBaseModel & {
  kind: 'pipeline';
  name: string;
  status: CrmStatus;
  stages: readonly CrmPipelineStage[];
};

export type CrmPipelineStage = CrmBaseModel & {
  kind: 'pipeline_stage';
  name: string;
  order: number;
  status: CrmStatus;
  pipelineId?: CrmEntityId;
};

export type PipelineDealCard = {
  id: CrmEntityId;
  pipelineId: CrmEntityId;
  stageId: CrmEntityId;
  title: string;
  amount?: number;
  amountLabel: string;
  status: DealStatus;
  priority?: CrmPriority;
  companyId?: CrmEntityId;
  contactId?: CrmEntityId;
  ownerName?: string;
};

export type PipelineColumn = {
  id: CrmEntityId;
  pipelineId: CrmEntityId;
  name: string;
  order: number;
  status: CrmStatus;
  dealCount: number;
  value: number;
  valueLabel: string;
  deals: readonly PipelineDealCard[];
};

export type PipelineBoard = {
  pipelineId: CrmEntityId;
  title: string;
  pipelineName: string;
  totalValue: number;
  totalValueLabel: string;
  columns: readonly PipelineColumn[];
};
