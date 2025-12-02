import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { initPolar } from "@/lib/payments/polar"
import { NextResponse } from "next/server"
import { z } from "zod"
import { Subscription } from "@/lib/generated/prisma/enums"

const initiatePolarPaymentSchema = z.object({
  plan: z.nativeEnum(Subscription),
  productId: z.string().optional(), // Polar product ID
  priceId: z.string().optional(), // Polar price ID
})

// Map our subscription plans to Polar product/price IDs
// These should be configured in Polar dashboard and stored in env or database
const POLAR_PRODUCT_MAP: Record<
  Subscription,
  { productId: string; monthlyPriceId: string; yearlyPriceId: string }
> = {
  FREE: {
    productId: process.env.POLAR_PRODUCT_FREE_ID || "",
    monthlyPriceId: process.env.POLAR_PRICE_FREE_MONTHLY_ID || "",
    yearlyPriceId: process.env.POLAR_PRICE_FREE_YEARLY_ID || "",
  },
  STARTER: {
    productId: process.env.POLAR_PRODUCT_STARTER_ID || "",
    monthlyPriceId: process.env.POLAR_PRICE_STARTER_MONTHLY_ID || "",
    yearlyPriceId: process.env.POLAR_PRICE_STARTER_YEARLY_ID || "",
  },
  PROFESSIONAL: {
    productId: process.env.POLAR_PRODUCT_PROFESSIONAL_ID || "",
    monthlyPriceId: process.env.POLAR_PRICE_PROFESSIONAL_MONTHLY_ID || "",
    yearlyPriceId: process.env.POLAR_PRICE_PROFESSIONAL_YEARLY_ID || "",
  },
  ENTERPRISE: {
    productId: process.env.POLAR_PRODUCT_ENTERPRISE_ID || "",
    monthlyPriceId: process.env.POLAR_PRICE_ENTERPRISE_MONTHLY_ID || "",
    yearlyPriceId: process.env.POLAR_PRICE_ENTERPRISE_YEARLY_ID || "",
  },
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { plan, productId, priceId } = initiatePolarPaymentSchema.parse(body)

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

    if (plan === Subscription.FREE || plan === Subscription.ENTERPRISE) {
      return NextResponse.json(
        { error: "Cannot initiate payment for this plan via Polar" },
        { status: 400 }
      )
    }

    // Get Polar product/price IDs
    const polarMap = POLAR_PRODUCT_MAP[plan]
    const finalProductId = productId || polarMap.productId
    const finalPriceId = priceId || polarMap.monthlyPriceId

    if (!finalProductId || !finalPriceId) {
      return NextResponse.json(
        {
          error:
            "Polar product/price not configured. Please set up products in Polar dashboard.",
        },
        { status: 400 }
      )
    }

    // Initialize Polar
    const polar = initPolar()

    // Create checkout session
    const baseUrl =
      process.env.AUTH_URL ||
      process.env.NEXT_PUBLIC_APP_URL ||
      "http://localhost:3028"
    const successUrl = `${baseUrl}/dashboard/billing?payment=success&provider=polar`

    const checkout = await polar.createCheckoutSession({
      productId: finalProductId,
      priceId: finalPriceId,
      successUrl,
      customerEmail: user.email,
      metadata: {
        userId: user.id,
        plan: plan,
      },
    })

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        userId: user.id,
        amount: 0, // Will be updated from webhook
        currency: "ZAR",
        status: "PENDING",
        paymentMethod: "CARD", // Polar uses Stripe, which processes cards
        description: `${plan} Plan Subscription via Polar`,
        metadata: {
          provider: "polar",
          checkoutId: checkout.id,
          productId: finalProductId,
          priceId: finalPriceId,
          plan,
        },
      },
    })

    return NextResponse.json({
      checkoutUrl: checkout.url,
      checkoutId: checkout.id,
      paymentId: payment.id,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Initiate Polar payment error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    )
  }
}

