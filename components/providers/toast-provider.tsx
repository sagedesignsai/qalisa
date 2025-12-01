"use client"

import { Toaster } from "@/components/ui/sonner"

/**
 * Toast Provider Props
 */
export interface ToastProviderProps {
  position?: "top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right"
  richColors?: boolean
}

/**
 * Toast Provider
 * 
 * Provides toast notifications using Sonner.
 * This is a render-only component that renders the Toaster component.
 */
export function ToastProvider({
  position = "bottom-right",
  richColors = true,
}: ToastProviderProps) {
  return <Toaster position={position} richColors={richColors} />
}

