"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"

export interface SessionInfo {
  id: string
  isCurrent: boolean
  expires: Date
  device: string
  location: string
}

export function useSessions() {
  const [sessions, setSessions] = useState<SessionInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchSessions = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch("/api/account/sessions")
      if (!res.ok) {
        throw new Error("Failed to fetch sessions")
      }
      const data = await res.json()
      setSessions(data.sessions.map((s: any) => ({
        ...s,
        expires: new Date(s.expires),
      })))
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSessions()
  }, [fetchSessions])

  return { sessions, loading, error, refetch: fetchSessions }
}

export function useDeleteSession() {
  const [loading, setLoading] = useState(false)

  const deleteSession = useCallback(async (sessionId: string, onSuccess?: () => void) => {
    try {
      setLoading(true)
      const res = await fetch(`/api/account/sessions/${sessionId}`, {
        method: "DELETE",
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || "Failed to delete session")
      }

      toast.success("Session deleted successfully")
      onSuccess?.()
      return await res.json()
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to delete session")
      toast.error(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  return { deleteSession, loading }
}

