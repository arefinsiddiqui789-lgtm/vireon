import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function buildConnectionString(): string | undefined {
  const raw = process.env.DATABASE_URL;
  if (!raw) return undefined; // no URL — let Prisma read its own env
  if (raw.includes('sslmode=')) return raw;
  return raw + (raw.includes('?') ? '&' : '?') + 'sslmode=require';
}

function createPrismaClient() {
  const url = buildConnectionString();
  return new PrismaClient({
    ...(url ? { datasources: { db: { url } } } : {}),
    log: ['query', 'error'],
  });
}

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db