"use client"

import { useState, useCallback } from "react"
import { toast } from "sonner"
import { Subscription } from "@/lib/generated/prisma/enums"

export function useInitiatePolarPayment() {
  const [loading, setLoading] = useState(false)

  const initiatePayment = useCallback(
    async (
      plan: Subscription,
      productId?: string,
      priceId?: string
    ) => {
      try {
        setLoading(true)
        const res = await fetch("/api/payments/polar/initiate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ plan, productId, priceId }),
        })

        if (!res.ok) {
          const error = await res.json()
          throw new Error(error.error || "Failed to initiate payment")
        }

        const data = await res.json()

        // Redirect to Polar checkout
        if (data.checkoutUrl) {
          window.location.href = data.checkoutUrl
        } else {
          throw new Error("No checkout URL received")
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Failed to initiate payment")
        toast.error(error.message)
        throw error
      } finally {
        setLoading(false)
      }
    },
    []
  )

  return { initiatePayment, loading }
}

