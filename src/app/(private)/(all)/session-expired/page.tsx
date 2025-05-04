"use client";

import Cookies from "js-cookie";

export default function SessionExpiredPage() {
  const logout = () => {
    const cookies = Cookies.get(); 

    console.log(cookies)
    Object.keys(cookies)?.forEach((cookieName) => {
      Cookies.remove(cookieName); // Remove cada cookie
    });

    window.location.href = '/login';
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
