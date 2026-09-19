import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const skill = await prisma.skill.update({
    where: { id: params.id },
    data: {
      ...(body.name !== undefined && { name: body.name }),
      ...(body.percentage !== undefined && { percentage: body.percentage }),
      ...(body.logoUrl !== undefined && { logoUrl: body.logoUrl }),
      ...(body.published !== undefined && { published: body.published }),
      ...(body.order !== undefined && { order: body.order }),
    },
  });
  return NextResponse.json(skill);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await prisma.skill.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
