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

interface UserProviderProps {
  children: React.ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const [informations, setInformations] = useState<JWT_DECODED_DATA | null>(null);

  const [whatsapp, setWhatsapp] = useState<JWT_DECODED_DATA_WHATSAPP | null>(null);

  const [apiType, setApiTypeState] = useState<IApiSelection | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const pathname = usePathname();

  useEffect(() => {
    const loadUserData = () => {
      try {
        const savedApiType = Cookies.get(API_TYPE_KEY) as IApiSelection;
        console.log("UserProvider - API type do cookie:", savedApiType)
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
    }

    loadUserData();
  }, [pathname]);

  const setApiType = (newApiType: IApiSelection) => {
    Cookies.set(API_TYPE_KEY, newApiType, { 
      expires: 30,
      path: '/',
      sameSite: 'lax'
    });
    setApiTypeState(newApiType)
  }

  const clearApiType = () => {
    Cookies.remove(API_TYPE_KEY);
    setApiTypeState(null);
  }

  const isMeta = apiType === "meta"
  const isEvolution = apiType === "evolution"

  console.log("UserProvider - Renderizando com estado:", {
    apiType,
    isLoading,
    isMeta,
    isEvolution
  })

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
      }}
    >
      {children}
    </UserContext.Provider>
  )
  
};
