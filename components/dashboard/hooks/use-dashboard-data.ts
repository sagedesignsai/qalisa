"use client"

import { useMemo } from "react"
import { calculateStats } from "../utils/data-processing"
import type { DashboardItem, DashboardStats, RawDashboardItem } from "../types"

export interface UseDashboardDataOptions {
  data?: DashboardItem[] | RawDashboardItem[]
}

export interface UseDashboardDataReturn {
  stats: DashboardStats
  items: DashboardItem[]
}

/**
 * Hook to process and provide dashboard data and statistics
 */
export function useDashboardData(
  options: UseDashboardDataOptions = {}
): UseDashboardDataReturn {
  const { data } = options

  const stats = useMemo(() => {
    if (!data || data.length === 0) {
      // Return default stats if no data
      return {
        total: 0,
        done: 0,
        inProcess: 0,
        completionRate: 0,
      }
    }

    // Cast to DashboardItem[] for processing
    const items = data as DashboardItem[]
    return calculateStats(items)
  }, [data])

  const items = useMemo(() => {
    if (!data || data.length === 0) {
      return []
    }

    // Cast to DashboardItem[] for consistency
    return data as DashboardItem[]
  }, [data])

  return {
    stats,
    items,
  }
}
