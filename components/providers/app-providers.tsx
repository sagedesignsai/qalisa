"use client"

import { ReactNode } from "react"
import NextTopLoader from "nextjs-toploader"
import { useTheme } from "next-themes"
import { ErrorBoundary } from "@/components/error-boundary"
import { SessionProvider } from "./session-provider"
import { ThemeProvider } from "./theme-provider"
import { ToastProvider } from "./toast-provider"
import { TooltipProvider } from "./tooltip-provider"
import { ChatProvider } from "./chat-provider"

/**
 * Top Loader Configuration Options
 */
export interface TopLoaderConfig {
  /**
   * Show the top loader
   * @default true
   */
  show?: boolean
  /**
   * Color of the loader bar
   * @default Uses theme-aware primary color
   */
  color?: string
  /**
   * Height of the loader bar in pixels
   * @default 3
   */
  height?: number
  /**
   * Show spinner at the end of the loader
   * @default true
   */
  showSpinner?: boolean
  /**
   * Enable crawling animation
   * @default true
   */
  crawl?: boolean
  /**
   * Crawl speed in milliseconds
   * @default 200
   */
  crawlSpeed?: number
  /**
   * Animation speed in milliseconds
   * @default 200
   */
  speed?: number
  /**
   * Initial position (0-1)
   * @default 0.08
   */
  initialPosition?: number
  /**
   * Easing function
   * @default "ease"
   */
  easing?: string
  /**
   * Shadow effect
   * @default Theme-aware shadow
   */
  shadow?: string
  /**
   * Z-index of the loader
   * @default 1600
   */
  zIndex?: number
  /**
   * Show loader at bottom instead of top
   * @default false
   */
  showAtBottom?: boolean
}

/**
 * App Providers Props
 */
export interface AppProvidersProps {
  children: ReactNode
  /**
   * Theme provider props
   */
  theme?: {
    attribute?: string
    defaultTheme?: string
    enableSystem?: boolean
    disableTransitionOnChange?: boolean
  }
  /**
   * Toast provider props
   */
  toast?: {
    position?: "top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right"
    richColors?: boolean
  }
  /**
   * Error boundary props
   */
  errorBoundary?: {
    fallback?: React.ComponentType<{
      error: Error
      errorInfo: React.ErrorInfo | null
      resetError: () => void
    }>
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void
  }
  /**
   * Top loader configuration
   */
  topLoader?: TopLoaderConfig
  /**
   * Tooltip provider props
   */
  tooltip?: {
    delayDuration?: number
    skipDelayDuration?: number
  }
}

/**
 * Top Loader Component (Theme-Aware)
 * 
 * Wraps NextTopLoader with theme-aware configuration.
 * Automatically adapts to light/dark theme changes.
 */
function TopLoader({ config }: { config: TopLoaderConfig }) {
  const { resolvedTheme } = useTheme()
  
  // Theme-aware default colors based on your design system
  // Light theme: primary color (cyan-blue)
  // Dark theme: primary color (green)
  // Default to light theme during SSR/hydration
  const isDark = resolvedTheme === "dark"
  const defaultColor = config.color || (isDark ? "#4ade80" : "#2299DD")
  const defaultShadow = config.shadow || (
    isDark
      ? "0 0 10px #4ade80,0 0 5px #4ade80"
      : "0 0 10px #2299DD,0 0 5px #2299DD"
  )

  return (
    <NextTopLoader
      color={defaultColor}
      height={config.height ?? 3}
      showSpinner={config.showSpinner ?? true}
      crawl={config.crawl ?? true}
      crawlSpeed={config.crawlSpeed ?? 200}
      speed={config.speed ?? 200}
      initialPosition={config.initialPosition ?? 0.08}
      easing={config.easing ?? "ease"}
      shadow={defaultShadow}
      zIndex={config.zIndex ?? 1600}
      showAtBottom={config.showAtBottom ?? false}
    />
  )
}

/**
 * Consolidated App Providers
 * 
 * Wraps the application with all necessary providers in the correct order:
 * 1. ThemeProvider (outermost - needed for theme context)
 * 2. ErrorBoundary (catches errors)
 * 3. TooltipProvider (global tooltip support)
 * 4. SessionProvider (authentication)
 * 5. ChatProvider (AI chat context)
 * 6. ToastProvider (notifications)
 * 7. NextTopLoader (page transition indicator)
 * 
 * Each provider is imported from its own module for better maintainability.
 */
export function AppProviders({
  children,
  theme = {},
  toast = {},
  errorBoundary = {},
  tooltip = {},
  topLoader = {},
}: AppProvidersProps) {
  const showTopLoader = topLoader.show !== false // Default to true

  return (
    <ThemeProvider
      attribute={theme.attribute}
      defaultTheme={theme.defaultTheme}
      enableSystem={theme.enableSystem}
      disableTransitionOnChange={theme.disableTransitionOnChange}
    >
      <ErrorBoundary
        fallback={errorBoundary.fallback}
        onError={errorBoundary.onError}
      >
        <TooltipProvider
          delayDuration={tooltip.delayDuration}
          skipDelayDuration={tooltip.skipDelayDuration}
        >
          <SessionProvider>
            <ChatProvider>
              {showTopLoader && <TopLoader config={topLoader} />}
              {children}
              <ToastProvider
                position={toast.position}
                richColors={toast.richColors}
              />
            </ChatProvider>
          </SessionProvider>
        </TooltipProvider>
      </ErrorBoundary>
    </ThemeProvider>
  )
}
