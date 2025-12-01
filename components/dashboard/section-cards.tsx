"use client"

import * as React from "react"
import {
  IconCheck,
  IconClock,
  IconProgress,
  IconTrendingUp,
} from "@tabler/icons-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useDashboardData } from "./hooks/use-dashboard-data"
import type { DashboardItem, RawDashboardItem } from "./types"

export interface SectionCardsProps {
  /**
   * Optional className for the container
   */
  className?: string

  /**
   * Dashboard items data (accepts both typed and raw data)
   */
  data?: DashboardItem[] | RawDashboardItem[]
}

/**
 * SectionCards displays key statistics about dashboard items in a card grid layout.
 * 
 * Shows:
 * - Total items
 * - Completed items
 * - In Progress items
 * - Completion rate
 */
export function SectionCards({ className, data }: SectionCardsProps) {
  const { stats } = useDashboardData({ data })

  const cards = [
    {
      title: "Total Items",
      value: stats.total.toLocaleString(),
      description: "All dashboard items",
      icon: IconTrendingUp,
      className: "text-blue-600 dark:text-blue-400",
    },
    {
      title: "Completed",
      value: stats.done.toLocaleString(),
      description: "Items marked as done",
      icon: IconCheck,
      className: "text-green-600 dark:text-green-400",
    },
    {
      title: "In Progress",
      value: stats.inProcess.toLocaleString(),
      description: "Items currently in process",
      icon: IconClock,
      className: "text-orange-600 dark:text-orange-400",
    },
    {
      title: "Completion Rate",
      value: `${stats.completionRate}%`,
      description: "Percentage completed",
      icon: IconProgress,
      className: "text-purple-600 dark:text-purple-400",
    },
  ]

  return (
    <div
      className={`grid gap-4 px-4 md:grid-cols-2 lg:grid-cols-4 lg:px-6 ${className || ""}`}
    >
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${card.className}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <CardDescription className="mt-1">{card.description}</CardDescription>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

