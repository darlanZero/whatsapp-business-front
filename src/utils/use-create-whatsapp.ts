import { queryClient } from "@/providers/query-provider";
import { apiAuth } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

const createWhatsappSchema = z.object({
  name: z.string().min(1),
  phone: z
    .string()
    .transform((value) => `55${value.replace(/\D/g, "")}`),
});

type CreateWhatsappSchemaProps = z.infer<typeof createWhatsappSchema>;

export const useCreateWhatsapp = () => {
  const form = useForm<CreateWhatsappSchemaProps>({
    resolver: zodResolver(createWhatsappSchema),
  });

  
  const handleCreate = useMutation({
    mutationFn: async (data: CreateWhatsappSchemaProps) => {
      return await apiAuth.post("/whatsapp/instance", {
        integration: "WHATSAPP-BAILEYS",
        phoneNumber: data.phone,
        instanceName: data.name,
        number: data.phone,
        qrcode: true,
      });
    },

    onSuccess: async () => {
      toast.success("Criado com sucesso!");

      await queryClient.invalidateQueries({
        queryKey: ["whatsapp"],
      });
    },

    onError: (err: unknown) => {
      if (err instanceof AxiosError) {
        console.log(err);
        toast.error(err?.response?.data?.message || "teste", {
          hideProgressBar: true,
          autoClose: 1000,
          toastId: "error",
        });
      } else {
        toast.error("Houve um erro ao tentar criar uma nova instância", {
          hideProgressBar: true,
        });
      }
    },
  });
  
  return {
    form,
    handleCreate,
  };
};
