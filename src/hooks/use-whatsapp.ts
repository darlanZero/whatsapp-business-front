"use client";

import { UserContext } from "@/contexts/user-context";
import { IWhatsapp } from "@/interfaces/IWhatsapp";
import { UserRole } from "@/interfaces/user-role";
import { apiAuth } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import "dayjs/locale/pt-br";
import { useSearchParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";

export type ResponseAdminWhatsapps = {
  total: number;
  whatsapps: IWhatsapp[];
};

const limit = 10;

export const useWhatsapp = () => {
  const { informations, isLoading: loadingSession } = useContext(UserContext);
  const params = useSearchParams();
  const initialPage = Number(params?.get("page")) || 1;

  const [page, setPage] = useState<number>(initialPage);

  useEffect(() => {
    setPage(initialPage);
  }, [initialPage]);

  const { data: whatsappAdmin, isLoading: loadingAdmin } =
    useQuery<ResponseAdminWhatsapps>({
      queryKey: ["whatsapp", "admin", page],
      queryFn: async () => {
        const url = `/whatsapp/list?page=${page}&limit=${limit}`;
        return (await apiAuth.get<ResponseAdminWhatsapps>(url))?.data || null;
      },
      enabled:
        informations?.role === UserRole.ADMIN ||
        informations?.role === UserRole.GESTOR,
    });

  const { data: whatsappClient, isLoading: loadingClient } =
    useQuery<IWhatsapp>({
      queryKey: ["whatsapp", "client"],
      enabled: informations?.role === UserRole.CLIENT,
      queryFn: async () =>
        (await apiAuth.get<IWhatsapp>("/whatsapp/instance/my-whatsapp"))?.data,
    });

  return {
    page,
    isLoading: loadingAdmin || loadingClient || loadingSession,
    whatsapps: {
      admin: whatsappAdmin,
      client: whatsappClient,
    },
  };
};
