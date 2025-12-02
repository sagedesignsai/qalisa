import {
  ChartAreaInteractive,
  DataTable,
  SectionCards,
} from "@/components/dashboard"

import data from "./data.json"

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <SectionCards data={data} />
      <ChartAreaInteractive data={data} />
      <DataTable data={data} />
    </div>
  )
}
