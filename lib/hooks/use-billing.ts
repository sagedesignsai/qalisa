"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import { Subscription } from "@/lib/generated/prisma/enums"

export interface BillingInfo {
  subscription: Subscription
  createdAt: Date
  activeSubscription?: {
    id: string
    plan: Subscription
    status: string
    currentPeriodStart: Date | null
    currentPeriodEnd: Date | null
    cancelAtPeriodEnd: boolean
    cancelledAt: Date | null
    createdAt: Date
  } | null
}

export function useBilling() {
  const [billing, setBilling] = useState<BillingInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchBilling = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch("/api/billing")
      if (!res.ok) {
        throw new Error("Failed to fetch billing info")
      }
      const data = await res.json()
      setBilling({
        subscription: data.subscription as Subscription,
        createdAt: new Date(data.createdAt),
        activeSubscription: data.activeSubscription
          ? {
              ...data.activeSubscription,
              currentPeriodStart: data.activeSubscription.currentPeriodStart
                ? new Date(data.activeSubscription.currentPeriodStart)
                : null,
              currentPeriodEnd: data.activeSubscription.currentPeriodEnd
                ? new Date(data.activeSubscription.currentPeriodEnd)
                : null,
              cancelledAt: data.activeSubscription.cancelledAt
                ? new Date(data.activeSubscription.cancelledAt)
                : null,
              createdAt: new Date(data.activeSubscription.createdAt),
            }
          : null,
      })
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchBilling()
  }, [fetchBilling])

  return { billing, loading, error, refetch: fetchBilling }
}

export function useUpdateSubscription() {
  const [loading, setLoading] = useState(false)

  const updateSubscription = useCallback(async (subscription: Subscription, onSuccess?: () => void) => {
    try {
      setLoading(true)
      const res = await fetch("/api/billing", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscription }),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || "Failed to update subscription")
      }

      toast.success("Subscription updated successfully")
      onSuccess?.()
      return await res.json()
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to update subscription")
      toast.error(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  return { updateSubscription, loading }
}

