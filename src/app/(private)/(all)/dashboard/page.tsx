"use client";

import { useContext } from "react";
import { BarChartCard } from "@/components/dashboard/BarChartCard";
import { FilterBar } from "@/components/dashboard/Filterbar";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { WelcomeBanner } from "@/components/dashboard/WelcomeBanner";
import { BusinessSelector } from "@/components/dashboard/BusinessSelector";
import { UserContext } from "@/contexts/user-context";

export default function DashboardPage() {
  const { 
    isMeta, 
    businessAccounts, 
    selectedBusinessId,
    isLoading 
  } = useContext(UserContext);

  // Encontrar a empresa selecionada
  const selectedBusiness = businessAccounts.find(
    (b) => b.businessAccountId === selectedBusinessId
  );

  // Mostrar loading se ainda estiver carregando
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-5 w-full text-zinc-500 *:border-zinc-200 p-4 md:p-6">
      {/* Coluna Principal */}
      <div className="w-full md:flex-1 flex flex-col gap-5">
        <WelcomeBanner />
        
        {/* Seletor de Empresas - Apenas para login Meta */}
        {isMeta && businessAccounts.length > 0 && (
          <BusinessSelector />
        )}
        
        <FilterBar />
        <BarChartCard selectedBusiness={selectedBusiness} />
      </div>

      {/* Coluna Lateral */}
      <div className="w-full md:w-auto flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-zinc-500 *:border-zinc-200">
          <StatsGrid selectedBusiness={selectedBusiness} />
          <RevenueChart selectedBusiness={selectedBusiness} />
        </div>
      </div>
    </div>
  );
}