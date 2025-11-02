"use client";

import {
  JWT_DECODED_DATA,
  JWT_DECODED_DATA_WHATSAPP,
} from "@/interfaces/jwt-decoded-data";
import { useEffect, useState } from "react";
import { UserContext } from "@/contexts/user-context";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { API_TYPE_KEY, TOKEN_KEY, TOKEN_WHATSAPP_KEY } from "@/utils/cookies-keys";
import { IApiSelection } from "@/interfaces/IApiSelection";
import { usePathname } from "next/navigation";
import { IBusinessAccount } from "@/interfaces/IUserMeta";

interface UserProviderProps {
  children: React.ReactNode;
}

// Chave para salvar a empresa selecionada no localStorage
const SELECTED_BUSINESS_KEY = "selectedBusinessId";

export function UserProvider({ children }: UserProviderProps) {
  const [informations, setInformations] = useState<JWT_DECODED_DATA | null>(null);
  const [whatsapp, setWhatsapp] = useState<JWT_DECODED_DATA_WHATSAPP | null>(null);
  const [apiType, setApiTypeState] = useState<IApiSelection | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Novos estados para suporte a múltiplas empresas
  const [selectedBusinessId, setSelectedBusinessIdState] = useState<string | null>(null);
  const [businessAccounts, setBusinessAccounts] = useState<IBusinessAccount[]>([]);

  const pathname = usePathname();

  useEffect(() => {
    const loadUserData = () => {
      try {
        const savedApiType = Cookies.get(API_TYPE_KEY) as IApiSelection;
        console.log("UserProvider - API type do cookie:", savedApiType);
        
        if (savedApiType) {
          setApiTypeState(savedApiType);
          console.log("UserProvider - API type salvo no estado:", savedApiType);
        }

        const token = Cookies.get(TOKEN_KEY);
        if (token) {
          try {
            const decoded = jwtDecode<JWT_DECODED_DATA>(token);
            setInformations(decoded);
            console.log('🔵 UserProvider - Token decodificado:', decoded);

            // Verificar se é login Meta com múltiplas empresas
            if (savedApiType === "meta" && decoded.businessAccounts && Array.isArray(decoded.businessAccounts)) {
              console.log('🔵 UserProvider - Detectado login Meta com múltiplas empresas:', decoded.businessAccounts.length);
              setBusinessAccounts(decoded.businessAccounts);

              // Tentar carregar empresa selecionada anteriormente do localStorage
              const savedBusinessId = localStorage.getItem(SELECTED_BUSINESS_KEY);
              
              // Verificar se a empresa salva ainda existe na lista de empresas do usuário
              const businessExists = decoded.businessAccounts.find(
                (b) => b.businessAccountId === savedBusinessId
              );

              if (savedBusinessId && businessExists) {
                console.log('✅ UserProvider - Empresa salva encontrada:', savedBusinessId);
                setSelectedBusinessIdState(savedBusinessId);
              } else if (decoded.businessAccounts.length > 0) {
                // Selecionar primeira empresa por padrão
                const firstBusinessId = decoded.businessAccounts[0].businessAccountId;
                console.log('✅ UserProvider - Selecionando primeira empresa:', firstBusinessId);
                setSelectedBusinessIdState(firstBusinessId);
                localStorage.setItem(SELECTED_BUSINESS_KEY, firstBusinessId);
              }
            } else {
              // Limpar dados de múltiplas empresas se não for Meta
              setBusinessAccounts([]);
              setSelectedBusinessIdState(null);
              localStorage.removeItem(SELECTED_BUSINESS_KEY);
            }
          } catch (error) {
            console.error('❌ UserProvider - Erro ao decodificar token:', error);
          }
        }

        if (savedApiType === "evolution") {
          const tokenWhatsapp = Cookies.get(TOKEN_WHATSAPP_KEY);
          if (tokenWhatsapp) {
            try {
              const decodedWhatsapp = jwtDecode<JWT_DECODED_DATA_WHATSAPP>(tokenWhatsapp);
              setWhatsapp(decodedWhatsapp);
              console.log('🔵 UserProvider - Token WhatsApp decodificado:', decodedWhatsapp);
            } catch (error) {
              console.error('❌ UserProvider - Erro ao decodificar token WhatsApp:', error);
            }
          }
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      } finally {
        console.log("UserProvider - Finalizando carregamento de dados do usuário.");
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [pathname]);

  const setApiType = (newApiType: IApiSelection) => {
    Cookies.set(API_TYPE_KEY, newApiType, { 
      expires: 30,
      path: '/',
      sameSite: 'lax'
    });
    setApiTypeState(newApiType);
  };

  const clearApiType = () => {
    Cookies.remove(API_TYPE_KEY);
    setApiTypeState(null);
    
    // Limpar também dados de empresas
    setBusinessAccounts([]);
    setSelectedBusinessIdState(null);
    localStorage.removeItem(SELECTED_BUSINESS_KEY);
  };

  const setSelectedBusinessId = (businessId: string | null) => {
    console.log('🔄 UserProvider - Alterando empresa selecionada para:', businessId);
    setSelectedBusinessIdState(businessId);
    
    if (businessId) {
      localStorage.setItem(SELECTED_BUSINESS_KEY, businessId);
    } else {
      localStorage.removeItem(SELECTED_BUSINESS_KEY);
    }
  };

  const isMeta = apiType === "meta";
  const isEvolution = apiType === "evolution";
  const hasMultipleBusinesses = isMeta && businessAccounts.length > 1;

  console.log("UserProvider - Renderizando com estado:", {
    apiType,
    isLoading,
    isMeta,
    isEvolution,
    hasMultipleBusinesses,
    businessAccountsCount: businessAccounts.length,
    selectedBusinessId,
  });

  return (
    <UserContext.Provider
      value={{
        informations,
        whatsapp,
        apiType,
        isLoading,
        setApiType,
        setInformations,
        clearApiType,
        isMeta,
        isEvolution,
        selectedBusinessId,
        setSelectedBusinessId,
        businessAccounts,
        hasMultipleBusinesses,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}