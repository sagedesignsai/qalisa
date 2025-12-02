import { prisma } from "@/lib/db"
import { initPolar } from "@/lib/payments/polar"
import { NextResponse } from "next/server"
import { Subscription } from "@/lib/generated/prisma/enums"

export async function POST(req: Request) {
  try {
    const polar = initPolar()

    // Get webhook signature from headers
    // Polar sends signature in x-polar-signature header
    const signature = req.headers.get("x-polar-signature") || req.headers.get("polar-signature")
    const webhookSecret = process.env.POLAR_WEBHOOK_SECRET

    if (!signature || !webhookSecret) {
      console.error("Missing Polar webhook signature or secret")
      // In development, allow webhooks without signature for testing
      if (process.env.NODE_ENV === "development" && process.env.POLAR_SANDBOX === "true") {
        console.warn("Allowing webhook without signature in development mode")
      } else {
        return NextResponse.json(
          { error: "Missing signature" },
          { status: 400 }
        )
      }
    }

    // Get raw body for signature verification
    const rawBody = await req.text()

    // Verify webhook signature if available
    if (signature && webhookSecret) {
      if (!polar.verifyWebhookSignature(rawBody, signature, webhookSecret)) {
        console.error("Polar webhook signature verification failed")
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
      }
    }

    // Parse webhook event
    const event = JSON.parse(rawBody)

    console.log("Polar webhook event:", event.type, event.id)

    // Handle different event types
    switch (event.type) {
      case "checkout.succeeded":
        await handleCheckoutSucceeded(event.data)
        break

      case "subscription.created":
      case "subscription.updated":
        await handleSubscriptionUpdate(event.data)
        break

      case "subscription.canceled":
        await handleSubscriptionCanceled(event.data)
        break

      default:
        console.log(`Unhandled Polar webhook event: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Polar webhook error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

async function handleCheckoutSucceeded(data: any) {
  const checkoutId = data.id
  const customerId = data.customer_id
  const productId = data.product_id
  const priceId = data.price_id
  const amount = data.amount_total
  const currency = data.currency || "ZAR"
  const metadata = data.metadata || {}

  // Find payment by checkout ID
  const payment = await prisma.payment.findFirst({
    where: {
      metadata: {
        path: ["checkoutId"],
        equals: checkoutId,
      },
    },
    include: {
      user: true,
    },
  })

  if (!payment) {
    console.error(`Payment not found for checkout: ${checkoutId}`)
    return
  }

  // Update payment
  await prisma.payment.update({
    where: { id: payment.id },
    data: {
      amount: amount,
      currency: currency,
      status: "COMPLETED",
      payfastPaymentId: checkoutId, // Reusing field for Polar checkout ID
      metadata: {
        ...(payment.metadata as any),
        polarCheckoutId: checkoutId,
        polarCustomerId: customerId,
      },
    },
  })

  // Create transaction
  await prisma.transaction.create({
    data: {
      paymentId: payment.id,
      type: "payment",
      amount: amount,
      currency: currency,
      status: "success",
      payfastData: data,
      description: `Polar checkout: ${checkoutId}`,
    },
  })

  // Update user subscription if plan is in metadata
  if (metadata.plan) {
    const plan = metadata.plan as Subscription

    // Find or create subscription
    let subscription = await prisma.userSubscription.findFirst({
      where: {
        userId: payment.userId,
        plan: plan,
      },
    })

    if (!subscription) {
      subscription = await prisma.userSubscription.create({
        data: {
          userId: payment.userId,
          plan: plan,
          status: "ACTIVE",
          payfastToken: checkoutId, // Reusing field
          payfastProfileId: customerId, // Reusing field
        },
      })
    } else {
      await prisma.userSubscription.update({
        where: { id: subscription.id },
        data: {
          status: "ACTIVE",
          payfastToken: checkoutId,
          payfastProfileId: customerId,
        },
      })
    }

    // Update user subscription field
    await prisma.user.update({
      where: { id: payment.userId },
      data: {
        subscription: plan,
      },
    })
  }
}

async function handleSubscriptionUpdate(data: any) {
  const subscriptionId = data.id
  const customerId = data.customer_id
  const status = data.status

  // Find subscription by Polar customer ID
  const subscription = await prisma.userSubscription.findFirst({
    where: {
      payfastProfileId: customerId, // Reusing field for Polar customer ID
    },
  })

  if (!subscription) {
    console.error(`Subscription not found for customer: ${customerId}`)
    return
  }

  // Map Polar status to our status
  const statusMap: Record<string, string> = {
    active: "ACTIVE",
    canceled: "CANCELLED",
    past_due: "SUSPENDED",
    trialing: "ACTIVE",
  }

  await prisma.userSubscription.update({
    where: { id: subscription.id },
    data: {
      status: (statusMap[status] || "PENDING") as any,
      currentPeriodStart: data.current_period_start
        ? new Date(data.current_period_start * 1000)
        : null,
      currentPeriodEnd: data.current_period_end
        ? new Date(data.current_period_end * 1000)
        : null,
      cancelAtPeriodEnd: data.cancel_at_period_end || false,
      cancelledAt: data.canceled_at
        ? new Date(data.canceled_at * 1000)
        : null,
    },
  })
}

async function handleSubscriptionCanceled(data: any) {
  const customerId = data.customer_id

  const subscription = await prisma.userSubscription.findFirst({
    where: {
      payfastProfileId: customerId,
    },
  })

  if (subscription) {
    await prisma.userSubscription.update({
      where: { id: subscription.id },
      data: {
        status: "CANCELLED",
        cancelAtPeriodEnd: true,
        cancelledAt: new Date(),
      },
    })
  }
}

