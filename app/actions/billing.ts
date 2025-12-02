"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { Subscription } from "@/lib/generated/prisma/enums"

export async function cancelSubscription() {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  const subscription = await prisma.userSubscription.findFirst({
    where: {
      userId: session.user.id,
      status: "ACTIVE",
    },
  })

  if (!subscription) {
    throw new Error("No active subscription found")
  }

  await prisma.userSubscription.update({
    where: { id: subscription.id },
    data: {
      cancelAtPeriodEnd: true,
      cancelledAt: new Date(),
    },
  })

  revalidatePath("/dashboard/billing")
  redirect("/dashboard/billing?cancelled=true")
}

export async function reactivateSubscription() {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  const subscription = await prisma.userSubscription.findFirst({
    where: {
      userId: session.user.id,
      cancelAtPeriodEnd: true,
    },
  })

  if (!subscription) {
    throw new Error("No cancelled subscription found")
  }

  await prisma.userSubscription.update({
    where: { id: subscription.id },
    data: {
      cancelAtPeriodEnd: false,
      cancelledAt: null,
      status: "ACTIVE",
    },
  })

  revalidatePath("/dashboard/billing")
  redirect("/dashboard/billing?reactivated=true")
}

export async function updateSubscriptionPlan(plan: Subscription) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  if (plan === Subscription.FREE || plan === Subscription.ENTERPRISE) {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { subscription: plan },
    })
    revalidatePath("/dashboard/billing")
    redirect("/dashboard/billing?updated=true")
  }

  // For paid plans, redirect to payment
  redirect(`/dashboard/billing/payment?plan=${plan}`)
}

