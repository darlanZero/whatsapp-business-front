"use client";

import { Button } from "@/components/ui/button";
import { IList } from "@/interfaces/IList";
import { apiWhatsapp } from "@/utils/api";
import { fontInter } from "@/utils/fonts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { toast } from "react-toastify";

type DeleteListButtonProps = {
  listId: number;
};

export const DeleteListButton = ({ listId }: DeleteListButtonProps) => {
  const queryClient = useQueryClient();

  const { mutateAsync: deleteList } = useMutation({
    mutationFn: async () => {
      const response = await apiWhatsapp.delete(`/lists-contacts/${listId}`);
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.setQueryData(["lists"], (old: IList[]) =>
        old?.filter((list) => list.id !== listId)
      );

      toast.success("Lista excluída com sucesso");
    },
    onError: () => {
      toast.error("Erro ao excluir lista");
    },
  });

  return (
    <section className={`${fontInter} text-gray-800 space-y-6`}>
      <h2 className="text-lg font-medium">Tem certeza que deseja excluir</h2>

      <div className="flex flex-col sm:flex-row gap-3 justify-end">
        <Button
          type="button"
          variant="outline"
          className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors w-full sm:w-auto"
        >
          Cancelar
        </Button>

        <Button
          type="button"
          variant="destructive"
          onClick={() => deleteList()}
          className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white shadow-sm hover:shadow w-full sm:w-auto flex items-center justify-center gap-2"
        >
          <Trash2 className="h-4 w-4" />
          Excluir
        </Button>
      </div>
    </section>
  );
};
