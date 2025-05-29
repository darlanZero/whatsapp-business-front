"use client";

import { JWT_DECODED_DATA, JWT_DECODED_DATA_WHATSAPP } from "@/interfaces/jwt-decoded-data";
import { createContext } from "react";

interface UserContextType {
  informations: JWT_DECODED_DATA | null;
  whatsapp: JWT_DECODED_DATA_WHATSAPP | null;
  isLoading: boolean;
  setInformations: (informations: JWT_DECODED_DATA) => void;
}

export const UserContext = createContext<UserContextType>({
  informations: null,
  whatsapp: null,
  isLoading: true,
  setInformations: () => {},
});
