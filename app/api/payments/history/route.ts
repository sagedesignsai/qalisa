import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get("limit") || "50", 10)
    const offset = parseInt(searchParams.get("offset") || "0", 10)

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where: { userId: session.user.id },
        include: {
          subscription: {
            select: {
              id: true,
              plan: true,
              status: true,
            },
          },
          transactions: {
            orderBy: { createdAt: "desc" },
            take: 5,
          },
        },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
      }),
      prisma.payment.count({
        where: { userId: session.user.id },
      }),
    ])

    const formattedPayments = payments.map((payment) => ({
      id: payment.id,
      amount: payment.amount,
      currency: payment.currency,
      status: payment.status,
      paymentMethod: payment.paymentMethod,
      description: payment.description,
      plan: payment.subscription?.plan,
      subscriptionStatus: payment.subscription?.status,
      createdAt: payment.createdAt.toISOString(),
      updatedAt: payment.updatedAt.toISOString(),
      transactions: payment.transactions.map((tx) => ({
        id: tx.id,
        type: tx.type,
        amount: tx.amount,
        status: tx.status,
        description: tx.description,
        createdAt: tx.createdAt.toISOString(),
      })),
    }))

    return NextResponse.json({
      payments: formattedPayments,
      total,
      limit,
      offset,
    })
  } catch (error) {
    console.error("Get payment history error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
