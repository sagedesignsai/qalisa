/**
 * Consolidated App Providers
 * 
 * This module exports all providers used in the application.
 * Use AppProviders for a single consolidated provider, or import
 * individual providers if needed.
 * 
 * Each provider is in its own module for better maintainability:
 * - session-provider.tsx - NextAuth.js authentication
 * - theme-provider.tsx - Theme management (next-themes)
 * - toast-provider.tsx - Toast notifications (Sonner)
 * - tooltip-provider.tsx - Global tooltip support (Radix UI)
 * - chat-provider.tsx - AI chat context
 * - app-providers.tsx - Consolidated wrapper
 */

// Consolidated provider (recommended)
export { AppProviders, type AppProvidersProps } from "./app-providers"

// Individual providers
export { SessionProvider } from "./session-provider"
export { ThemeProvider, type ThemeProviderProps } from "./theme-provider"
export { ToastProvider, type ToastProviderProps } from "./toast-provider"
export { TooltipProvider, type TooltipProviderProps } from "./tooltip-provider"
export { ChatProvider, useSharedChatContext } from "./chat-provider"
