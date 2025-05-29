import { MessageSquare, Users } from "lucide-react";
import { StatsCard } from "./StatsCard";

export const StatsGrid = () => {
  return (
    
    <div className="col-span-4 grid grid-rows-2 gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatsCard
          title="Mensagens Enviadas"
          value="352"
          icon={<MessageSquare className="h-5 w-5" />}
          change="+7.32%"
          changeColor="green"
          iconBgClass="bg-green-50"
          iconColorClass="text-green-500"
        />
        <StatsCard
          title="Campanhas Completas"
          value="70"
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
      {/* Segunda linha de cards: */}
      {/* - Grid */}
      {/* - Uma coluna em telas pequenas/médias (padrão: grid-cols-1) */}
      {/* - Duas colunas a partir de telas 'md' (md:grid-cols-2) - Igual ao layout original em desktop */}
      {/* - Espaçamento entre os cards (gap-6) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatsCard
          title="Número de contatos"
          value="234"
          icon={<Users className="h-5 w-5" />}
          iconBgClass="bg-purple-50"
          iconColorClass="text-purple-500"
        />
        <StatsCard
          title="Contatos Salvos pelo Google"
          value="102"
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


