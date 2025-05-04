"use client";

import { Button } from "@/components/ui/button";
import { apiWhatsapp } from "@/utils/api";
import { fontInter } from "@/utils/fonts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SimpleLoader } from "../simple-loader";

const useCreateList = () => {
  const router = useRouter();
  const qc = useQueryClient();

  const [formState, setFormState] = useState({ listName: "" });

  const handleListNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    setFormState({
      listName: e.target.value || "",
    });
  };

  const handleCreateList = useMutation({
    mutationFn: async () => {
      const newList = { name: formState.listName.trim() };

      const response = await apiWhatsapp.post(`lists-contacts/create`, newList);

      return response.data; // Retornar os dados para que sejam disponibilizados no onSuccess
    },
    onSuccess: (  ) => {
      qc.invalidateQueries({
        queryKey: ["lists"],
      });

      router.push("?");
    },
    onError: (error: Error) => {
      console.log("Erro ao criar lista:", error);
    },
  });

  return {
    handleCreateList,
    handleListNameChange,
    formState,
  };
};

const CreateList = () => {
  const { handleCreateList, formState, handleListNameChange } = useCreateList();

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="gap-0 flex flex-col mt-5 ">
        <label
          htmlFor="listName"
          className={`${fontInter}text-sm font-medium text-gray-500`}
        >
          Nome da Lista
        </label>
        <input
          id="listName"
          placeholder="Digite o nome da lista..."
          value={formState?.listName || ""}
          onChange={handleListNameChange}
          className={`${fontInter} text-gray-800 border outline-none focus:ring-2 ring-indigo-500 border-zinc-200 p-2 rounded-md`}
        />
      </div>

      <Button
        type="button"
        className={`${fontInter} p-6 bg-indigo-500 hover:bg-indigo-700 text-white`}
        onClick={() => handleCreateList.mutate()}
        disabled={handleCreateList.isPending}
      >
        {!handleCreateList.isPending && "Criar"}

        {handleCreateList.isPending && (
          <div className="flex gap-2 items-center">
            <SimpleLoader className="w-5 h-5" />
            <span className="">Criando...</span>
          </div>
        )}
      </Button>
    </div>
  );
};

export { CreateList };
