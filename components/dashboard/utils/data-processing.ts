/**
 * Data processing utilities for dashboard components
 */

import type {
  DashboardItem,
  DashboardStats,
  ChartDataPoint,
  DashboardItemType,
} from "../types"

/**
 * Calculate dashboard statistics from items
 */
export function calculateStats(items: DashboardItem[]): DashboardStats {
  const total = items.length
  const done = items.filter((item) => item.status === "Done").length
  const inProcess = items.filter((item) => item.status === "In Process").length
  const completionRate = total > 0 ? Math.round((done / total) * 100) : 0

  return {
    total,
    done,
    inProcess,
    completionRate,
  }
}

/**
 * Group items by type and calculate statistics
 */
export function groupByType(
  items: DashboardItem[]
): Map<DashboardItemType, DashboardItem[]> {
  const grouped = new Map<DashboardItemType, DashboardItem[]>()

  for (const item of items) {
    const existing = grouped.get(item.type) || []
    grouped.set(item.type, [...existing, item])
  }

  return grouped
}

/**
 * Prepare chart data grouped by type
 */
export function prepareChartDataByType(
  items: DashboardItem[]
): ChartDataPoint[] {
  const grouped = groupByType(items)
  const chartData: ChartDataPoint[] = []

  grouped.forEach((groupItems, type) => {
    const done = groupItems.filter((item) => item.status === "Done").length
    const inProcess = groupItems.filter(
      (item) => item.status === "In Process"
    ).length

    chartData.push({
      name: type,
      done,
      inProcess,
      total: groupItems.length,
    })
  })

  return chartData.sort((a, b) => b.total - a.total)
}

/**
 * Prepare chart data for progress over time (simulated monthly data)
 */
export function prepareProgressChartData(
  items: DashboardItem[]
): ChartDataPoint[] {
  // Simulate monthly progress for demonstration
  // In a real app, you'd use actual dates from the data
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ]

  const itemsPerMonth = Math.ceil(items.length / 12)
  const chartData: ChartDataPoint[] = []

  months.forEach((month, index) => {
    const startIndex = index * itemsPerMonth
    const endIndex = Math.min(startIndex + itemsPerMonth, items.length)
    const monthItems = items.slice(startIndex, endIndex)

    const done = monthItems.filter((item) => item.status === "Done").length
    const inProcess = monthItems.filter(
      (item) => item.status === "In Process"
    ).length

    chartData.push({
      name: month,
      done,
      inProcess,
      total: monthItems.length,
    })
  })

  return chartData
}

/**
 * Convert string numbers to actual numbers safely
 */
export function parseNumber(value: string | number): number {
  if (typeof value === "number") return value
  const parsed = parseInt(value, 10)
  return isNaN(parsed) ? 0 : parsed
}

/**
 * Get status badge variant
 */
export function getStatusVariant(
  status: DashboardItem["status"]
): "default" | "secondary" | "outline" {
  switch (status) {
    case "Done":
      return "default"
    case "In Process":
      return "secondary"
    default:
      return "outline"
  }
}

