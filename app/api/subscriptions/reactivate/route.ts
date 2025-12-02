import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const subscription = await prisma.userSubscription.findFirst({
      where: {
        userId: session.user.id,
        cancelAtPeriodEnd: true,
      },
    })

    if (!subscription) {
      return NextResponse.json(
        { error: "No cancelled subscription found" },
        { status: 404 }
      )
    }

    // Reactivate subscription
    await prisma.userSubscription.update({
      where: { id: subscription.id },
      data: {
        cancelAtPeriodEnd: false,
        cancelledAt: null,
        status: "ACTIVE",
      },
    })

    return NextResponse.json({
      success: true,
      message: "Subscription reactivated successfully",
    })
  } catch (error) {
    console.error("Reactivate subscription error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
