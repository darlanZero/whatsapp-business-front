"use client";

import { Modal } from "@/components/modal-base";
import { IUser } from "@/interfaces/IUser";
import { queryClient } from "@/providers/query-provider";
import { apiAuth } from "@/utils/api";
import { fontSaira } from "@/utils/fonts";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter, useSearchParams } from "next/navigation"; // Import useSearchParams
import { useCallback, useEffect } from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import { toast } from "react-toastify";

interface UserForDeletion extends IUser {
  name: string;
  email: string;
}

const useDeleteUser = (userId: string | null, onModalClose: () => void) => {
  const {
    data: user,
    isLoading: isLoadingUser,
    error: userError,
  } = useQuery<UserForDeletion>({
    queryKey: [`user-to-delete`, userId],
    queryFn: async () => {
      const response = await apiAuth.get(`/users/${userId}`);
      return response.data;
    },
    enabled: !!userId,
    retry: false,
  });

  const mutation = useMutation({
    mutationFn: async () => {
      if (!userId) throw new Error("User ID is required for deletion.");
      return await apiAuth.delete(`admin/users/hard-delete/${userId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      onModalClose();
    },
    onError: (error: unknown) => {
      console.error("Erro ao excluir usuário:", error);
      if (error instanceof AxiosError) {
        const errorMessage =
          error?.response?.data?.message ||
          "Não foi possível excluir o usuário.";
        toast.error(errorMessage);
      } else {
        toast.error("Houve um erro interno, tente novamente mais tarde!");
      }
    },
  });

  return {
    user,
    isLoadingUser,
    userError,
    deleteUser: mutation.mutate,
    isDeleting: mutation.isPending,
  };
};

export const DeleteUserModal = () => {
  const router = useRouter();
  const searchParams = useSearchParams(); // Use the hook here
  const userId: string | null = searchParams.get("userId");

  const handleCloseModal = useCallback(() => {
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.delete("userId");
    router.push(`?${currentParams.toString()}`);
  }, [router, searchParams]);

  if (!userId) {
    return null;
  }

  return (
    <ModalDeleteUserContent userId={userId} onModalClose={handleCloseModal} />
  );
};

const ModalDeleteUserContent = ({
  userId,
  onModalClose,
}: {
  userId: string;
  onModalClose: () => void;
}) => {
  const { user, isLoadingUser, userError, deleteUser, isDeleting } =
    useDeleteUser(userId, onModalClose);

  useEffect(() => {
    if (userError) {
      toast.error("Usuário não encontrado ou erro ao carregar dados.");
      onModalClose();
    }
  }, [userError, onModalClose]);

  if (isLoadingUser) {
    return (
      <Modal.container className="bg-zinc-900/80 fixed inset-0 z-50 flex items-center justify-center">
        <div className="flex flex-col gap-2 items-center rounded-xl m-auto p-10 bg-zinc-900 text-zinc-300 font-semibold border border-zinc-800">
          <span>Carregando dados do usuário...</span>
        </div>
      </Modal.container>
    );
  }

  if (!user) {
    return (
      <Modal.container className="bg-zinc-900/80 fixed inset-0 z-50 flex items-center justify-center">
        <div className="flex flex-col gap-2 items-center rounded-xl m-auto p-10 bg-zinc-900 text-zinc-300 font-semibold border border-zinc-800">
          <span>Usuário não encontrado.</span>
          <button
            onClick={onModalClose}
            className="bg-sky-600 text-white p-1 px-2 rounded opacity-90 hover:opacity-100 mt-2"
          >
            Fechar
          </button>
        </div>
      </Modal.container>
    );
  }

  return (
    <Modal.container className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/70 backdrop-blur-sm">
      <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-2xl w-full max-w-md m-auto border dark:border-zinc-700">
        <Modal.header
          title="Confirmar Exclusão"
          className={`${fontSaira} text-red-600 dark:text-red-500 p-4 border-b dark:border-zinc-700`}
        />

        <section className="p-6 space-y-4 text-zinc-700 dark:text-zinc-300">
          <div className="flex items-center justify-center text-red-500 dark:text-red-400">
            <FaExclamationTriangle size={48} />
          </div>

          <p className="text-center text-lg">
            Tem certeza que deseja excluir permanentemente o usuário?
          </p>

          <p
            className={`text-center text-sm font-semibold text-red-600 dark:text-red-500 ${fontSaira}`}
          >
            Esta ação não pode ser desfeita.
          </p>
        </section>

        <footer className="w-full p-4 border-t dark:border-zinc-700 flex justify-end gap-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-b-xl">
          <button
            type="button"
            onClick={onModalClose}
            disabled={isDeleting}
            className="p-2 px-4 bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-600 dark:hover:bg-zinc-500 text-zinc-800 dark:text-zinc-100 font-semibold rounded-lg transition-colors duration-150 ease-in-out"
          >
            <span className={fontSaira}>Cancelar</span>
          </button>
          <button
            type="button"
            onClick={() => deleteUser()}
            disabled={isDeleting}
            className="p-2 px-4 bg-red-600 hover:bg-red-700 disabled:bg-red-300 dark:disabled:bg-red-800 dark:disabled:text-zinc-500 text-white font-semibold rounded-lg transition-colors duration-150 ease-in-out"
          >
            <span className={fontSaira}>
              {isDeleting ? "Excluindo..." : "Excluir Usuário"}
            </span>
          </button>
        </footer>
      </div>
    </Modal.container>
  );
};
