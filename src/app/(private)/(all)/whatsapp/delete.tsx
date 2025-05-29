import { Modal } from "@/components/modal-base";
import { queryClient } from "@/providers/query-provider";
import { apiAuth } from "@/utils/api";
import { fontInter } from "@/utils/fonts";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { TOKEN_WHATSAPP_KEY } from "@/utils/cookies-keys";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { AxiosError } from "axios";

const useModalDelete = () => {
  const router = useRouter();
  const params = useSearchParams();
  const instance = params.get("instance");

  const instanceDelete = useMutation({
    mutationFn: async (nameInstance: string) => {
      const whatsappToken = Cookies.get(TOKEN_WHATSAPP_KEY);
      let redirectToSession = false;

      if (whatsappToken) {
        const decoded = jwtDecode<JwtPayload & { instanceName: string }>(
          whatsappToken
        );

        if (decoded?.instanceName === nameInstance) {
          const shouldDelete = window.confirm(
            "Deseja mesmo deletar, você terá que realizar novamente o login com a sessão do whatsapp."
          );

          if (!shouldDelete) {
            throw new Error("ACTION_CANCELLED");
          }

          redirectToSession = true;
        }
      }

      const response = await apiAuth.post(
        `/whatsapp/instance/delete/${nameInstance}`
      );

      // Retornamos um objeto com os dados e a flag de redirecionamento
      return {
        data: response.data,
        redirectToSession,
      };
    },

    onSuccess: async (result) => {
      toast.success("Whatsapp deletado com sucesso!");
      await queryClient.invalidateQueries({ queryKey: ["whatsapp"] });

      if (result.redirectToSession) {
        router.push("/session-whatsapp");
      } else {
        router.push("/whatsapp");
      }
    },

    onError: (error: Error) => {
      if (error.message !== "ACTION_CANCELLED") {
        if (error instanceof AxiosError) {
          toast.error(
            error.response?.data?.message ||
              "Não foi possível deletar a instancia"
          );
        } else {
          toast.error("Não foi possível deletar a instancia");
        }
      }
    },
  });

  return {
    instanceDelete,
    instance,
  };
};

export const ModalDelete = () => {
  const { instanceDelete, instance } = useModalDelete();

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
            onClick={async () => {
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
