import { ILabelWhatsapp } from "@/interfaces/ILabel";
import { queryClient } from "@/providers/query-provider";
import { apiWhatsapp } from "@/utils/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export const useWhatsappLabels = () => {
  const { data: labels, isLoading: loadLabels } = useQuery<ILabelWhatsapp[]>({
    queryFn: async () =>
      (await apiWhatsapp.get("/contacts-evolution/labels"))?.data,
    queryKey: ["whatsapp", "labels"],
  });

  return {
    labels,
    loadLabels,
  };
};

export const useImportByLabel = () => {
  const router = useRouter();

  const importByLabelMutation = useMutation({
    mutationFn: async (data: { listId: number; labelId: string }) => {
      return await apiWhatsapp.post("/contacts/save/by-labels", {
        listId: data.listId,
        labelId: data.labelId,
      });
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["lists"] });
      toast.success("Importação começada com sucesso!");
      router.push("?");
    },

    onError: (error: unknown) => {
      const defaultError = "Houve um erro interno, tente novamente mais tarde!";
      if (error instanceof AxiosError) {
        toast.error(error?.response?.data?.message || defaultError);
      } else {
        toast.error(defaultError);
      }
    },
  });

  return {
    importByLabelMutation,
  };
};
