"use client";

import { IUser } from "@/interfaces/IUser";
import { api } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

interface ResponseGetAllUsers {
  total: number;
  users: IUser[];
}

export const useGetAllUsers = (initialPage?: number | null) => {
  const [page, setPage] = useState(initialPage || 1);
  const limit = 1;

  useEffect(() => {
    const currentPage = initialPage || 1;
    setPage(currentPage);
  }, [initialPage]);

  const { data, isLoading } = useQuery<ResponseGetAllUsers>({
    queryKey: ["users", page],
    queryFn: async () =>
      (await api.get(`/admin/users?page=${page}&limit=${limit}`))?.data,
  });

  return { data, isLoading, limit };
};
