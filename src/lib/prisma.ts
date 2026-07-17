import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

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

export const prisma = globalForPrisma.prisma || new PrismaClient({
  adapter,
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Graceful shutdown handling
process.on('beforeExit', async () => {
  console.info('Shutting down Prisma client and database connection pool...');
  await prisma.$disconnect();
  await pool.end();
  console.info('Shutdown complete.');
});
