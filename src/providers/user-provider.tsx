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
import { usePathname, useRouter } from "next/navigation";

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
        if (savedApiType) {
          setApiTypeState(savedApiType);
        }

        const token = Cookies.get(TOKEN_KEY);
        if (token) {
          const decoded = jwtDecode<JWT_DECODED_DATA>(token);
          setInformations(decoded);
        }

        if (savedApiType === "evolution") {
          const tokenWhatsapp = Cookies.get(TOKEN_WHATSAPP_KEY);
          if (tokenWhatsapp) {
            const decodedWhatsapp = jwtDecode<JWT_DECODED_DATA_WHATSAPP>(tokenWhatsapp);
            setWhatsapp(decodedWhatsapp);
          }
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadUserData();
  }, [pathname]);

  const setApiType = (newApiType: IApiSelection) => {
    Cookies.set(API_TYPE_KEY, newApiType, { expires: 30});
    setApiTypeState(newApiType)
  }

  const clearApiType = () => {
    Cookies.remove(API_TYPE_KEY);
    setApiTypeState(null);
  }

  const isMeta = apiType === "meta"
  const isEvolution = apiType === "evolution"

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
