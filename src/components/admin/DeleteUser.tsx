"use client";

import { Button } from "@/components/ui/button";
import { apiAuth } from "@/utils/api";
import { fontInter } from "@/utils/fonts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

type DeleteUserButtonProps = {
  userId: number;
};

export const DeleteUserButton = ({ userId }: DeleteUserButtonProps) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutateAsync: deleteList } = useMutation({
    mutationFn: async () => {
      const response = await apiAuth.delete(`/admin/users/delete/${userId}`);
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["users"] });

      toast.success("Usúario excluído com sucesso!");

      router.push("/users");
    },
    onError: () => {
      toast.error("Erro ao excluir usúario!");
    },
  });

  return (
    <section
      className={`${fontInter} mt-5 text-gray-800 flex-1 flex-col w-full flex gap-2`}
    >
      <h2 className="text-lg font-medium">
        Tem certeza que deseja excluir esse usúario?
      </h2>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          type="button"
          variant="destructive"
          onClick={() => deleteList()}
          className="px-5 hover:shadow-xl hover:shadow-rose-600/20 py-2 bg-red-600 rounded-full hover:bg-rose-700 text-white w-full sm:w-auto flex items-center justify-center gap-2"
        >
          <Trash2 className="h-4 w-4" />
          Excluir
        </Button>
      </div>
    </section>
  );
};
