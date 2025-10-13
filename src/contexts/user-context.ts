"use client";

import { IApiSelection } from "@/interfaces/IApiSelection";
import { JWT_DECODED_DATA, JWT_DECODED_DATA_WHATSAPP } from "@/interfaces/jwt-decoded-data";
import { createContext } from "react";

interface UserContextType {
  informations: JWT_DECODED_DATA | null;
  whatsapp: JWT_DECODED_DATA_WHATSAPP | null;
  apiType: IApiSelection | null;
  isLoading: boolean;
  setInformations: (informations: JWT_DECODED_DATA) => void;
  setApiType: (apiType: IApiSelection) => void;
  clearApiType: () => void;
  isMeta: boolean;
  isEvolution: boolean;
}

export const UserContext = createContext<UserContextType>({
  informations: null,
  whatsapp: null,
  apiType: null,
  isLoading: true,
  setInformations: () => {},
  setApiType: () => {},
  clearApiType: () => {},
  isMeta: false,
  isEvolution: false
});
