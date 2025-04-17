import { publicApi } from "@/utils/api";

interface LoginResponse {
  token: string | null;
}

export const handleLogin = async (
  email: string,
  password: string
): Promise<string | null> => {
  try {
    const { data } = await publicApi.post<LoginResponse>("/auth/login", {
      email,
      password,
    });
    
    return data?.token ?? null;
  } catch (error) {
    console.error("Login failed:", error);
    return null;
  }
};
    