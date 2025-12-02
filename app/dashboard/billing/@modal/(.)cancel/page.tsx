import { Suspense } from "react"
import { CancelSubscriptionModal } from "@/components/billing/cancel-subscription-modal"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

export default async function CancelSubscriptionPage() {
  const session = await auth()
  if (!session?.user?.id) {
    return null
  }

  // Fetch subscription data on the server
  const subscription = await prisma.userSubscription.findFirst({
    where: {
      userId: session.user.id,
      status: {
        in: ["ACTIVE", "PENDING"],
      },
    },
    select: {
      id: true,
      plan: true,
      status: true,
      currentPeriodStart: true,
      currentPeriodEnd: true,
      cancelAtPeriodEnd: true,
      createdAt: true,
    },
  })

  if (!subscription) {
    return null
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CancelSubscriptionModal
        subscription={{
          id: subscription.id,
          plan: subscription.plan,
          status: subscription.status,
          currentPeriodEnd: subscription.currentPeriodEnd,
          cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
        }}
      />
    </Suspense>
  )
}
