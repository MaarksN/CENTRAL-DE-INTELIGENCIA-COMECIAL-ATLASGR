import { z } from 'zod';

export const companySchema = z.object({
  legalName: z.string().min(1, 'Razão Social é obrigatória'),
  tradeName: z.string().min(1, 'Nome Fantasia é obrigatório'),
  cnpj: z.string().optional().nullable(),
  stateRegistration: z.string().optional().nullable(),
  segment: z.string().optional().nullable(),
  cnae: z.string().optional().nullable(),
  size: z.string().optional().nullable(),
  employeeCount: z.number().int().optional().nullable(),
  estimatedRevenue: z.number().optional().nullable(),
  website: z.string().optional().nullable(),
  linkedin: z.string().optional().nullable(),
  instagram: z.string().optional().nullable(),
  phones: z.array(z.string()).optional().default([]),
  emails: z.array(z.string()).optional().default([]),
  address: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  zipCode: z.string().optional().nullable(),
  owner: z.string().optional().nullable(),
  status: z.string().default('Ativo'),
  tags: z.array(z.string()).optional().default([]),
  observations: z.string().optional().nullable()
});

export const contactSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  role: z.string().optional().nullable(),
  department: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  whatsapp: z.string().optional().nullable(),
  email: z.string().email('E-mail inválido').optional().nullable().or(z.literal('')),
  linkedin: z.string().optional().nullable(),
  birthDate: z.string().optional().nullable(),
  observations: z.string().optional().nullable(),
  status: z.string().default('Ativo'),
  companyId: z.string()
});

export const leadSchema = z.object({
  name: z.string().optional().nullable(),
  segment: z.string().optional().nullable(),
  size: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  status: z.string().default('Novo Lead'),
  fitScore: z.number().int().optional().nullable(),
  notes: z.string().optional().nullable(),
  source: z.string().optional().nullable(),
  channel: z.string().optional().nullable(),
  temperature: z.string().optional().nullable(),
  score: z.number().int().optional().nullable(),
  owner: z.string().optional().nullable(),
  companyId: z.string().optional().nullable(),
  contactId: z.string().optional().nullable()
});

export const activitySchema = z.object({
  type: z.string(),
  owner: z.string(),
  date: z.string(),
  time: z.string().optional().nullable(),
  status: z.string().default('Pendente'),
  observations: z.string().optional().nullable(),
  leadId: z.string()
});
