"use client";

import { CampaignForm } from "@/components/campaign/CampaignForm";
import { queryClient } from "@/providers/query-provider";
import { CreateCampaignSchemaProps } from "@/schemas/create-campaign-schema";
import { apiWhatsapp } from "@/utils/api";
import { appendOptionalFields } from "@/utils/append-form-campaign";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface MutationProps {
  data: CreateCampaignSchemaProps;
  file?: File | null;
}

export default function CreateCampaign() {
  const router = useRouter();

  const { mutate: handleCampaign, isPending } = useMutation({
    mutationFn: async (props: MutationProps) => {
      const { data, file } = props;
      const form = new FormData();
      form.append("name", data.name);
      form.append("content", data.content);
      form.append("listId", data.listId.toString());

      appendOptionalFields(form, data, file);

      const res = await apiWhatsapp.post("/campaigns", form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return res;
    },
    onSuccess: () => {
      toast.success("Campanha criada com sucesso");
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      router.push("/campaign");
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error("Houve um erro", error.response?.data?.message);
      } else {
        console.error("Erro ao criar campanha:", error);
        toast.error("Houve um erro ao tentar criar uma campanha");
      }
    },
  });

  return (
    <CampaignForm
      onSubmit={(data, file) => handleCampaign({ data, file })}
      isSubmitting={isPending}
    />
  );
}
