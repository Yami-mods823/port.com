import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const admin = new URL(req.url).searchParams.get('admin') === '1';
  const projects = await prisma.project.findMany({
    where: admin ? {} : { published: true },
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
  });
  return NextResponse.json({ projects });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const count = await prisma.project.count();

  const project = await prisma.project.create({
    data: {
      title: body.title,
      description: body.description,
      technologies: body.technologies || [],
      imageUrl: body.imageUrl || null,
      liveUrl: body.liveUrl || null,
      githubUrl: body.githubUrl || null,
      published: body.published ?? true,
      order: count,
    },
  });

  return NextResponse.json(project, { status: 201 });
}
