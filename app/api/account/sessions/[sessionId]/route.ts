import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { sessionId } = await params

    // Find the session to delete
    const sessionToDelete = await prisma.session.findUnique({
      where: { id: sessionId },
      select: { userId: true },
    })

    if (!sessionToDelete) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 })
    }

    // Verify it belongs to the user
    if (sessionToDelete.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Check if this is the only session
    const sessionCount = await prisma.session.count({
      where: { userId: session.user.id },
    })

    if (sessionCount <= 1) {
      return NextResponse.json(
        { error: "Cannot delete the only active session" },
        { status: 400 }
      )
    }

    // Delete the session
    await prisma.session.delete({
      where: { id: sessionId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete session error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

