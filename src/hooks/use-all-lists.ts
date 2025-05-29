import { IList } from "@/interfaces/IList";
import { apiWhatsapp } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";

export interface IListContactResponse {
  list: IList;
  _count: {
    contacts: number;
  };
}

export const useAllLists = () => {
  const { data: lists = [], isLoading } = useQuery<IListContactResponse[]>({
    queryKey: ["lists"],
    queryFn: async () => {
      return (await apiWhatsapp.get("/lists-contacts"))?.data;
    },
  });

  return {
    lists,
    isLoading,
  };
};
