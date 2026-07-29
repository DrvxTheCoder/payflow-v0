import type { Metadata } from "next"
import { DashboardGrid } from "@/components/dashboard-grid"

export const metadata: Metadata = {
  title: "Payflow — Dashboard",
}

export default function Page() {
  return <DashboardGrid />
}
