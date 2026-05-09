import { PrismaClient } from "@prisma/client";
import { seedIndustries, seedServices } from "../src/lib/cms/seed";

const prisma = new PrismaClient();

async function main() {
  const serviceCount = await prisma.cmsService.count();
  if (serviceCount === 0) {
    await prisma.cmsService.createMany({
      data: seedServices.map((s) => ({
        title: s.title,
        category: s.category,
        description: s.description,
        imageUrl: s.imageUrl,
        imageAlt: s.imageAlt ?? null,
        badges: (s.badges as any) ?? null,
        order: s.order ?? 0,
      })),
    });
    console.log(`Seeded cmsService: ${seedServices.length}`);
  } else {
    console.log(`cmsService already has ${serviceCount} rows; skipping`);
  }

  const industryCount = await prisma.cmsIndustry.count();
  if (industryCount === 0) {
    await prisma.cmsIndustry.createMany({
      data: seedIndustries.map((s) => ({
        key: s.key,
        title: s.title,
        gradient: s.gradient,
        iconName: s.iconName,
        body: s.body,
        jobs: s.jobs as any,
        order: s.order ?? 0,
      })),
    });
    console.log(`Seeded cmsIndustry: ${seedIndustries.length}`);
  } else {
    console.log(`cmsIndustry already has ${industryCount} rows; skipping`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

