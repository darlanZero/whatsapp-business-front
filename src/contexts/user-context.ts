"use client";

import { JWT_DECODED_DATA } from "@/interfaces/jwt-decoded-data";
import { createContext } from "react";

interface UserContextType {
  informations: JWT_DECODED_DATA | null;
  isLoading: boolean;
  setInformations: (informations: JWT_DECODED_DATA) => void;
}

export const UserContext = createContext<UserContextType>({
  informations: null,
  isLoading: true,
  setInformations: () => {},
});
