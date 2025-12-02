import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { z } from "zod"
import { NextResponse } from "next/server"
import { Subscription } from "@/lib/generated/prisma/enums"

const updateSubscriptionSchema = z.object({
  subscription: z.nativeEnum(Subscription),
})

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch user and active subscription separately
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        subscription: true,
        createdAt: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Fetch active subscription
    const activeSubscription = await prisma.userSubscription.findFirst({
      where: {
        userId: session.user.id,
        status: {
          in: ["ACTIVE", "PENDING"],
        },
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        plan: true,
        status: true,
        currentPeriodStart: true,
        currentPeriodEnd: true,
        cancelAtPeriodEnd: true,
        cancelledAt: true,
        createdAt: true,
      },
    })

    return NextResponse.json({
      subscription: user.subscription,
      createdAt: user.createdAt,
      activeSubscription: activeSubscription
        ? {
            id: activeSubscription.id,
            plan: activeSubscription.plan,
            status: activeSubscription.status,
            currentPeriodStart: activeSubscription.currentPeriodStart,
            currentPeriodEnd: activeSubscription.currentPeriodEnd,
            cancelAtPeriodEnd: activeSubscription.cancelAtPeriodEnd,
            cancelledAt: activeSubscription.cancelledAt,
            createdAt: activeSubscription.createdAt,
          }
        : null,
    })
  } catch (error) {
    console.error("Get billing error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { subscription } = updateSubscriptionSchema.parse(body)

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: { subscription },
      select: {
        id: true,
        subscription: true,
      },
    })

    return NextResponse.json({ subscription: user.subscription })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Update subscription error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}


