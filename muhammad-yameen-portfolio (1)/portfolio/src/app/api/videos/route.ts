import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const admin = searchParams.get('admin') === '1';
  const limit = Number(searchParams.get('limit') || 0);
  const cursor = searchParams.get('cursor') || undefined;

  const videos = await prisma.video.findMany({
    where: admin ? {} : { published: true },
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    ...(limit ? { take: limit } : {}),
    ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
  });

  return NextResponse.json({
    videos,
    nextCursor: limit && videos.length === limit ? videos[videos.length - 1].id : null,
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const count = await prisma.video.count();

  const video = await prisma.video.create({
    data: {
      title: body.title,
      description: body.description,
      category: body.category || 'Claymation',
      aiTools: body.aiTools || [],
      date: body.date ? new Date(body.date) : new Date(),
      videoUrl: body.videoUrl,
      thumbnailUrl: body.thumbnailUrl || null,
      published: body.published ?? true,
      order: count,
    },
  });

  return NextResponse.json(video, { status: 201 });
}
