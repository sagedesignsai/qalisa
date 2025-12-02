import { auth } from '@/lib/auth';
import {
  updateContentItem,
  deleteContentItem,
  getContentItemById,
} from '@/lib/studio/services/content-item-service';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ projectId: string; itemId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { projectId, itemId } = await params;

    const item = await getContentItemById(itemId, projectId);

    if (!item) {
      return NextResponse.json({ error: 'Content item not found' }, { status: 404 });
    }

    return NextResponse.json({ item });
  } catch (error) {
    console.error('Error getting content item:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ projectId: string; itemId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { projectId, itemId } = await params;
    const body = await req.json();
    const { title, status, metadata, data } = body;

    const item = await updateContentItem(itemId, projectId, {
      title,
      status,
      metadata,
      data,
    });

    return NextResponse.json({ item });
  } catch (error) {
    console.error('Error updating content item:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ projectId: string; itemId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { projectId, itemId } = await params;

    await deleteContentItem(itemId, projectId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting content item:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

