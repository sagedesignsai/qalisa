"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  prepareChartDataByType,
  prepareProgressChartData,
} from "./utils/data-processing"
import type { DashboardItem, ChartDataPoint, RawDashboardItem } from "./types"

export interface ChartAreaInteractiveProps {
  /**
   * Optional className for the container
   */
  className?: string

  /**
   * Chart data source (accepts both typed and raw data)
   */
  data?: DashboardItem[] | RawDashboardItem[]

  /**
   * Chart mode - by type or progress over time
   */
  mode?: "type" | "progress"

  /**
   * Chart title
   */
  title?: string

  /**
   * Chart description
   */
  description?: string
}

const chartConfig = {
  done: {
    label: "Done",
    color: "hsl(var(--chart-1))",
  },
  inProcess: {
    label: "In Process",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

/**
 * ChartAreaInteractive displays an interactive area chart showing dashboard statistics.
 * 
 * Can display data grouped by type or progress over time.
 */
export function ChartAreaInteractive({
  className,
  data = [],
  mode = "type",
  title = "Progress Overview",
  description = "Track your progress over time",
}: ChartAreaInteractiveProps) {
  const chartData = React.useMemo<ChartDataPoint[]>(() => {
    if (!data || data.length === 0) {
      return []
    }

    // Cast to DashboardItem[] for processing
    const items = data as DashboardItem[]

    if (mode === "type") {
      return prepareChartDataByType(items)
    }

    return prepareProgressChartData(items)
  }, [data, mode])

  // Limit to top 10 items for readability
  const displayData = React.useMemo(() => {
    return chartData.slice(0, 10)
  }, [chartData])

  if (displayData.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-[300px] items-center justify-center text-muted-foreground">
            No data available
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <AreaChart
            data={displayData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              className="text-xs"
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="dot"
                  labelFormatter={(value, payload) => {
                    const item = payload?.[0]?.payload as ChartDataPoint
                    if (!item) return String(value)
                    return `${value} (Total: ${item.total})`
                  }}
                />
              }
            />
            <Area
              type="monotone"
              dataKey="done"
              stackId="1"
              stroke={chartConfig.done.color}
              fill={chartConfig.done.color}
              fillOpacity={0.6}
            />
            <Area
              type="monotone"
              dataKey="inProcess"
              stackId="1"
              stroke={chartConfig.inProcess.color}
              fill={chartConfig.inProcess.color}
              fillOpacity={0.6}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

