import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'], // Puedes quitar esto en producción si no quieres ver consultas en consola
  });

// Previene múltiples instancias en desarrollo (hot reload en Next.js)
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
