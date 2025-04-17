import { Modal } from "@/components/modal-base";
import { queryClient } from "@/providers/query-provider";
import { api } from "@/utils/api";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";

const useDisconnect = () => {
  const router = useRouter();

  const logout = useMutation({
    mutationFn: async (name: string) => {
      const response = await api.post(`whatsapp/instance/logout/${name}`);
      console.log(response);
    },

    onSuccess: async () => {
      toast.success("Desconectar!", { toastId: "disconnect" });

      await queryClient.invalidateQueries({
        queryKey: ["whatsapp"],
      });

      router.push("?");
    },

    onError: () => {
      toast.error(
        "Houve um erro ao tentar disconectar, tente novamente mais tarde!"
      );
    },
  });

  return {
    logout,
  };
};

export const Disconnect = () => {
  const { logout } = useDisconnect();

  const params = useSearchParams();
  const nameInstance = params.get("instance");

  return (
    <Modal.container>
      <Modal.form className="p-4 shadow-xl">
        <Modal.header title="Desconectar" />

        <h1 className="text-gray-500 font-semibold text-xl">
          Tem certeza que deseja desconectar esse whatsapp?
        </h1>

        {nameInstance && (
          <button
            type="button"
            onClick={() => logout.mutate(nameInstance)}
            style={{ opacity: logout.isPending ? 0.5 : 1 }}
            className="p-3 bg-red-500 text-white rounded-lg mt-5 font-semibold hover:bg-red-600 transition-colors"
          >
            Desconectar
          </button>
        )}
      </Modal.form>
    </Modal.container>
  );
};
