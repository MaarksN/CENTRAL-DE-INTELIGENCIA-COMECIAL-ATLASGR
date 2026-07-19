import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { AuditService } from './audit/audit.service.js';

import { PrismaPg } from '@prisma/adapter-pg';
import { meili } from './search/index.js';
import { logger } from './logger.js';

const connectionString = process.env.DATABASE_URL || "postgresql://dummy:dummy@localhost:5432/dummy";

// Production-ready connection pool configuration
const pool = new Pool({
  connectionString,
  max: 20, // Max number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
});

// Error handling for idle clients
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

const adapter = new PrismaPg(pool);

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const basePrisma = globalForPrisma.prisma || new PrismaClient({
  adapter,
});

export const prisma = basePrisma.$extends({
  query: {
    company: {
      async create({ args, query }) {
        const result = await query(args);
        meili.index('companies').addDocuments([{ ...result }]).catch(err => logger.error(err, 'Failed to index company'));
        AuditService.log({ action: 'CREATE', entity: 'Company', entityId: result.id, tenantId: result.organizationId || undefined }).catch(err => logger.error(err, 'AuditLog failed'));
        return result;
      },
      async update({ args, query }) {
        const result = await query(args);
        meili.index('companies').updateDocuments([{ ...result }]).catch(err => logger.error(err, 'Failed to update company index'));
        AuditService.log({ action: 'UPDATE', entity: 'Company', entityId: result.id, tenantId: result.organizationId || undefined }).catch(err => logger.error(err, 'AuditLog failed'));
        return result;
      },
      async delete({ args, query }) {
        const result = await query(args);
        AuditService.log({ action: 'DELETE', entity: 'Company', entityId: result.id, tenantId: result.organizationId || undefined }).catch(err => logger.error(err, 'AuditLog failed'));
        return result;
      }
    },
    lead: {
      async create({ args, query }) {
        const result = await query(args);
        meili.index('leads').addDocuments([{ ...result }]).catch(err => logger.error(err, 'Failed to index lead'));
        AuditService.log({ action: 'CREATE', entity: 'Lead', entityId: result.id, tenantId: result.organizationId || undefined }).catch(err => logger.error(err, 'AuditLog failed'));
        return result;
      },
      async update({ args, query }) {
        const result = await query(args);
        meili.index('leads').updateDocuments([{ ...result }]).catch(err => logger.error(err, 'Failed to update lead index'));
        AuditService.log({ action: 'UPDATE', entity: 'Lead', entityId: result.id, tenantId: result.organizationId || undefined }).catch(err => logger.error(err, 'AuditLog failed'));
        return result;
      },
      async delete({ args, query }) {
        const result = await query(args);
        AuditService.log({ action: 'DELETE', entity: 'Lead', entityId: result.id, tenantId: result.organizationId || undefined }).catch(err => logger.error(err, 'AuditLog failed'));
        return result;
      }
    }
  }
}) as unknown as PrismaClient; // Cast needed due to complex extension types

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = basePrisma;

// Graceful shutdown handling
process.on('beforeExit', async () => {
  console.log('Shutting down Prisma client and database connection pool...');
  await prisma.$disconnect();
  await pool.end();
  console.log('Shutdown complete.');
});
