import '@testing-library/jest-dom/vitest';


vi.mock('@/lib/prisma', () => ({
  prisma: {
    company: { findMany: vi.fn(), findUnique: vi.fn(), create: vi.fn(), update: vi.fn(), delete: vi.fn(), deleteMany: vi.fn() },
    contact: { findMany: vi.fn(), findUnique: vi.fn(), create: vi.fn(), update: vi.fn(), delete: vi.fn(), deleteMany: vi.fn() },
    lead: { findMany: vi.fn(), findUnique: vi.fn(), create: vi.fn(), update: vi.fn(), delete: vi.fn(), deleteMany: vi.fn() },
    activity: { findMany: vi.fn(), findUnique: vi.fn(), create: vi.fn(), update: vi.fn(), delete: vi.fn(), deleteMany: vi.fn() },
    timelineEvent: { create: vi.fn(), findMany: vi.fn(), deleteMany: vi.fn() },
    note: { create: vi.fn(), findMany: vi.fn(), deleteMany: vi.fn() }
  }
}));
