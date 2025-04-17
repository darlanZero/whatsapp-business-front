"use client";

import { BarChartCard } from "@/components/dashboard/BarChartCard";
import { FilterBar } from "@/components/dashboard/Filterbar";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { WelcomeBanner } from "@/components/dashboard/WelcomeBanner";

export default function DashboardPage() {
  return (
    <div className="flex gap-5 w-full text-zinc-500 *:border-zinc-200">
      <div className="flex-1 w-full flex flex-col">
        <WelcomeBanner />
        <FilterBar />
        <BarChartCard />
      </div>
      <div className="flex flex-col">
        <div className="grid grid-cols-2 gap-6 text-zinc-500 *:border-zinc-200">
          <StatsGrid />
          <RevenueChart />
        </div>
      </div>
    </div>
  );
}
