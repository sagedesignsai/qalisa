/**
 * Utility components and functions for DataTable
 */

import { Badge } from "@/components/ui/badge"
import { getStatusVariant } from "../utils/data-processing"
import type { DashboardItem } from "../types"

/**
 * Render status badge
 */
export function StatusBadge({ status }: { status: DashboardItem["status"] }) {
  return (
    <Badge variant={getStatusVariant(status)} className="whitespace-nowrap">
      {status}
    </Badge>
  )
}

/**
 * Table column definitions
 */
export interface TableColumn<T = DashboardItem> {
  key: keyof T | string
  header: string
  cell?: (item: T) => React.ReactNode
  sortable?: boolean
  className?: string
}

/**
 * Default column definitions for dashboard table
 */
export const defaultColumns: TableColumn<DashboardItem>[] = [
  {
    key: "id",
    header: "ID",
    sortable: true,
    className: "w-[80px]",
  },
  {
    key: "header",
    header: "Header",
    sortable: true,
    className: "min-w-[200px]",
  },
  {
    key: "type",
    header: "Type",
    sortable: true,
    className: "min-w-[150px]",
  },
  {
    key: "status",
    header: "Status",
    sortable: true,
    cell: (item) => <StatusBadge status={item.status} />,
    className: "w-[120px]",
  },
  {
    key: "target",
    header: "Target",
    sortable: true,
    className: "w-[100px] text-right",
  },
  {
    key: "limit",
    header: "Limit",
    sortable: true,
    className: "w-[100px] text-right",
  },
  {
    key: "reviewer",
    header: "Reviewer",
    sortable: true,
    className: "min-w-[150px]",
  },
]

/**
 * Sort items by column
 */
export function sortItems<T>(
  items: T[],
  column: keyof T | string,
  direction: "asc" | "desc"
): T[] {
  return [...items].sort((a, b) => {
    const aValue = a[column as keyof T]
    const bValue = b[column as keyof T]

    // Handle string comparison
    if (typeof aValue === "string" && typeof bValue === "string") {
      return direction === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue)
    }

    // Handle number comparison
    if (typeof aValue === "number" && typeof bValue === "number") {
      return direction === "asc" ? aValue - bValue : bValue - aValue
    }

    // Handle string numbers (like "18", "5")
    const aNum = typeof aValue === "string" ? parseInt(aValue, 10) : 0
    const bNum = typeof bValue === "string" ? parseInt(bValue, 10) : 0

    if (!isNaN(aNum) && !isNaN(bNum)) {
      return direction === "asc" ? aNum - bNum : bNum - aNum
    }

    return 0
  })
}

