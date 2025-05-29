"use client";

import { IWhatsappToCreate } from "@/app/(private)/(all)/lists/atom";
import { SimpleLoader } from "@/components/simple-loader";
import { IContactEvolution } from "@/interfaces/IContactEvolution";
import { apiWhatsapp } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import { useVirtualizer } from "@tanstack/react-virtual";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { FaCheck, FaUser } from "react-icons/fa";
import { addOrRemoveContact, areAllItemsIncluded } from "./utils";
import { useImportsContacts } from "@/app/(private)/(all)/lists/import";
import { ButtonSubmit } from "./button-submit";

const useImportsWhatsappByContacts = () => {
  const [selectedContacts, setSelectedContacts] = useState<IWhatsappToCreate[]>(
    []
  );

  const listId = useSearchParams().get("id") || null;

  const { data: contacts, isLoading } = useQuery<IContactEvolution[]>({
    queryKey: ["contacts", "instance", listId],
    enabled: !!listId,
    queryFn: async () =>
      (await apiWhatsapp.post(`/contacts-evolution/${listId}`))?.data,
  });

  useEffect(() => {
    if (contacts?.length) {
      const allContacts = contacts.map((contact) => ({
        name: contact?.pushName || "Sem nome",
        phoneNumber: contact?.remoteJid?.split("@")[0] || "",
      }));
      
      setSelectedContacts(allContacts);
    }
  }, [contacts]);

  const selectedAll = contacts
    ? areAllItemsIncluded(contacts, selectedContacts)
    : null;

  const selectAll = useCallback(() => {
    if (!contacts?.length) return;

    setSelectedContacts((prev) => {
      const allContactIds = contacts.map((c) => c?.remoteJid?.split("@")[0]);

      // Verifica se todos já estão selecionados
      const allSelected = allContactIds.every((id) =>
        prev.some((p) => p.phoneNumber === id)
      );

      if (allSelected) {
        // Desseleciona todos
        return prev.filter((p) => !allContactIds.includes(p.phoneNumber));
      } else {
        // Seleciona todos os não selecionados
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

  return {
    selectAll,
    selectedAll,
    contacts,
    selectedContacts,
    isLoading,
    setSelectedContacts,
  };
};

const ContactItem = React.memo(
  ({
    contact,
    isSelected,
    onClick,
  }: {
    contact: IContactEvolution;
    isSelected: boolean;
    onClick: () => void;
  }) => {
    const phoneNumber = contact.remoteJid?.split("@")?.[0];

    return (
      <div className="flex gap-2 items-center p-2 px-4 border-b h-[64px]">
        <button
          className="w-6 h-6 bg-white border border-zinc-200 rounded-lg data-[selected=true]:bg-indigo-600
																		data-[selected=true]:border-indigo-500 grid place-items-center"
          data-selected={isSelected}
          type="button"
          onClick={onClick}
        >
          <div
            data-selected={isSelected}
            className="data-[selected=true]:flex hidden"
          >
            <FaCheck className="text-white" size={10} />
          </div>
        </button>

        <div className="relative grid place-items-center shadow-inner w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
          {contact?.profilePicUrl ? (
            <img
              alt=""
              src={contact.profilePicUrl}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover"
            />
          ) : (
            <FaUser />
          )}
        </div>

        <div className="font-saira flex-1 font-semibold flex flex-col">
          <span>{contact?.pushName || "Sem nome"}</span>
          <span className="text-xs opacity-60">{phoneNumber}</span>
        </div>
      </div>
    );
  }
);
ContactItem.displayName = "ContactItem";

export const ImportContacts = () => {
  const parentRef = useRef<HTMLDivElement>(null);
  const {
    selectAll,
    selectedAll,
    selectedContacts,
    contacts,
    setSelectedContacts,
    isLoading,
  } = useImportsWhatsappByContacts();

  const { handleSubmit } = useImportsContacts();

  const rowVirtualizer = useVirtualizer({
    count: contacts?.length || 0,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 64, // Ajustado para a altura aproximada de cada item
    overscan: 3,
  });

  const { contactsWithSelection } = useMemo(() => {
    const map = new Map(
      selectedContacts?.map((s) => [s.phoneNumber, true]) || []
    );
    const processed =
      contacts?.map((contact) => {
        const phone = contact.remoteJid?.split("@")?.[0];
        return {
          ...contact,
          phoneNumber: phone,
          isSelected: map.has(phone),
        };
      }) || [];
    return { contactsWithSelection: processed, selectedMap: map };
  }, [contacts, selectedContacts]);

  if (isLoading) {
    return (
      <div className="p-10 grid place-items-center w-full min-h-[10rem]">
        <SimpleLoader className="border-t-indigo-500" />
      </div>
    );
  }

  if (!contacts || contacts.length === 0) {
    return <div className="font-semibold my-6">Não há contatos</div>;
  }

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        await handleSubmit.mutateAsync(selectedContacts);
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

      <div
        ref={parentRef}
        className="bg-blue-50/40 border relative mt-2 rounded-xl max-h-[30rem] overflow-auto"
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            position: "relative",
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualItem) => {
            const contact = contactsWithSelection[virtualItem.index];

            return (
              <div
                key={virtualItem.key}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: `${virtualItem.size}px`,
                  transform: `translateY(${virtualItem.start}px)`,
                }}
              >
                <ContactItem
                  contact={contact}
                  isSelected={contact.isSelected}
                  onClick={() =>
                    addOrRemoveContact(
                      {
                        name: contact.pushName,
                        phoneNumber: contact.phoneNumber,
                      },
                      setSelectedContacts
                    )
                  }
                />
              </div>
            );
          })}
        </div>
      </div>

      <ButtonSubmit isPending={handleSubmit.isPending} />
    </form>
  );
};
