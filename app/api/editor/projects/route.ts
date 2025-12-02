/**
 * Projects API Route
 * GET: List all projects for the authenticated user
 * POST: Create a new project
 */

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { createProjectSchema } from '@/lib/editor/validation/schemas';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const { searchParams } = new URL(req.url);
    const isDraft = searchParams.get('isDraft');
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    const where: any = { userId };
    if (isDraft !== null) {
      where.isDraft = isDraft === 'true';
    }

    const [projects, total] = await Promise.all([
      prisma.editorProject.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: { updatedAt: 'desc' },
        include: {
          _count: {
            select: { pages: true },
          },
        },
      }),
      prisma.editorProject.count({ where }),
    ]);

    return NextResponse.json({
      projects,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Get projects error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await req.json();
    const data = createProjectSchema.parse(body);

    const project = await prisma.editorProject.create({
      data: {
        userId,
        name: data.name,
        isDraft: data.isDraft,
      },
      include: {
        _count: {
          select: { pages: true },
        },
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 },
      );
    }
    console.error('Create project error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

