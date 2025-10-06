import { JWT_DECODED_DATA } from "@/interfaces/jwt-decoded-data";
import { ApiType } from "@/interfaces/IApiType";
import axios, { InternalAxiosRequestConfig } from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { TOKEN_KEY, TOKEN_WHATSAPP_KEY, API_TYPE_KEY } from "./cookies-keys";

// Configuração base do Axios
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const META_API_BASE_URL = process.env.NEXT_PUBLIC_META_API_BASE_URL || BASE_URL;

// Criar instâncias do Axios
export const apiPublic = axios.create({ baseURL: BASE_URL });
export const apiAuth = axios.create({ baseURL: BASE_URL });
export const apiWhatsapp = axios.create({ baseURL: BASE_URL });
export const apiMeta = axios.create({ baseURL: META_API_BASE_URL });

const WHATSAPP_HEADER_KEY = "X-WhatsApp-Session";

export const getApiInstance = () => {
  const apiType = Cookies.get(API_TYPE_KEY) as ApiType;

  switch (apiType) {
    case 'meta': 
      return apiMeta;
    case "evolution":
      return apiWhatsapp;
    default:
      return apiWhatsapp;
  }
}

// Função para validar o token JWT
const validateToken = (token: string | undefined): JWT_DECODED_DATA => {
  if (!token) {
    window.location.href = "/login";
    throw new Error("Token não encontrado");
  }

  try {
    const decoded = jwtDecode<JWT_DECODED_DATA>(token);
    if (decoded.exp && Date.now() >= decoded.exp * 1000) {
      window.location.href = "/session-expired";
      throw new Error("Token expirado");
    }
    return decoded;
  } catch (err: unknown) {
    console.error("Erro ao decodificar o token:", err);
    window.location.href = "/login";
    throw new Error("Token inválido");
  }
};

// Função para configurar cabeçalhos
const setHeaders = (
  config: InternalAxiosRequestConfig,
  token: string,
  tokenStore?: string,
  apiType?: ApiType
): InternalAxiosRequestConfig => {
  config.headers.Authorization = `Bearer ${token}`;
  if (apiType === "evolution" && tokenStore) {
    config.headers[WHATSAPP_HEADER_KEY] = tokenStore;
  }

  if (apiType) {
    config.headers['X-API-Type'] = apiType;
  }

  return config;
};

// Interceptor para apiAuth
apiAuth.interceptors.request.use(
  async (config) => {
    const token = Cookies.get(TOKEN_KEY);
    const apiType = Cookies.get(API_TYPE_KEY) as ApiType;

    validateToken(token);

    return setHeaders(config, token!, undefined, apiType);
  },
  (err: Error) => Promise.reject(err)
);

// Interceptor para api(evolution)
apiWhatsapp.interceptors.request.use(
  async (config) => {
    const token = Cookies.get(TOKEN_KEY);
    const tokenStore = Cookies.get(TOKEN_WHATSAPP_KEY);
    const apiType = Cookies.get(API_TYPE_KEY) as ApiType;

    validateToken(token);

    if (!tokenStore) {
      window.location.href = "/session-whatsapp";
      throw new Error("Token whatsapp não encontrado");
    }

    return setHeaders(config, token!, tokenStore, apiType);
  },
  (err: Error) => Promise.reject(err)
);

// Interceptor para apiMeta
apiMeta.interceptors.request.use(
  async (config) => {
    const token = Cookies.get(TOKEN_KEY);
    const apiType = Cookies.get(API_TYPE_KEY) as ApiType;

    validateToken(token);

    return setHeaders(config, token!, undefined, apiType);
  },
  (err: Error) => Promise.reject(err)
);
