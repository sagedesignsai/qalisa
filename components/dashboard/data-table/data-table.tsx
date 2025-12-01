"use client"

import * as React from "react"
import {
  ChevronDown,
  ChevronUp,
  Search,
  ArrowUpDown,
} from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  defaultColumns,
  sortItems,
  type TableColumn,
} from "./utils"
import type { DashboardItem, RawDashboardItem } from "../types"

export interface DataTableProps {
  /**
   * Table data (accepts both typed and raw data)
   */
  data: DashboardItem[] | RawDashboardItem[]

  /**
   * Optional className for the container
   */
  className?: string

  /**
   * Table title
   */
  title?: string

  /**
   * Table description
   */
  description?: string

  /**
   * Custom columns. If not provided, uses default columns
   */
  columns?: TableColumn<DashboardItem>[]

  /**
   * Enable search functionality
   */
  enableSearch?: boolean

  /**
   * Enable sorting
   */
  enableSorting?: boolean

  /**
   * Items per page (0 = show all)
   */
  itemsPerPage?: number
}

type SortState = {
  column: keyof DashboardItem | string
  direction: "asc" | "desc"
} | null

/**
 * DataTable displays dashboard items in a sortable, searchable table.
 * 
 * Features:
 * - Column sorting
 * - Search/filter
 * - Pagination
 * - Customizable columns
 */
export function DataTable({
  data,
  className,
  title = "Dashboard Items",
  description = "Manage and view all dashboard items",
  columns = defaultColumns,
  enableSearch = true,
  enableSorting = true,
  itemsPerPage = 10,
}: DataTableProps) {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [sortState, setSortState] = React.useState<SortState>(null)
  const [currentPage, setCurrentPage] = React.useState(1)

  // Filter data based on search query
  const filteredData = React.useMemo(() => {
    if (!searchQuery.trim()) {
      return data
    }

    const query = searchQuery.toLowerCase()
    return data.filter((item) => {
      return (
        item.header.toLowerCase().includes(query) ||
        item.type.toLowerCase().includes(query) ||
        item.status.toLowerCase().includes(query) ||
        item.reviewer.toLowerCase().includes(query) ||
        item.id.toString().includes(query)
      )
    })
  }, [data, searchQuery])

  // Sort data
  const sortedData = React.useMemo(() => {
    if (!sortState || !enableSorting) {
      return filteredData
    }

    return sortItems(filteredData, sortState.column, sortState.direction)
  }, [filteredData, sortState, enableSorting])

  // Paginate data
  const paginatedData = React.useMemo(() => {
    if (itemsPerPage === 0) {
      return sortedData
    }

    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return sortedData.slice(startIndex, endIndex)
  }, [sortedData, currentPage, itemsPerPage])

  const totalPages = React.useMemo(() => {
    if (itemsPerPage === 0) return 1
    return Math.ceil(sortedData.length / itemsPerPage)
  }, [sortedData.length, itemsPerPage])

  // Handle column sort
  const handleSort = (column: keyof DashboardItem | string) => {
    if (!enableSorting) return

    const columnDef = columns.find((col) => col.key === column)
    if (!columnDef?.sortable) return

    setSortState((prev) => {
      if (prev?.column === column) {
        // Toggle direction
        return {
          column,
          direction: prev.direction === "asc" ? "desc" : "asc",
        }
      }
      // New column, default to ascending
      return { column, direction: "asc" }
    })
    setCurrentPage(1) // Reset to first page on sort
  }

  // Reset page when search changes
  React.useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  const getSortIcon = (column: keyof DashboardItem | string) => {
    if (!enableSorting) return null

    const columnDef = columns.find((col) => col.key === column)
    if (!columnDef?.sortable) return null

    if (sortState?.column === column) {
      return sortState.direction === "asc" ? (
        <ChevronUp className="ml-1 h-4 w-4" />
      ) : (
        <ChevronDown className="ml-1 h-4 w-4" />
      )
    }

    return <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>
              {description} ({filteredData.length} items)
            </CardDescription>
          </div>
          {enableSearch && (
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead
                    key={String(column.key)}
                    className={column.className}
                  >
                    {column.sortable && enableSorting ? (
                      <button
                        onClick={() => handleSort(column.key)}
                        className="flex items-center hover:text-foreground transition-colors"
                      >
                        {column.header}
                        {getSortIcon(column.key)}
                      </button>
                    ) : (
                      column.header
                    )}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No items found.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((item) => (
                  <TableRow key={item.id}>
                    {columns.map((column) => (
                      <TableCell
                        key={String(column.key)}
                        className={column.className}
                      >
                        {column.cell
                          ? column.cell(item)
                          : String(item[column.key as keyof DashboardItem] ?? "")}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {itemsPerPage > 0 && totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, sortedData.length)} of{" "}
              {sortedData.length} items
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <div className="flex items-center gap-1 text-sm">
                Page {currentPage} of {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

