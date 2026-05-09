// NOTE:
// On Windows, Prisma's generated client lives in `node_modules/.prisma/client`.
// Importing from there ensures the project picks up the latest generated model types.
import { PrismaClient } from "../../node_modules/.prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
