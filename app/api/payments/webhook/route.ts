import { prisma } from "@/lib/db"
import { initPayFast, PayFastWebhookData } from "@/lib/payments/payfast"
import { NextResponse } from "next/server"
import { Subscription } from "@/lib/generated/prisma/enums"

export async function POST(req: Request) {
  try {
    const payfast = initPayFast()

    // PayFast sends data as form-urlencoded or form-data
    let formData: FormData
    try {
      formData = await req.formData()
    } catch {
      // Fallback: try parsing as URLSearchParams if formData fails
      const text = await req.text()
      const params = new URLSearchParams(text)
      formData = new FormData()
      params.forEach((value, key) => {
        formData.append(key, value)
      })
    }

    const webhookData: PayFastWebhookData = {
      m_payment_id: formData.get("m_payment_id") as string,
      pf_payment_id: formData.get("pf_payment_id") as string,
      payment_status: formData.get("payment_status") as string,
      item_name: formData.get("item_name") as string,
      amount_gross: formData.get("amount_gross") as string,
      amount_fee: formData.get("amount_fee") as string,
      amount_net: formData.get("amount_net") as string,
      custom_str1: formData.get("custom_str1") as string | undefined,
      custom_str2: formData.get("custom_str2") as string | undefined,
      custom_int1: formData.get("custom_int1") as string | undefined,
      signature: formData.get("signature") as string | undefined,
    }

    // Verify signature
    if (!payfast.verifySignature(webhookData)) {
      console.error("PayFast webhook signature verification failed")
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    // Find payment record
    const payment = await prisma.payment.findUnique({
      where: { id: webhookData.m_payment_id },
      include: {
        subscription: true,
        user: true,
      },
    })

    if (!payment) {
      console.error(`Payment not found: ${webhookData.m_payment_id}`)
      return NextResponse.json({ error: "Payment not found" }, { status: 404 })
    }

    // Create transaction record
    await prisma.transaction.create({
      data: {
        paymentId: payment.id,
        type: "payment",
        amount: parseFloat(webhookData.amount_gross) * 100, // Convert to cents
        currency: "ZAR",
        status: webhookData.payment_status.toLowerCase(),
        payfastData: webhookData as any,
        description: `PayFast payment: ${webhookData.pf_payment_id}`,
      },
    })

    // Handle different payment statuses
    switch (webhookData.payment_status) {
      case "COMPLETE":
        // Update payment status
        await prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: "COMPLETED",
            payfastPaymentId: webhookData.pf_payment_id,
          },
        })

        // Update subscription
        if (payment.subscription) {
          const billingDate = new Date()
          const plan = webhookData.custom_str2 as Subscription
          
          // Calculate next billing date based on frequency
          const metadata = payment.metadata as { frequency?: string } | null
          const frequency = metadata?.frequency || "monthly"
          
          if (frequency === "yearly") {
            billingDate.setFullYear(billingDate.getFullYear() + 1)
          } else {
            billingDate.setMonth(billingDate.getMonth() + 1)
          }

          await prisma.userSubscription.update({
            where: { id: payment.subscription.id },
            data: {
              status: "ACTIVE",
              currentPeriodStart: new Date(),
              currentPeriodEnd: billingDate,
            },
          })

          // Update user subscription
          await prisma.user.update({
            where: { id: payment.userId },
            data: {
              subscription: plan,
            },
          })
        }
        break

      case "FAILED":
        await prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: "FAILED",
            payfastPaymentId: webhookData.pf_payment_id,
          },
        })
        break

      case "CANCELLED":
        await prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: "CANCELLED",
            payfastPaymentId: webhookData.pf_payment_id,
          },
        })
        break

      case "PENDING":
        await prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: "PENDING",
            payfastPaymentId: webhookData.pf_payment_id,
          },
        })
        break
    }

    // Return success response to PayFast
    return NextResponse.json({ status: "ok" })
  } catch (error) {
    console.error("PayFast webhook error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// PayFast also sends GET requests for ITN (Instant Transaction Notification)
export async function GET(req: Request) {
  return POST(req)
}
