"use client";

import { TOKEN_KEY } from "@/utils/cookies-keys";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function SessionExpiredPage() {
  const router = useRouter();

  const logout = () => {
    Cookies.remove(TOKEN_KEY);
    router.replace("/login");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold text-zinc-500">Sessão expirada</h1>
      <p className="mt-2 text-gray-500">Faça login novamente para continuar.</p>
      <button
        onClick={logout}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Fazer login
      </button>
    </div>
  );
}
