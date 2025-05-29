"use client";

import { CampaignForm } from "@/components/campaign/CampaignForm";
import { queryClient } from "@/providers/query-provider";
import { CreateCampaignSchemaProps } from "@/schemas/create-campaign-schema";
import { apiWhatsapp } from "@/utils/api";
import { appendOptionalFields } from "@/utils/append-form-campaign";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface MutationProps {
  data: CreateCampaignSchemaProps;
  file?: File | null;
}

export default function UpdateCampaign() {
  const params = useParams();
  const campaignId = params["campaignId"] || null;
  const router = useRouter();

  const { data: campaign } = useQuery({
    queryKey: ["campaign", campaignId],
    enabled: !!campaignId,
    queryFn: async () =>
      (await apiWhatsapp.get(`/campaigns/${campaignId}`))?.data,
  });

  const { mutate: handleCampaign, isPending } = useMutation({
    mutationFn: async (props: MutationProps) => {
      const { data, file } = props;

      const form = new FormData();
      form.append("name", data.name);
      form.append("content", data.content);
      form.append("listId", data.listId.toString());

      appendOptionalFields(form, data, file);
      
      await apiWhatsapp.put(`/campaigns/${campaignId}`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      toast.success("Campanha criada com sucesso");
      router.push("/campaign");
    },
    onError: (error) => {
      console.error("Erro ao criar campanha:", error);
    },
  });

  if (campaign?.id) {
    return (
      <CampaignForm
        onSubmit={(data, file) => handleCampaign({ data, file })}
        isSubmitting={isPending}
        initialValues={campaign}
      />
    );
  }
}
