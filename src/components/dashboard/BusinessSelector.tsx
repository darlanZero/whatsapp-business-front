"use client";

import { useContext, useEffect, useState } from "react";
import { Building2, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { fontInter } from "@/utils/fonts";
import { UserContext } from "@/contexts/user-context";
import { cn } from "@/lib/utils";

export const BusinessSelector = () => {
  const { 
    businessAccounts, 
    selectedBusinessId, 
    setSelectedBusinessId,
    hasMultipleBusinesses,
    isMeta 
  } = useContext(UserContext);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Não renderizar se não for Meta API ou não tiver contas
  if (!mounted || !isMeta || businessAccounts.length === 0) {
    return null;
  }

  // Se houver apenas uma empresa, mostrar card informativo compacto
  if (!hasMultipleBusinesses) {
    const business = businessAccounts[0];
    return (
      <Card className="border-zinc-200 shadow-none">
        <CardContent className="pt-4 pb-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-50 p-2 rounded-lg">
              <Building2 className="h-5 w-5 text-blue-500" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500">Empresa Atual</p>
              <p className={`${fontInter} font-semibold text-gray-900 text-sm`}>
                {business.businessName}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-zinc-200 shadow-none">
      <CardContent className="pt-4 pb-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="h-4 w-4 text-gray-500" />
            <p className="text-sm font-medium text-gray-700">Selecionar Empresa</p>
          </div>
          
          {/* Botões de empresas em formato de lista lateral */}
          <div className="flex flex-col gap-2">
            {businessAccounts.map((business) => {
              const isSelected = business.businessAccountId === selectedBusinessId;
              
              return (
                <button
                  key={business.businessAccountId}
                  onClick={() => setSelectedBusinessId(business.businessAccountId)}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg border-2 transition-all text-left w-full",
                    isSelected
                      ? "border-blue-500 bg-blue-50"
                      : "border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50"
                  )}
                >
                  {/* Ícone de check se selecionado */}
                  <div className={cn(
                    "flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center",
                    isSelected
                      ? "bg-blue-500"
                      : "border-2 border-zinc-300"
                  )}>
                    {isSelected && <Check className="h-3 w-3 text-white" />}
                  </div>
                  
                  {/* Informações da empresa */}
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      "font-semibold text-sm truncate",
                      isSelected ? "text-blue-900" : "text-gray-900"
                    )}>
                      {business.businessName}
                    </p>
                    <p className={cn(
                      "text-xs truncate",
                      isSelected ? "text-blue-700" : "text-gray-500"
                    )}>
                      {business.displayPhoneNumber}
                    </p>
                    
                    {/* Mostrar se tem múltiplos números */}
                    {business.hasMultipleNumbers && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        +{business.totalNumbers - 1} número{business.totalNumbers - 1 > 1 ? 's' : ''} adicional{business.totalNumbers - 1 > 1 ? 'is' : ''}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};