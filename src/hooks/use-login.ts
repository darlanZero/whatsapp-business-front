import { apiPublic } from "@/utils/api";

interface LoginResponse {
  token: string | null;
}

export const handleLogin = async (
  email: string | undefined,
  password: string | undefined
): Promise<string | null> => {
  try {
    const { data } = await apiPublic.post<LoginResponse>("/auth/login", {
      email,
      password,
    });
    
    return data?.token ?? null;
  } catch (error) {
    console.error("Login failed:", error);
    return null;
  }
};

export const handleMetaCallback = async (code: string): Promise<string | null> => {
  try {
    const { data } = await apiPublic.post<LoginResponse>("/auth/meta/callback", {
      code,
    });
    return data?.token ?? null;
  } catch (error) {
    console.error("Meta login failed:", error);
    return null;
  }
}
    