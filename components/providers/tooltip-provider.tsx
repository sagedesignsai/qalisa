"use client"

import { ReactNode } from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

/**
 * Tooltip Provider Props
 */
export interface TooltipProviderProps {
  children: ReactNode
  delayDuration?: number
  skipDelayDuration?: number
}

/**
 * Global Tooltip Provider
 * 
 * Provides tooltip context for the entire application using Radix UI.
 * Individual components can still use their own TooltipProvider if needed,
 * but this ensures tooltips work globally without requiring per-component setup.
 */
export function TooltipProvider({
  children,
  delayDuration = 0,
  skipDelayDuration = 0,
}: TooltipProviderProps) {
  return (
    <TooltipPrimitive.Provider
      delayDuration={delayDuration}
      skipDelayDuration={skipDelayDuration}
    >
      {children}
    </TooltipPrimitive.Provider>
  )
}

