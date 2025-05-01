"use client";

import { Loader } from "@/components/loader";
import { IContactEvolution } from "@/interfaces/IContactEvolution";
import { apiWhatsapp } from "@/utils/api";
import { fontInter, fontSaira } from "@/utils/fonts";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useAtom } from "jotai";
import Image from "next/image";
import { FaCheck, FaUser } from "react-icons/fa";
import { IWhatsappToCreate, contactsAtoms } from "./atom";

const areAllItemsIncluded = (
  smallerArray: IContactEvolution[],
  largerArray: IWhatsappToCreate[]
): boolean => {
  return smallerArray.every((smallItem) =>
    largerArray.some(
      (largeItem) => largeItem.phoneNumber === smallItem.remoteJid.split("@")[0]
    )
  );
};

const useImportWhatsapp = () => {
  const [selectedContacts, setSelectedContacts] = useAtom(contactsAtoms);

  const addOrRemoveContact = (data: IWhatsappToCreate) => {
    setSelectedContacts((prev) => {
      const currentContacts = prev || [];

      const existingIndex = currentContacts.findIndex(
        (c) => c.phoneNumber === data?.phoneNumber.split("@")?.[0]
      );

      if (existingIndex >= 0) {
        return [
          ...currentContacts.slice(0, existingIndex),
          ...currentContacts.slice(existingIndex + 1),
        ];
      }

      return [
        ...currentContacts,
        {
          name: data.name,
          phoneNumber: data?.phoneNumber.split("@")?.[0],
        },
      ];
    });
  };

  const { data: contacts, isLoading } = useQuery<IContactEvolution[]>({
    queryKey: ["contacts", "instance"],
    queryFn: async () => (await apiWhatsapp.post(`/contacts-evolution`))?.data,
  });

  const selectAll = () => {
    setSelectedContacts((prev) => {
      if (!contacts?.length) return prev;

      const newContacts = contacts
        .filter(
          (contact) => !prev.some((p) => p.phoneNumber === contact.remoteJid.split("@")[0])
        )
        .map((c) => ({
          name: c.pushName,
          phoneNumber: c.remoteJid.split("@")[0],
        }));

      return [...prev, ...newContacts];
    });
  };

  return {
    contacts,
    isLoading,
    utils: {
      selectAll,
      addOrRemoveContact,
      selectedContacts,
    },
  };
};

export const ImportWhatsapp = () => {
  const { contacts, isLoading, utils } = useImportWhatsapp();
  const { selectAll, addOrRemoveContact, selectedContacts } = utils;

  if (isLoading) {
    return (
      <div className="p-10">
        <Loader className="text-gray-600" />
      </div>
    );
  }

  if (!contacts) {
    return <div className="font-semibold my-6">Não há contatos</div>;
  }

  const selectedAll = areAllItemsIncluded(contacts, selectedContacts);

  return (
    <div className="flex flex-col gap-2 mt-4">
      <header className="flex gap-2">
        <input
          type="text"
          placeholder="Pequise aqui..."
          className="p-2 border rounded-lg border-zinc-200 bg-white outline-none flex flex-1"
        />
      </header>

      <section className="flex mt-5 justify-between">
        <div className="flex gap-2 items-center">
          <button
            onClick={selectAll}
            data-selected={selectedAll}
            className="w-6 h-6 bg-white border border-zinc-200 rounded-lg data-[selected=true]:bg-indigo-600 data-[selected=true]:border-indigo-500 grid place-items-center"
            type="button"
          >
            {selectedAll && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <FaCheck className="text-white" size={10} />
              </motion.div>
            )}
          </button>

          <span className={fontInter}>Selecionar todos</span>
        </div>

        <div className="font-semibold">{selectedContacts?.length} Contatos</div>
      </section>

      <div className="bg-blue-50/20 relative border divide-y mt-2 rounded-xl max-h-[30rem] overflow-auto">
        {contacts?.map((contact, index) => {
          const selected = !!selectedContacts?.filter(
            (s) => s.phoneNumber === contact?.remoteJid.split("@")?.[0]
          )?.[0]?.phoneNumber;

          return (
            <div key={index} className="flex gap-2 items-center p-2 px-4">
              <button
                className="w-6 h-6 bg-white border border-zinc-200 rounded-lg data-[selected=true]:bg-indigo-600
                data-[selected=true]:border-indigo-500 grid place-items-center"
                data-selected={selected}
                type="button"
                onClick={() =>
                  addOrRemoveContact({
                    phoneNumber: contact?.remoteJid,
                    name: contact?.pushName,
                  })
                }
              >
                {selected && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <FaCheck className="text-white" size={10} />
                  </motion.div>
                )}
              </button>

              <div className="relative grid place-items-center shadow-inner w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                {contact?.profilePicUrl && (
                  <Image
                    src={contact?.profilePicUrl}
                    alt=""
                    fill
                    quality={20}
                    style={{ objectFit: "cover" }}
                  />
                )}

                {!contact?.profilePicUrl && <FaUser />}
              </div>
              <div
                className={`${fontSaira} flex-1 font-semibold flex flex-col`}
              >
                <span>{contact?.pushName || "Sem nome"}</span>
                <span className="text-xs opacity-60">{contact?.remoteJid}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
