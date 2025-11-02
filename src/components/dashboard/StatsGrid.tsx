"use client";

import { MessageSquare, Users } from "lucide-react";
import { StatsCard } from "./StatsCard";
import { IBusinessAccount } from "@/interfaces/IUserMeta";
import { useEffect, useState } from "react";

interface StatsGridProps {
  selectedBusiness?: IBusinessAccount | null;
}

interface Stats {
  messagesSent: number;
  completedCampaigns: number;
  contacts: number;
  googleContacts: number;
}

export const StatsGrid = ({ selectedBusiness }: StatsGridProps) => {
  const [stats, setStats] = useState<Stats>({
    messagesSent: 352,
    completedCampaigns: 70,
    contacts: 234,
    googleContacts: 102,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Se houver uma empresa selecionada, buscar dados específicos dela
    if (selectedBusiness) {
      console.log('📊 StatsGrid - Carregando stats para empresa:', selectedBusiness.businessName);
      
      // Aqui você faria a chamada para sua API
      // fetchStats(selectedBusiness.businessAccountId);
      
      // Por enquanto, apenas simula um loading
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        // Em produção, use os dados retornados pela API
        setStats({
          messagesSent: Math.floor(Math.random() * 500) + 100,
          completedCampaigns: Math.floor(Math.random() * 100) + 20,
          contacts: Math.floor(Math.random() * 300) + 50,
          googleContacts: Math.floor(Math.random() * 150) + 20,
        });
      }, 300);
    }
  }, [selectedBusiness]);

  if (loading) {
    return (
      <div className="col-span-4 grid grid-rows-2 gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-32 bg-gray-100 animate-pulse rounded-lg" />
          <div className="h-32 bg-gray-100 animate-pulse rounded-lg" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-32 bg-gray-100 animate-pulse rounded-lg" />
          <div className="h-32 bg-gray-100 animate-pulse rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="col-span-4 grid grid-rows-2 gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatsCard
          title="Mensagens Enviadas"
          value={stats.messagesSent.toString()}
          icon={<MessageSquare className="h-5 w-5" />}
          change="+7.32%"
          changeColor="green"
          iconBgClass="bg-green-50"
          iconColorClass="text-green-500"
        />
        <StatsCard
          title="Campanhas Completas"
          value={stats.completedCampaigns.toString()}
          icon={
            <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
              <path fill="currentColor" d="M9 12l2 2 4-4" />
            </svg>
          }
          change="-6.89%"
          changeColor="red"
          iconBgClass="bg-blue-50"
          iconColorClass="text-blue-500"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatsCard
          title="Número de contatos"
          value={stats.contacts.toString()}
          icon={<Users className="h-5 w-5" />}
          iconBgClass="bg-purple-50"
          iconColorClass="text-purple-500"
        />
        <StatsCard
          title="Contatos Salvos pelo Google"
          value={stats.googleContacts.toString()}
          icon={
            <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"
              />
            </svg>
          }
          iconBgClass="bg-gray-50"
          iconColorClass="text-blue-500"
        />
      </div>
    </div>
  );
};