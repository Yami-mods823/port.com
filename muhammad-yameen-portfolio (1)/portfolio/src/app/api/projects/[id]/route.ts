import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { deleteFromBlob } from '@/lib/blob';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const project = await prisma.project.update({
    where: { id: params.id },
    data: {
      ...(body.title !== undefined && { title: body.title }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.technologies !== undefined && { technologies: body.technologies }),
      ...(body.imageUrl !== undefined && { imageUrl: body.imageUrl }),
      ...(body.liveUrl !== undefined && { liveUrl: body.liveUrl }),
      ...(body.githubUrl !== undefined && { githubUrl: body.githubUrl }),
      ...(body.published !== undefined && { published: body.published }),
      ...(body.order !== undefined && { order: body.order }),
    },
  });
  return NextResponse.json(project);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const project = await prisma.project.delete({ where: { id: params.id } });
  if (project.imageUrl) await deleteFromBlob(project.imageUrl);
  return NextResponse.json({ success: true });
}
