"use client";

import { Modal } from "@/components/modal-base";
import { fontSaira } from "@/utils/fonts";
import { useState } from "react";
import { ImportCSV } from "./import-contacts-file";
import { ImportWhatsapp } from "./import-contacts-whatsapp";
import { useMutation } from "@tanstack/react-query";
import { apiWhatsapp } from "@/utils/api";
import { useAtom } from "jotai";
import { contactsAtoms } from "./atom";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { CreateContact } from "@/components/create-list-contact/create-manual";
import { SimpleLoader } from "@/components/simple-loader";
import { formatNumber } from "@/utils/format-number";

type Option = "whatsapp" | ".csv" | "manual";

const useImportsContacts = () => {
  const [contacts, setContacts] = useAtom(contactsAtoms);
  const params = useSearchParams();
  const listId = params?.get("id");

  const handleSubmit = useMutation({
    mutationFn: async () => {
      if (!contacts?.length) throw new Error("Selecione ao menos 1 contato!");
      if (!listId) throw new Error("Precisa de uma lista para popular!");

      const response = await apiWhatsapp.post("/contacts/save", {
        listId,
        contacts,
      });

      return response.data;
    },
    onSuccess: () => {
      setContacts([]);
      toast.success(
        <div className="p-2">
          <p className="font-semibold">{contacts.length} contatos importados com sucesso!</p>
          <p className="text-sm">A lista foi atualizada.</p>
        </div>,
        { autoClose: 2500 }
      );
    },
    onError: (err: Error) => {
      toast.error(err?.message || "Houve um erro ao importar os contatos!");
    },
  });

  return { handleSubmit };
};

const ContactItem = ({ name, phoneNumber }: { name: string; phoneNumber: string }) => {
  const formattedPhone = formatNumber(phoneNumber);

  return (
    <div className="flex justify-between p-2 even:bg-blue-50 items-center">
      <span className="truncate max-w-[120px] sm:max-w-[180px]">{name}</span>
      <span className="text-gray-600 text-sm">{formattedPhone}</span>
    </div>
  );
};

export const ImportContacts = () => {
  const [openOptions, setOpenOption] = useState<Option>("whatsapp");
  const { handleSubmit } = useImportsContacts();
  const [contacts] = useAtom(contactsAtoms);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleImport = () => {
    if (contacts.length > 10) {
      setShowConfirm(true);
    } else {
      handleSubmit.mutate();
    }
  };

  return (
    <Modal.container>
      <Modal.form className="rounded-2xl p-4 w-full max-w-full sm:max-w-[60rem] min-w-0 sm:min-w-[30rem]">
        <Modal.header title="Importar contatos" />

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
              onClick={() => setOpenOption(".csv")}
              data-selected={openOptions === ".csv"}
              className="p-2 sm:p-1 px-4 flex-1 flex items-center justify-center opacity-90 hover:opacity-100 data-[selected=true]:bg-blue-700/10 data-[selected=true]:cursor-default rounded-lg"
            >
              <span className={`${fontSaira} font-semibold text-gray-700`}>
                .csv
              </span>
            </button>
          </div>
        </section>

        {openOptions === "whatsapp" && <ImportWhatsapp />}
        {openOptions === ".csv" && <ImportCSV />}
        {openOptions === "manual" && <CreateContact />}

        <section className="mt-4 max-h-60 sm:max-h-40 overflow-y-auto border rounded-lg">
          <h3 className={`${fontSaira} font-semibold p-2 bg-gray-50 text-gray-800 border-b text-sm sm:text-base`}>
            Contatos a serem importados: {contacts.length}
          </h3>
          <div className="divide-y text-gray-700">
            {contacts.length > 0 ? (
              contacts.map((contact, index) => (
                <ContactItem
                  key={index}
                  name={contact.name}
                  phoneNumber={contact.phoneNumber}
                />
              ))
            ) : (
              <p className="text-gray-700 text-center p-4 text-sm sm:text-base">Nenhum contato adicionado ainda</p>
            )}
          </div>
        </section>

        <footer className="flex justify-end mt-4">
          <button
            id="import-button"
            type="button"
            onClick={handleImport}
            disabled={contacts.length === 0 || handleSubmit.isPending}
            className={`p-3 px-4 sm:px-6 rounded-lg transition-all flex items-center gap-2 ${fontSaira} font-medium
                            ${contacts.length > 0 && !handleSubmit.isPending
                ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow hover:shadow-md"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"}`}
          >
            {handleSubmit.isPending ? (
              <> 
                <SimpleLoader className="w-5 h-5" />
                <span className="text-sm sm:text-base">Importando...</span>
              </>
            ) : (
              <span className="text-sm sm:text-base">Importar {contacts.length > 0 ? `(${contacts.length})` : ''}</span>
            )}
          </button>
        </footer>

        {showConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-4 sm:p-6 rounded-lg max-w-full sm:max-w-md w-full">
              <h3 className={`${fontSaira} font-semibold text-base sm:text-lg mb-3 sm:mb-4`}>Confirmar Importação</h3>
              <p className="mb-3 sm:mb-4 text-sm sm:text-base">
                Você está prestes a importar <strong>{contacts.length} contatos</strong>.
                Deseja continuar?
              </p>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-end">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50 w-full sm:w-auto"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    setShowConfirm(false);
                    handleSubmit.mutate();
                  }}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 w-full sm:w-auto"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal.form>
    </Modal.container>
  );
};
