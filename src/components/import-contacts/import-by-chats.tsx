import { IContactEvolution } from "@/interfaces/IContactEvolution";
import { apiWhatsapp } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { FaCheck, FaUser } from "react-icons/fa";
import { addOrRemoveContact, areAllItemsIncluded } from "./utils";
import { IWhatsappToCreate } from "@/app/(private)/(all)/lists/atom";
import { motion } from "framer-motion";
import { ButtonSubmit } from "./button-submit";
import { useImportsContacts } from "@/app/(private)/(all)/lists/import";

const useImportContactsByRecentsChats = () => {
  const [contactsSelected, setContactsSelected] = useState<IWhatsappToCreate[]>(
    []
  );

  console.log(contactsSelected);

  const listId = useSearchParams().get("id") || null;

  const { data: contacts, isLoading } = useQuery({
    queryKey: ["contacts", "chats", listId],
    enabled: !!listId,
    queryFn: async () => {
      const url = `/contacts-evolution/chats/${listId}`;
      return (await apiWhatsapp.get<IContactEvolution[]>(url))?.data;
    },
  });

  useEffect(() => {
    if (contacts?.length) {
      const allContacts = contacts.map((contact) => ({
        name: contact?.pushName || "Sem nome",
        phoneNumber: contact?.remoteJid?.split("@")[0] || "",
      }));

      setContactsSelected(allContacts);
    }
  }, [contacts]);

  const selectedAll = contacts
    ? areAllItemsIncluded(contacts, contactsSelected)
    : null;

  const selectAll = useCallback(() => {
    if (!contacts?.length) return;

    setContactsSelected((prev) => {
      const allContactIds = contacts.map((c) => c?.remoteJid?.split("@")[0]);

      const allSelected = allContactIds.every((id) =>
        prev.some((p) => p.phoneNumber === id)
      );

      if (allSelected) {
        return prev.filter((p) => !allContactIds.includes(p.phoneNumber));
      } else {
        const newSelections = contacts
          .filter(
            (c) =>
              !prev.some((p) => p.phoneNumber === c?.remoteJid?.split("@")[0])
          )
          .map((c) => ({
            name: c?.pushName || "Sem nome",
            phoneNumber: c?.remoteJid?.split("@")[0] || "",
          }));

        return [...prev, ...newSelections];
      }
    });
  }, [contacts]);

  const addOrRemoveContactHandle = (contact: IWhatsappToCreate) => {
    addOrRemoveContact(contact, setContactsSelected);
  };

  return {
    contacts,
    isLoading,
    contactsSelected,
    utils: {
      selectAll,
      addOrRemoveContactHandle,
      selectedAll,
    },
  };
};

export const ImportContactsByRecentChats = () => {
  const props = useImportContactsByRecentsChats();
  const { handleSubmit } = useImportsContacts();
  const { isLoading, contactsSelected, contacts, utils } = props;
  const { selectedAll, selectAll, addOrRemoveContactHandle } = utils;

  if (isLoading) {
    return "loading...";
  }

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        await handleSubmit.mutateAsync(contactsSelected);
      }}
    >
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
          <span className="font-inter">Selecionar todos</span>
        </div>
      </section>

      <div className="bg-blue-50/40 border relative mt-2 rounded-xl max-h-[30rem] overflow-auto">
        <div>
          {contacts?.map((contact, idx) => {
            const selected = !!contactsSelected?.find(
              (s) => s.phoneNumber === contact?.remoteJid.split("@")?.[0]
            );

            return (
              <div
                key={idx}
                className="flex gap-2 items-center p-2 px-4 border-b"
              >
                <button
                  className="w-6 h-6 bg-white border border-zinc-200 rounded-lg data-[selected=true]:bg-indigo-600
                    data-[selected=true]:border-indigo-500 grid place-items-center"
                  data-selected={selected}
                  type="button"
                  onClick={() =>
                    addOrRemoveContactHandle({
                      phoneNumber: contact.remoteJid?.split("@")?.[0],
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
                  {contact?.profilePicUrl ? (
                    <img
                      alt=""
                      src={contact.profilePicUrl}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FaUser />
                  )}
                </div>

                <div className="font-saira flex-1 font-semibold flex flex-col">
                  <span>{contact?.pushName || "Sem nome"}</span>
                  <span className="text-xs opacity-60">
                    {contact?.remoteJid}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <ButtonSubmit isPending={handleSubmit.isPending} />
    </form>
  );
};
