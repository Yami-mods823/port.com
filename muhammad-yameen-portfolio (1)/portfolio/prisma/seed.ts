import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1 },
  });

  const skills = [
    { name: 'HTML', percentage: 90, order: 0 },
    { name: 'CSS', percentage: 88, order: 1 },
    { name: 'JavaScript', percentage: 85, order: 2 },
    { name: 'Python', percentage: 75, order: 3 },
    { name: 'MySQL', percentage: 80, order: 4 },
    { name: 'PHP', percentage: 82, order: 5 },
    { name: 'Laravel', percentage: 78, order: 6 },
    { name: 'Git', percentage: 80, order: 7 },
  ];

  for (const skill of skills) {
    const existing = await prisma.skill.findFirst({ where: { name: skill.name } });
    if (!existing) await prisma.skill.create({ data: skill });
  }

  const platforms = ['GITHUB', 'LINKEDIN', 'INSTAGRAM', 'YOUTUBE', 'TIKTOK', 'WHATSAPP'] as const;
  for (const platform of platforms) {
    await prisma.socialLink.upsert({
      where: { platform },
      update: {},
      create: { platform, url: null },
    });
  }

  console.log('Seed complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
