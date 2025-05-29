"use client";

import { Button } from "@/components/ui/button";
import { apiWhatsapp } from "@/utils/api";
import { fontInter } from "@/utils/fonts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { SimpleLoader } from "../simple-loader";
import { toast } from "react-toastify";

const useUpateList = () => {
  const router = useRouter();
  const qc = useQueryClient();
  const params = useSearchParams();
  const id = params.get('id');

  const idToNumber = Number(id);

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
      const response = await apiWhatsapp.patch(`lists-contacts/update/${idToNumber}`, newList);

      return response.data; 
    },
    onSuccess: (  ) => {
      qc.invalidateQueries({
        queryKey: ["lists"],
      });

      router.push("/lists");
    },
    onError: () => {
      toast.error(`Error ao atualizar. Tente novamente!`)
    },
  });

  return {
    handleCreateList,
    handleListNameChange,
    formState,
  };
};

const UpdateList = () => { 
  const { handleCreateList, formState, handleListNameChange } = useUpateList();

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="gap-0 flex flex-col mt-5 "> 
        <label
          htmlFor="listName"
          className={`${fontInter} text-sm font-medium text-gray-700`} 
        >
          Novo nome para lista
        </label>
        <input
          id="listName"
          placeholder="Digite um novo nome para a lista"
          value={formState?.listName || ""}
          onChange={handleListNameChange}
          className={`${fontInter} text-gray-800 border outline-none focus:ring-2 ring-indigo-500 border-gray-300 p-2 rounded-md shadow-sm`} // Estilo do input melhorado
        />
      </div>

      <Button
        type="button"
        className={`${fontInter} p-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md shadow hover:shadow-md transition-colors duration-150 ease-in-out`} // Estilo do botão melhorado
        onClick={() => handleCreateList.mutate()}
        disabled={handleCreateList.isPending}
      >
        {!handleCreateList.isPending && "Atualizar Lista"} 

        {handleCreateList.isPending && (
          <div className="flex gap-2 items-center justify-center"> 
            <SimpleLoader className="w-5 h-5" />
            <span className="">Atualizando...</span>
          </div>
        )}
      </Button>
    </div>
  );
};

export { UpdateList };
