"use client";

// Importações originais dos seus componentes.
// Certifique-se de que a configuração de alias de caminho ('@/')
// esteja funcionando corretamente no seu ambiente de build.
import { BarChartCard } from "@/components/dashboard/BarChartCard";
import { FilterBar } from "@/components/dashboard/Filterbar";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { WelcomeBanner } from "@/components/dashboard/WelcomeBanner";

export default function DashboardPage() {
  return (
    <div className="flex flex-col md:flex-row gap-5 w-full text-zinc-500 *:border-zinc-200 p-4 md:p-6">
      <div className="w-full md:flex-1 flex flex-col gap-5">
        <WelcomeBanner />
        <FilterBar />
        <BarChartCard />
      </div>
      <div className="w-full md:w-auto flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-zinc-500 *:border-zinc-200">
          <StatsGrid />
          <RevenueChart />
        </div>
      </div>
    </div>
  );
}
