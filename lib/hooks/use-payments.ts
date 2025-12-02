"use client"

import { useState, useCallback } from "react"
import { toast } from "sonner"

export interface Payment {
  id: string
  amount: number
  currency: string
  status: string
  paymentMethod: string
  description: string | null
  plan: string | null
  subscriptionStatus: string | null
  createdAt: Date
  updatedAt: Date
  transactions: Transaction[]
}

export interface Transaction {
  id: string
  type: string
  amount: number
  status: string
  description: string | null
  createdAt: Date
}

export function usePaymentHistory() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch("/api/payments/history")
      if (!res.ok) {
        throw new Error("Failed to fetch payment history")
      }
      const data = await res.json()
      setPayments(
        data.payments.map((p: any) => ({
          ...p,
          createdAt: new Date(p.createdAt),
          updatedAt: new Date(p.updatedAt),
          transactions: p.transactions.map((t: any) => ({
            ...t,
            createdAt: new Date(t.createdAt),
          })),
        }))
      )
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"))
    } finally {
      setLoading(false)
    }
  }, [])

  return { payments, loading, error, refetch: fetchPayments }
}

export function useInitiatePayment() {
  const [loading, setLoading] = useState(false)

  const initiatePayment = useCallback(
    async (plan: string, frequency: "monthly" | "yearly" = "monthly") => {
      try {
        setLoading(true)
        const res = await fetch("/api/payments/initiate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ plan, frequency }),
        })

        if (!res.ok) {
          const error = await res.json()
          throw new Error(error.error || "Failed to initiate payment")
        }

        // Get the HTML form and submit it
        const html = await res.text()
        const parser = new DOMParser()
        const doc = parser.parseFromString(html, "text/html")
        const form = doc.getElementById("payfast-form") as HTMLFormElement

        if (form) {
          // Create a temporary form and submit it
          const tempForm = document.createElement("form")
          tempForm.method = "POST"
          tempForm.action = form.action
          tempForm.style.display = "none"

          // Copy all input fields
          form.querySelectorAll("input").forEach((input) => {
            const newInput = document.createElement("input")
            newInput.type = "hidden"
            newInput.name = input.name
            newInput.value = input.value
            tempForm.appendChild(newInput)
          })

          document.body.appendChild(tempForm)
          tempForm.submit()
        } else {
          throw new Error("Failed to create payment form")
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

export function useCancelSubscription() {
  const [loading, setLoading] = useState(false)

  const cancelSubscription = useCallback(async (onSuccess?: () => void) => {
    try {
      setLoading(true)
      const res = await fetch("/api/subscriptions/cancel", {
        method: "POST",
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || "Failed to cancel subscription")
      }

      toast.success("Subscription will be cancelled at the end of the billing period")
      onSuccess?.()
      return await res.json()
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to cancel subscription")
      toast.error(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  return { cancelSubscription, loading }
}

export function useReactivateSubscription() {
  const [loading, setLoading] = useState(false)

  const reactivateSubscription = useCallback(async (onSuccess?: () => void) => {
    try {
      setLoading(true)
      const res = await fetch("/api/subscriptions/reactivate", {
        method: "POST",
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || "Failed to reactivate subscription")
      }

      toast.success("Subscription reactivated successfully")
      onSuccess?.()
      return await res.json()
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to reactivate subscription")
      toast.error(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  return { reactivateSubscription, loading }
}

