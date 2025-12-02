"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"

export interface AccountConnection {
  id: string
  provider: string
  type: string
  providerAccountId: string
}

export function useConnections() {
  const [connections, setConnections] = useState<AccountConnection[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchConnections = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch("/api/account/connections")
      if (!res.ok) {
        throw new Error("Failed to fetch connections")
      }
      const data = await res.json()
      setConnections(data.accounts)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchConnections()
  }, [fetchConnections])

  return { connections, loading, error, refetch: fetchConnections }
}

export function useDeleteConnection() {
  const [loading, setLoading] = useState(false)

  const deleteConnection = useCallback(async (provider: string, onSuccess?: () => void) => {
    try {
      setLoading(true)
      const res = await fetch(`/api/account/connections/${provider}`, {
        method: "DELETE",
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || "Failed to disconnect account")
      }

      toast.success("Account disconnected successfully")
      onSuccess?.()
      return await res.json()
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to disconnect account")
      toast.error(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  return { deleteConnection, loading }
}

