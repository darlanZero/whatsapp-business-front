import { JWT_DECODED_DATA } from "@/interfaces/jwt-decoded-data";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

export const publicApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = Cookies.get("token");

  if (!token) {
    window.location.href = "/login";
    throw new Error("Token expirado");
  }

  try {
    const decoded = jwtDecode<JWT_DECODED_DATA>(token);

    if (decoded.exp && Date.now() >= decoded.exp * 1000) {
      window.location.href = "/session-expired";
      throw new Error("Token expirado");
    }

    config.headers.Authorization = `Bearer ${token}`;
    return config;
  } catch (err) {
    if (err instanceof Error) {
      throw new Error("Token inválido: " + err.message);
    }

    throw new Error("Erro desconhecido na validação do token.");
  }
});
