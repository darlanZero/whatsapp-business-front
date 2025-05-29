"use client";

import {
  JWT_DECODED_DATA,
  JWT_DECODED_DATA_WHATSAPP,
} from "@/interfaces/jwt-decoded-data";
import { useEffect, useState } from "react";
import { UserContext } from "@/contexts/user-context";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { TOKEN_KEY, TOKEN_WHATSAPP_KEY } from "@/utils/cookies-keys";

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [whatsapp, setWhatsapp] = useState<JWT_DECODED_DATA_WHATSAPP | null>(
    null
  );

  const [informations, setInformations] = useState<JWT_DECODED_DATA | null>(
    null
  );

  const handleInformations = (informations: JWT_DECODED_DATA) => {
    setInformations(informations);
  };

  useEffect(() => {
    const token = Cookies.get(TOKEN_KEY);
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode<JWT_DECODED_DATA>(token);
      setInformations(decoded);

      const whatsappToken = Cookies.get(TOKEN_WHATSAPP_KEY);
      if (!whatsappToken) return;

      const whatsappDecoded =
        jwtDecode<JWT_DECODED_DATA_WHATSAPP>(whatsappToken);

      setWhatsapp(whatsappDecoded);
    } catch (error) {
      console.error("Token decoding error:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <UserContext.Provider
      value={{
        informations,
        setInformations: handleInformations,
        whatsapp,
        isLoading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
