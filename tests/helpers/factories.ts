import { faker } from '@faker-js/faker';
import type { Prisma } from '@prisma/client';

export const CompanyFactory = {
  build: (overrides?: Partial<Prisma.CompanyCreateInput>): Prisma.CompanyCreateInput => ({
    legalName: faker.company.name(),
    tradeName: faker.company.name(),
    cnpj: faker.string.numeric(14),
    segment: faker.commerce.department(),
    size: faker.helpers.arrayElement(['Pequena', 'Média', 'Grande']),
    employeeCount: faker.number.int({ min: 1, max: 1000 }),
    estimatedRevenue: faker.number.float({ min: 10000, max: 10000000 }),
    website: faker.internet.url(),
    linkedin: faker.internet.url(),
    emails: [faker.internet.email()],
    phones: [faker.phone.number()],
    status: 'Ativo',
    ...overrides,
  }),
};

export const ContactFactory = {
  build: (overrides?: Partial<Prisma.ContactCreateInput>): Prisma.ContactCreateInput => {
    return {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      role: faker.person.jobTitle(),
      status: 'Ativo',
      company: overrides?.company || {
        create: CompanyFactory.build(),
      },
      ...overrides,
    };
  },
};

export const LeadFactory = {
  build: (overrides?: Partial<Prisma.LeadCreateInput>): Prisma.LeadCreateInput => ({
    status: 'Novo Lead',
    source: faker.helpers.arrayElement(['Inbound', 'Outbound', 'Referral']),
    temperature: faker.helpers.arrayElement(['Frio', 'Morno', 'Quente']),
    score: faker.number.int({ min: 0, max: 100 }),
    owner: faker.person.fullName(),
    ...overrides,
  }),
};

export const ActivityFactory = {
  build: (overrides?: Partial<Prisma.ActivityCreateInput>): Prisma.ActivityCreateInput => ({
    type: faker.helpers.arrayElement(['Ligação', 'E-mail', 'Reunião', 'Visita']),
    owner: faker.person.fullName(),
    date: faker.date.recent(),
    status: 'Concluída',
    lead: overrides?.lead || {
      create: LeadFactory.build(),
    },
    ...overrides,
  }),
};

export const NoteFactory = {
  build: (overrides?: Partial<Prisma.NoteCreateInput>): Prisma.NoteCreateInput => ({
    content: faker.lorem.paragraph(),
    author: faker.person.fullName(),
    lead: overrides?.lead || {
      create: LeadFactory.build(),
    },
    ...overrides,
  }),
};

export const TimelineEventFactory = {
  build: (overrides?: Partial<Prisma.TimelineEventCreateInput>): Prisma.TimelineEventCreateInput => ({
    type: 'generic',
    description: faker.lorem.sentence(),
    lead: overrides?.lead || {
      create: LeadFactory.build(),
    },
    ...overrides,
  }),
};
