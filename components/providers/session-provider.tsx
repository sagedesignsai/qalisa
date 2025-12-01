"use client"

import { ReactNode } from "react"
import { SessionProvider as NextAuthSessionProvider } from "next-auth/react"

/**
 * Session Provider
 * 
 * Wraps the application with NextAuth.js SessionProvider for authentication.
 * Provides session context to all child components.
 */
export function SessionProvider({ children }: { children: ReactNode }) {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>
}
