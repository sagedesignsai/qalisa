"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"

export interface User {
  id: string
  name: string | null
  email: string
  emailVerified: Date | null
  image: string | null
  language: string
  subscription: string
  hasPassword: boolean
  createdAt: Date
  updatedAt: Date
}

export interface UpdateAccountData {
  name?: string
  email?: string
  language?: string
  image?: string | null
}

export function useAccount() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchAccount = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch("/api/account")
      if (!res.ok) {
        throw new Error("Failed to fetch account")
      }
      const data = await res.json()
      setUser(data.user)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAccount()
  }, [fetchAccount])

  return { user, loading, error, refetch: fetchAccount }
}

export function useUpdateAccount() {
  const [loading, setLoading] = useState(false)

  const updateAccount = useCallback(async (data: UpdateAccountData) => {
    try {
      setLoading(true)
      const res = await fetch("/api/account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || "Failed to update account")
      }

      toast.success("Account updated successfully")
      return await res.json()
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to update account")
      toast.error(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  return { updateAccount, loading }
}

export function useUpdatePassword() {
  const [loading, setLoading] = useState(false)

  const updatePassword = useCallback(async (data: {
    currentPassword: string
    newPassword: string
  }) => {
    try {
      setLoading(true)
      const res = await fetch("/api/account/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || "Failed to update password")
      }

      toast.success("Password updated successfully")
      return await res.json()
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to update password")
      toast.error(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  return { updatePassword, loading }
}

