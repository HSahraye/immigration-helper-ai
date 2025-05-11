import { PrismaClient } from '@prisma/client'

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
// Learn more: https://pris.ly/d/help/next-js-best-practices

declare global {
  var prisma: PrismaClient | undefined
}

// Check if we're in build/test mode
const isBuildTime = () => {
  return process.env.NODE_ENV === 'test' || 
         process.env.NEXT_PHASE === 'phase-production-build' ||
         !process.env.DATABASE_URL ||
         process.env.DATABASE_URL.includes('dummy');
};

class PrismaMock {
  constructor() {
    return new Proxy({}, {
      get: () => async () => null
    })
  }
}

const prismaClientSingleton = () => {
  if (isBuildTime()) {
    console.log('Build time detected, using mock PrismaClient')
    return new PrismaMock() as unknown as PrismaClient
  }
  return new PrismaClient();
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

export { prisma };
export default prisma;
export * from '@prisma/client';
export { isBuildTime }; 