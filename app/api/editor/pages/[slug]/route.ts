/**
 * Page API Route (by slug)
 * GET: Get a specific page
 * PUT: Update a page
 * DELETE: Delete a page
 */

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { updatePageSchema } from '@/lib/editor/validation/schemas';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const session = await auth();
    const { slug } = await params;

    const page = await prisma.page.findUnique({
      where: { slug },
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    // Check if user owns the page or if it's published
    if (!page.published && (!session?.user?.id || page.userId !== session.user.id)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json(page);
  } catch (error) {
    console.error('Get page error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { slug } = await params;
    const userId = session.user.id;
    const body = await req.json();
    const data = updatePageSchema.parse(body);

    // Verify ownership
    const existing = await prisma.page.findFirst({
      where: { slug, userId },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    // Check if new slug conflicts
    if (data.slug && data.slug !== slug) {
      const slugExists = await prisma.page.findUnique({
        where: { slug: data.slug },
      });

      if (slugExists) {
        return NextResponse.json(
          { error: 'Page with this slug already exists' },
          { status: 409 },
        );
      }
    }

    const page = await prisma.page.update({
      where: { slug },
      data: {
        ...data,
        updatedAt: new Date(),
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

    return NextResponse.json(page);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 },
      );
    }
    console.error('Update page error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { slug } = await params;
    const userId = session.user.id;

    // Verify ownership
    const existing = await prisma.page.findFirst({
      where: { slug, userId },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    await prisma.page.delete({
      where: { slug },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete page error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

