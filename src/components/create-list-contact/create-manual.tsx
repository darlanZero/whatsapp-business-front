"use client";

import { IWhatsappToCreate } from "@/app/(private)/(all)/lists/atom";
import { Button } from "@/components/ui/button";
import { apiWhatsapp } from "@/utils/api";
import { fontInter } from "@/utils/fonts";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import PhoneInput from "../input-number";
import { SimpleLoader } from "../simple-loader";

const validatePhoneNumber = (number: string) => {
  const digits = number.replace(/\D/g, "");
  return digits.length >= 10;
};

const useSaveContact = () => {
  const params = useSearchParams();
  const listId = params?.get("id");

  const [formState, setFormState] = useState({
    name: "",
    phoneNumber: "",
  });

  const saveContactMutation = useMutation({
    mutationFn: async () => {
      if (!formState.name.trim() || !formState.phoneNumber.trim())
        throw new Error("Preencha todos os campos!");

      const validNumber = validatePhoneNumber(formState.phoneNumber);
      if (!validNumber) {
        throw new Error("Número de telefone inválido!");
      }

      const digits = formState.phoneNumber.replace(/\D/g, "");

      const contactsToCreate = [
        { name: formState.name, phoneNumber: digits },
      ] satisfies IWhatsappToCreate[];

      const res = await apiWhatsapp.post("/contacts/save", {
        contacts: contactsToCreate,
        listId: listId,
      });

      return res;
    },
    onSuccess: () => {
      toast.success("Importado com sucesso!");
      setFormState({ name: "", phoneNumber: "" });
      // await queryClient.invalidateQueries({ queryKey: ["lists"] });
    },
    onError: (error: Error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message);
      } else {
        toast.error(
          "Houve um erro interno no servidor, tente novamente mais tarde!"
        );
      }
    },
  });

  return { saveContactMutation, formState, setFormState };
};

const CreateContact = () => {
  const { saveContactMutation, formState, setFormState } = useSaveContact();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };

  const isFormValid =
    formState.name.trim() && validatePhoneNumber(formState.phoneNumber);

  return (
    <div className="flex flex-col gap-4 w-full p-6 bg-blue-50/40 rounded-2xl my-5">
      <div className="gap-0 flex flex-col mt-5">
        <label
          htmlFor="name"
          className={`${fontInter} text-sm font-medium text-gray-900`}
        >
          Nome do Contato
        </label>
        <input
          id="name"
          name="name"
          placeholder="Digite o nome do contato..."
          value={formState.name}
          onChange={handleInputChange}
          className={`${fontInter} text-gray-800 border outline-none focus:ring-2 ring-indigo-500 border-zinc-200 p-2 rounded-md`}
          autoFocus
        />
      </div>

      <div className="gap-0 flex flex-col">
        <label
          htmlFor="phoneNumber"
          className={`${fontInter} text-sm font-medium text-gray-900`}
        >
          Número de Celular
        </label>
        <PhoneInput
          id="phoneNumber"
          name="phoneNumber"
          placeholder="(00) 00000-0000"
          value={formState.phoneNumber}
          onChange={handleInputChange}
          maxLength={15}
          className={`${fontInter} text-gray-800 border outline-none focus:ring-2 ring-indigo-500 border-zinc-200 p-2 rounded-md`}
        />
        {formState.phoneNumber &&
          !validatePhoneNumber(formState.phoneNumber) && (
            <p className="text-red-500 text-xs mt-1">Número incompleto</p>
          )}
      </div>

      <Button
        type="button"
        className={`${fontInter} p-6 bg-indigo-500 hover:bg-indigo-700 text-white w-2xs transition-all`}
        onClick={() => saveContactMutation.mutate()}
        disabled={saveContactMutation.isPending || !isFormValid}
      >
        {!saveContactMutation.isPending &&
          (isFormValid ? "Salvar Contato" : "Preencha os campos corretamente")}

        {saveContactMutation.isPending && (
          <div className="flex gap-2 items-center">
            <SimpleLoader className="w-5 h-5" />
            <span className="">Salvando...</span>
          </div>
        )}
      </Button>
    </div>
  );
};

export { CreateContact };
