import { Modal } from "@/components/modal-base";
import { queryClient } from "@/providers/query-provider";
import { api } from "@/utils/api";
import { fontInter } from "@/utils/fonts";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";

const useModalDelete = () => {
  const router = useRouter();

  const instanceDelete = useMutation({
    mutationFn: async (nameInstance: string) => {
      await api.post(`/whatsapp/instance/delete/${nameInstance}`);
    },
    onSuccess: () => {
      toast.success("Whatsapp deletado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["whatsapp"] });
      router.push("?");
    },
    onError: () => {
      toast.error("Não foi possível deletar a instancia");
    },
  });

  return {
    instanceDelete,
  };
};

export const ModalDelete = () => {
  const { instanceDelete } = useModalDelete();
  const params = useSearchParams();
  const instance = params.get("instance");

  return (
    <Modal.container>
      <Modal.form className="p-5 bg-white gap-5">
        <Modal.header
          className="text-base font-semibold text-zinc-600"
          title="Tem certeza?"
        />
        <section className={`${fontInter}`}>
          Você esta prestes de excluir a instância {instance}. Tem certeza que
          deseja continuar?{" "}
        </section>
        <footer className="flex gap-2 items-center justify-end">
          <Link
            href="?"
            className={`${fontInter} bg-gray-100 p-2 font-semibold text-zinc-400 rounded-md text-sm`}
          >
            Cancelar
          </Link>
          <button
            type="button"
            className={`${fontInter} bg-red-500 opacity-80 hover:opacity-100 p-2 text-red-100 rounded-lg transition-all font-semibold`}
            onClick={() => {
              if (instance) {
                instanceDelete.mutate(instance);
              }
            }}
          >
            Deletar
          </button>
        </footer>
      </Modal.form>
    </Modal.container>
  );
};
