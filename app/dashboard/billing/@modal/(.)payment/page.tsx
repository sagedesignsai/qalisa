import { Suspense } from "react"
import { PaymentModal } from "@/components/billing/payment-modal"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { Subscription } from "@/lib/generated/prisma/enums"

interface PaymentPageProps {
  searchParams: Promise<{
    plan?: string
    frequency?: string
    provider?: string
  }>
}

export default async function PaymentPage({ searchParams }: PaymentPageProps) {
  const session = await auth()
  if (!session?.user?.id) {
    return null
  }

  const params = await searchParams
  const plan = (params.plan as Subscription) || Subscription.STARTER
  const frequency = (params.frequency as "monthly" | "yearly") || "monthly"
  const provider = (params.provider as "payfast" | "polar") || "payfast"

  // Fetch user data on the server
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      email: true,
      name: true,
      subscription: true,
    },
  })

  if (!user) {
    return null
  }

  // Validate plan
  if (plan === Subscription.FREE || plan === Subscription.ENTERPRISE) {
    return null
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentModal
        user={{
          id: user.id,
          email: user.email,
          name: user.name,
        }}
        plan={plan}
        frequency={frequency}
        provider={provider}
        currentSubscription={user.subscription}
      />
    </Suspense>
  )
}
