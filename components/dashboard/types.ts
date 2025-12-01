/**
 * Type definitions for dashboard data structures
 */

export type DashboardItemStatus = "Done" | "In Process"

export type DashboardItemType =
  | "Cover page"
  | "Table of contents"
  | "Narrative"
  | "Technical content"
  | "Plain language"
  | "Legal"
  | "Visual"
  | "Financial"
  | "Research"
  | "Planning"
  | string // Allow any string for flexibility

export interface DashboardItem {
  id: number
  header: string
  type: DashboardItemType
  status: DashboardItemStatus
  target: string
  limit: string
  reviewer: string
}

/**
 * Raw dashboard item from JSON (more flexible type)
 */
export interface RawDashboardItem {
  id: number
  header: string
  type: string
  status: string
  target: string
  limit: string
  reviewer: string
}

export interface DashboardStats {
  total: number
  done: number
  inProcess: number
  completionRate: number
}

export interface ChartDataPoint {
  name: string
  done: number
  inProcess: number
  total: number
}

