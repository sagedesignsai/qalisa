import {
  ChartAreaInteractive,
  DataTable,
  SectionCards,
} from "@/components/dashboard"

import data from "./data.json"

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <SectionCards data={data} />
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive data={data} />
      </div>

      <div className="px-4 lg:px-6">
        <DataTable data={data} />
      </div>
    </div>
  )
}
