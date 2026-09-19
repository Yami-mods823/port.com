import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { deleteFromBlob } from '@/lib/blob';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();

  const video = await prisma.video.update({
    where: { id: params.id },
    data: {
      ...(body.title !== undefined && { title: body.title }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.category !== undefined && { category: body.category }),
      ...(body.aiTools !== undefined && { aiTools: body.aiTools }),
      ...(body.date !== undefined && { date: new Date(body.date) }),
      ...(body.videoUrl !== undefined && { videoUrl: body.videoUrl }),
      ...(body.thumbnailUrl !== undefined && { thumbnailUrl: body.thumbnailUrl }),
      ...(body.published !== undefined && { published: body.published }),
      ...(body.order !== undefined && { order: body.order }),
    },
  });

  return NextResponse.json(video);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const video = await prisma.video.delete({ where: { id: params.id } });

  if (video.videoUrl) await deleteFromBlob(video.videoUrl);
  if (video.thumbnailUrl) await deleteFromBlob(video.thumbnailUrl);

  return NextResponse.json({ success: true });
}
