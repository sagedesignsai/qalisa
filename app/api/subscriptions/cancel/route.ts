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
        status: "ACTIVE",
      },
    })

    if (!subscription) {
      return NextResponse.json(
        { error: "No active subscription found" },
        { status: 404 }
      )
    }

    // Cancel at period end
    await prisma.userSubscription.update({
      where: { id: subscription.id },
      data: {
        cancelAtPeriodEnd: true,
        cancelledAt: new Date(),
      },
    })

    // Note: In production, you would also cancel the PayFast subscription
    // This requires PayFast API integration for subscription management
    // For now, we'll just mark it for cancellation

    return NextResponse.json({
      success: true,
      message: "Subscription will be cancelled at the end of the current billing period",
    })
  } catch (error) {
    console.error("Cancel subscription error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
