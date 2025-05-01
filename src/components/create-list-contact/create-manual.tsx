"use client";

import { Button } from "@/components/ui/button";
import { fontInter } from "@/utils/fonts";
import { useAtom } from "jotai";
import { contactsAtoms } from "@/app/(private)/(all)/lists/atom";
import { SimpleLoader } from "../simple-loader";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/providers/query-provider";
import { useState } from "react";
import { formatNumber } from "@/utils/format-number";
import PhoneInput from "../input-number";

const validatePhoneNumber = (number: string) => {
    const digits = number.replace(/\D/g, '');
    return digits.length >= 11;
};

const useSaveContact = () => {
    const [contacts, setContacts] = useAtom(contactsAtoms);

    const [formState, setFormState] = useState({
        name: "",
        phoneNumber: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);



    const saveContactMutation = useMutation({
        mutationFn: async () => {
            setIsSubmitting(true);

            if (!formState.name.trim() || !formState.phoneNumber.trim())
                throw new Error("Preencha todos os campos!");


            const phoneDigits = formState.phoneNumber.replace(/\D/g, '');
            if (phoneDigits.length < 11)
                throw new Error("Número de telefone inválido!");


            return {
                name: formState.name.trim(),
                phoneNumber: phoneDigits.trim(),
            };
        },
        onSuccess: async (newContact) => {
            setContacts([...contacts, newContact]);
            setFormState({ name: "", phoneNumber: "" });

            toast.success(
                <div
                    className="cursor-pointer p-2"
                    onClick={() => {
                        document.getElementById('import-button')?.scrollIntoView({ behavior: 'smooth' });
                        toast.dismiss();
                    }}
                >
                    Contato adicionado! <u>Clique aqui</u> para ir ao botão de Importar
                </div>,
                {
                    autoClose: 5000,
                    closeButton: true,
                }
            );

            await queryClient.invalidateQueries({ queryKey: ['lists'] });

            setTimeout(() => {
                const nameInput = document.getElementById('name');
                if (nameInput) nameInput.focus();
            }, 100);
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
        onSettled: () => {
            setIsSubmitting(false);
        },
    });

    return { saveContactMutation, formState, setFormState, isSubmitting };
};



const CreateContact = () => {
    const { saveContactMutation, formState, setFormState, isSubmitting } = useSaveContact();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.name === 'phoneNumber') {
            const formattedValue = formatNumber(e.target.value);
            setFormState({
                ...formState,
                [e.target.name]: formattedValue,
            });
        } else {
            setFormState({
                ...formState,
                [e.target.name]: e.target.value,
            });
        }
    };



    const isFormValid = formState.name.trim() && validatePhoneNumber(formState.phoneNumber);

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
                {formState.phoneNumber && !validatePhoneNumber(formState.phoneNumber) && (
                    <p className="text-red-500 text-xs mt-1">Número incompleto</p>
                )}
            </div>

            <Button
                type="button"
                className={`${fontInter} p-6 bg-indigo-500 hover:bg-indigo-700 text-white w-2xs transition-all`}
                onClick={() => saveContactMutation.mutate()}
                disabled={isSubmitting || !isFormValid}
            >
                {!isSubmitting && (
                    isFormValid ? "Salvar Contato" : "Preencha os campos corretamente"
                )}

                {isSubmitting && (
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