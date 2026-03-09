import { PrismaClient } from '@prisma/client';

/**
 * Prisma Client Singleton
 * Évite de créer plusieurs instances en développement (hot reload)
 */

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? (
    process.env.NODE_ENV === 'test'
        ? ({} as PrismaClient)
        : new PrismaClient({
            log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
          })
);

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
}

/**
 * Fonction pour fermer proprement la connexion
 */
export async function disconnectPrisma() {
    if (typeof prisma.$disconnect === 'function') {
        await prisma.$disconnect();
    }
}

/**
 * Fonction pour vérifier la connexion
 */
export async function checkPrismaConnection() {
    try {
        await prisma.$connect();
        return true;
    } catch (error) {
        return false;
    }
}