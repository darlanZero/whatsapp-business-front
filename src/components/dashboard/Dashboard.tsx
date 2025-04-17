"use client"

import { BarChartCard } from "./BarChartCard";
import { FilterBar } from "./Filterbar";
import { RevenueChart } from "./RevenueChart";
import { StatsGrid } from "./StatsGrid";

export const Dashboard = () => {
  return (
    <div className="flex gap-5 w-full text-zinc-500 *:border-zinc-200">
      <div className="flex-1 w-full flex flex-col">
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
};
