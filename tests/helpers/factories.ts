import { faker } from '@faker-js/faker';
import type { Prisma } from '@prisma/client';

export const CompanyFactory = {
  build: (overrides?: any): any => ({
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
  build: (overrides?: any): any => {
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
  build: (overrides?: any): any => ({
    status: 'Novo Lead',
    source: faker.helpers.arrayElement(['Inbound', 'Outbound', 'Referral']),
    temperature: faker.helpers.arrayElement(['Frio', 'Morno', 'Quente']),
    score: faker.number.int({ min: 0, max: 100 }),
    owner: faker.person.fullName(),
    ...overrides,
  }),
};

export const ActivityFactory = {
  build: (overrides?: any): any => ({
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
  build: (overrides?: any): any => ({
    content: faker.lorem.paragraph(),
    author: faker.person.fullName(),
    lead: overrides?.lead || {
      create: LeadFactory.build(),
    },
    ...overrides,
  }),
};

export const TimelineEventFactory = {
  build: (overrides?: any): any => ({
    type: 'generic',
    description: faker.lorem.sentence(),
    lead: overrides?.lead || {
      create: LeadFactory.build(),
    },
    ...overrides,
  }),
};
