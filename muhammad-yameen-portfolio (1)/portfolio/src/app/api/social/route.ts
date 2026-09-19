import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const PLATFORMS = ['GITHUB', 'LINKEDIN', 'INSTAGRAM', 'YOUTUBE', 'TIKTOK', 'WHATSAPP'] as const;

export async function GET() {
  const links = await prisma.socialLink.findMany();
  const existing = new Set(links.map((l: { platform: string }) => l.platform));
  const missing = PLATFORMS.filter((p) => !existing.has(p));

  for (const platform of missing) {
    await prisma.socialLink.create({ data: { platform, url: null } });
  }

  const all = missing.length ? await prisma.socialLink.findMany() : links;
  return NextResponse.json({ links: all });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json(); // { platform, url }
  const link = await prisma.socialLink.upsert({
    where: { platform: body.platform },
    update: { url: body.url || null },
    create: { platform: body.platform, url: body.url || null },
  });
  return NextResponse.json(link);
}
