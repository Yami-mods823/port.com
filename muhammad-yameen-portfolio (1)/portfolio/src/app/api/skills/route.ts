import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const admin = new URL(req.url).searchParams.get('admin') === '1';
  const skills = await prisma.skill.findMany({
    where: admin ? {} : { published: true },
    orderBy: [{ order: 'asc' }],
  });
  return NextResponse.json({ skills });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const count = await prisma.skill.count();

  const skill = await prisma.skill.create({
    data: {
      name: body.name,
      percentage: body.percentage ?? 50,
      logoUrl: body.logoUrl || null,
      published: body.published ?? true,
      order: count,
    },
  });

  return NextResponse.json(skill, { status: 201 });
}
