import { ICampaign } from "@/interfaces/ICampaign";
import { apiWhatsapp } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";

export const useCampaign = () => {
  const { data: campaigns, isLoading } = useQuery<ICampaign[]>({
    queryKey: ["campaigns"],
    queryFn: async () => (await apiWhatsapp.get("/campaigns"))?.data,
  });

  return {
    campaigns,
    isLoading,
  };
};
