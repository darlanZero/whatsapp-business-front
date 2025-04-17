"use client";

import { JWT_DECODED_DATA } from "@/interfaces/jwt-decoded-data";
import { useEffect, useState } from "react";
import { UserContext } from "@/contexts/user-context";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [informations, setInformations] = useState<JWT_DECODED_DATA | null>(
    null
  );

  const handleInformations = (informations: JWT_DECODED_DATA) => {
    setInformations(informations);
  };

  useEffect(() => {
    const token = Cookies.get("token");

    if (token) {
      const decoded = jwtDecode<JWT_DECODED_DATA>(token);
      setInformations(decoded);
      setIsLoading(false);
    }
  }, []);

  return (
    <UserContext.Provider
      value={{ informations, setInformations: handleInformations, isLoading }}
    >
      {children}
    </UserContext.Provider>
  );
};
