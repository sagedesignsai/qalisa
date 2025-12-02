import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { initPayFast } from "@/lib/payments/payfast"
import { NextResponse } from "next/server"
import { z } from "zod"
import { Subscription } from "@/lib/generated/prisma/enums"

const initiatePaymentSchema = z.object({
  plan: z.nativeEnum(Subscription),
  frequency: z.enum(["monthly", "yearly"]).optional().default("monthly"),
})

// Subscription plan pricing in ZAR cents
const PLAN_PRICES: Record<Subscription, { monthly: number; yearly: number }> = {
  FREE: { monthly: 0, yearly: 0 },
  STARTER: { monthly: 900, yearly: 9000 }, // R9/month or R90/year
  PROFESSIONAL: { monthly: 2900, yearly: 29000 }, // R29/month or R290/year
  ENTERPRISE: { monthly: 0, yearly: 0 }, // Custom pricing
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { plan, frequency } = initiatePaymentSchema.parse(body)

    // Get user details
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        name: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check if plan is valid
    if (plan === Subscription.FREE) {
      return NextResponse.json(
        { error: "Cannot initiate payment for free plan" },
        { status: 400 }
      )
    }

    if (plan === Subscription.ENTERPRISE) {
      return NextResponse.json(
        { error: "Please contact sales for enterprise pricing" },
        { status: 400 }
      )
    }

    const planPrice = PLAN_PRICES[plan]
    const amount = frequency === "yearly" ? planPrice.yearly : planPrice.monthly

    if (amount === 0) {
      return NextResponse.json(
        { error: "Invalid plan pricing" },
        { status: 400 }
      )
    }

    // Create or update user subscription
    let subscription = await prisma.userSubscription.findFirst({
      where: {
        userId: user.id,
        plan: plan,
        status: { in: ["ACTIVE", "PENDING"] },
      },
    })

    if (!subscription) {
      subscription = await prisma.userSubscription.create({
        data: {
          userId: user.id,
          plan: plan,
          status: "PENDING",
        },
      })
    }

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        userId: user.id,
        subscriptionId: subscription.id,
        amount: amount,
        currency: "ZAR",
        status: "PENDING",
        paymentMethod: "CARD", // Default, can be changed by user on PayFast
        description: `${plan} Plan - ${frequency === "yearly" ? "Yearly" : "Monthly"} subscription`,
        metadata: {
          plan,
          frequency,
        },
      },
    })

    // Calculate billing date (next month or next year)
    const billingDate = new Date()
    if (frequency === "yearly") {
      billingDate.setFullYear(billingDate.getFullYear() + 1)
    } else {
      billingDate.setMonth(billingDate.getMonth() + 1)
    }

    // Initialize PayFast
    const payfast = initPayFast()

    // Create subscription payment data
    const paymentData = payfast.createSubscriptionData({
      userId: user.id,
      email: user.email,
      amount: amount,
      itemName: `${plan} Plan Subscription`,
      itemDescription: `${plan} Plan - ${frequency === "yearly" ? "Yearly" : "Monthly"} subscription`,
      paymentId: payment.id,
      plan: plan,
      billingDate: billingDate,
      frequency: frequency,
      cycles: 0, // Indefinite subscription
      name: user.name || undefined,
    })

    // Update payment with PayFast merchant ID
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        payfastMerchantId: payment.id,
      },
    })

    // Return payment form HTML
    const paymentForm = payfast.createPaymentForm(paymentData)

    return new NextResponse(paymentForm, {
      headers: {
        "Content-Type": "text/html",
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Initiate payment error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
