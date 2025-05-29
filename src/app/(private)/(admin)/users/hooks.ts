"use client";

import { IUser } from "@/interfaces/IUser";
import { apiAuth } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

interface ResponseGetAllUsers {
  total: number;
  users: IUser[];
}

export const useGetAllUsers = (
  initialPage?: number,
  currentIsActiveFilter?: boolean | undefined
) => {
  const [page, setPage] = useState(initialPage || 1);
  const limit = 20;

  useEffect(() => {
    const targetPage = initialPage || 1;
    if (page !== targetPage) {
      setPage(targetPage);
    }
  }, [initialPage, page]);


  const { data, isLoading, error } = useQuery<ResponseGetAllUsers, Error>({
    queryKey: ["users", page, currentIsActiveFilter],
    queryFn: async () => {
      let apiUrl = `/admin/users?page=${page}&limit=${limit}`;

      if (typeof currentIsActiveFilter === 'boolean') {
        apiUrl += `&isActive=${currentIsActiveFilter}`;
      }

      console.log("Fetching users with URL (para backend corrigido):", apiUrl); 
      const response = await apiAuth.get(apiUrl);
      return response?.data;
    },
  });


  return {
    data,
    isLoading,
    error,
    limit,
    page,
    setPage,
    isActiveFilterUsedInQuery: currentIsActiveFilter,
  }

 }