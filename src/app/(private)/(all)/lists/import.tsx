"use client";

import { CreateContact } from "@/components/create-list-contact/create-manual";
import { Modal } from "@/components/modal-base";
import { useImportByLabel, useWhatsappLabels } from "@/hooks/use-labels";
import { queryClient } from "@/providers/query-provider";
import { apiWhatsapp } from "@/utils/api";
import { fontSaira } from "@/utils/fonts";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import { IWhatsappToCreate } from "./atom";
import { ImportByFile } from "./import-contacts-file";
import { ImportWhatsapp } from "./import-contacts-whatsapp";

type Option = "whatsapp" | "file" | "manual" | "etiquetas";

export const useImportsContacts = () => {
  const params = useSearchParams();
  const listId = params?.get("id");
  const router = useRouter();

  const handleSubmit = useMutation({
    mutationFn: async (contacts: IWhatsappToCreate[]) => {
      if (!contacts?.length) throw new Error("Selecione ao menos 1 contato!");

      if (!listId) throw new Error("Precisa de uma lista para popular!");

      const response = await apiWhatsapp.post("/contacts/save", {
        listId,
        contacts,
      });

      return response.data;
    },
    onSuccess: async   () => {
      toast.success("Importação iniciada!");

      await queryClient.invalidateQueries({
        queryKey: ["lists"],
      });

      router.push("?");
    },
    onError: (err: AxiosError<{ message: string }>) => {
      toast.error(
        err?.response?.data?.message || "Houve um erro ao importar os contatos!"
      );
    },
  });

  return { handleSubmit };
};

const ImportByLabels = () => {
  const { labels } = useWhatsappLabels();
  const { importByLabelMutation } = useImportByLabel();
  const params = useSearchParams();
  const listId = params?.get("id");

  return (
    <div className="flex flex-col bg-gray-50 border mb-6 rounded-xl p-2">
      <header className="font-semibold text-lg">
        <h2 className={`${fontSaira}`}>Selecione por etiquetas</h2>
      </header>

      <div className="flex flex-wrap flex-1 gap-2">
        {labels?.map((label, idx) => {
          return (
            <button
              type="button"
              key={idx}
              onClick={async () =>
                importByLabelMutation.mutateAsync({
                  listId: Number(listId),
                  labelId: label.id,
                })
              }
              className="bg-indigo-200 rounded-xl text-indigo-950 px-3 p-2 font-semibold 
                shadow-[0px_4px_0px_rgba(70,70,70,1)]
                hover:translate-y-[2px] hover:shadow-[0px_2px_0px_rgba(70,70,70,1)] 
                active:translate-y-[4px] active:shadow-[0px_0px_0px_rgba(70,70,70,1),inset_0_2px_4px_rgba(129,140,248,0.5)] 
                transition-all border border-indigo-400/30"
            >
              <span className={`${fontSaira} font-semibold`}>
                {label?.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export const ImportContacts = () => {
  const [openOptions, setOpenOption] = useState<Option | null>(null);

  return (
    <Modal.container>
      <Modal.box className="rounded-3xl p-6 w-full bg-white max-w-full sm:max-w-[60rem] min-w-0 sm:min-w-[30rem]">
        <Modal.header title="Importar contatos" className="mb-5" />

        <section className="w-full border-zinc-200 flex flex-col sm:flex-row divide-y sm:divide-x sm:divide-y-0 mb-4">
          <div className="flex flex-col sm:flex-row p-2 rounded-lg bg-blue-50/50 w-full">
            <button
              type="button"
              onClick={() => setOpenOption("whatsapp")}
              data-selected={openOptions === "whatsapp"}
              className="p-2 sm:p-1 px-4 flex-1 flex items-center justify-center opacity-90 hover:opacity-100 data-[selected=true]:bg-blue-700/10 data-[selected=true]:cursor-default rounded-lg mb-2 sm:mb-0 sm:mr-2"
            >
              <span className={`${fontSaira} font-semibold text-indigo-950`}>
                Whatsapp
              </span>
            </button>

            <button
              type="button"
              onClick={() => setOpenOption("manual")}
              data-selected={openOptions === "manual"}
              className="p-2 sm:p-1 px-4 flex-1 flex items-center justify-center opacity-90 hover:opacity-100 data-[selected=true]:bg-blue-700/10 data-[selected=true]:cursor-default rounded-lg mb-2 sm:mb-0 sm:mr-2"
            >
              <span className={`${fontSaira} font-semibold text-indigo-950`}>
                Manual
              </span>
            </button>

            <button
              type="button"
              onClick={() => setOpenOption("file")}
              data-selected={openOptions === "file"}
              className="p-2 sm:p-1 px-4 flex-1 flex items-center justify-center opacity-90 hover:opacity-100 data-[selected=true]:bg-blue-700/10 data-[selected=true]:cursor-default rounded-lg"
            >
              <span className={`${fontSaira} font-semibold text-gray-700`}>
                .csv ou .xlsx
              </span>
            </button>

            <button
              type="button"
              onClick={() => setOpenOption("etiquetas")}
              data-selected={openOptions === "etiquetas"}
              className="p-2 sm:p-1 px-4 flex-1 flex items-center justify-center opacity-90 hover:opacity-100 data-[selected=true]:bg-blue-700/10 data-[selected=true]:cursor-default rounded-lg"
            >
              <span className={`${fontSaira} font-semibold text-gray-700`}>
                Etiquetas
              </span>
            </button>
          </div>
        </section>

        {openOptions === "whatsapp" && <ImportWhatsapp />}
        {openOptions === "file" && <ImportByFile />}
        {openOptions === "manual" && <CreateContact />}
        {openOptions === "etiquetas" && <ImportByLabels />}
      </Modal.box>
    </Modal.container>
  );
};
