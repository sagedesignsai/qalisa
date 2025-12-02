import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ provider: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { provider } = await params

    // Check if user has a password (can't remove last auth method)
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { password: true },
    })

    const accounts = await prisma.account.findMany({
      where: { userId: session.user.id },
    })

    // Don't allow removing if it's the only auth method and no password
    if (accounts.length === 1 && !user?.password) {
      return NextResponse.json(
        { error: "Cannot remove the only authentication method" },
        { status: 400 }
      )
    }

    // Delete the account connection
    await prisma.account.deleteMany({
      where: {
        userId: session.user.id,
        provider: provider,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete connection error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}


