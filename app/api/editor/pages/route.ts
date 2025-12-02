/**
 * Pages API Route
 * GET: List all pages for the authenticated user
 * POST: Create a new page
 */

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { createPageSchema } from '@/lib/editor/validation/schemas';
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
    const projectId = searchParams.get('projectId');
    const published = searchParams.get('published');
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    const where: any = { userId };
    if (projectId) {
      where.projectId = projectId;
    }
    if (published !== null) {
      where.published = published === 'true';
    }

    const [pages, total] = await Promise.all([
      prisma.page.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: { updatedAt: 'desc' },
        include: {
          project: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
      prisma.page.count({ where }),
    ]);

    return NextResponse.json({
      pages,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Get pages error:', error);
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
    const data = createPageSchema.parse(body);

    // Check if slug already exists
    const existing = await prisma.page.findUnique({
      where: { slug: data.slug },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Page with this slug already exists' },
        { status: 409 },
      );
    }

    // Verify project ownership if projectId provided
    if (data.projectId) {
      const project = await prisma.editorProject.findFirst({
        where: {
          id: data.projectId,
          userId,
        },
      });

      if (!project) {
        return NextResponse.json(
          { error: 'Project not found' },
          { status: 404 },
        );
      }
    }

    const page = await prisma.page.create({
      data: {
        userId,
        projectId: data.projectId || null,
        slug: data.slug,
        title: data.title,
        craftJson: data.craftJson || null,
        rekaJson: data.rekaJson || null,
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(page, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 },
      );
    }
    console.error('Create page error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

