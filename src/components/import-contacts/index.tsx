"use client";

import {
  contactsAtoms,
  IWhatsappToCreate,
} from "@/app/(private)/(all)/lists/atom";
import { SimpleLoader } from "@/components/simple-loader";
import { IContactEvolution } from "@/interfaces/IContactEvolution";
import { IGroupParticipant } from "@/interfaces/IParticipantEvoluition";
import { IWhatsappGroup } from "@/interfaces/IWhatsappGroup";
import { apiWhatsapp } from "@/utils/api";
import { fontInter, fontSaira } from "@/utils/fonts";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useAtom } from "jotai";
import { useState } from "react";
import { FaCheck, FaUser } from "react-icons/fa";
import { RiArrowRightSLine } from "react-icons/ri";

export type Option = "contacts" | "groups";

const areAllItemsIncluded = (
  smallerArray: { remoteJid: string }[],
  largerArray: IWhatsappToCreate[]
): boolean => {
  return smallerArray.every((smallItem) =>
    largerArray.some(
      (largeItem) => largeItem.phoneNumber === smallItem.remoteJid.split("@")[0]
    )
  );
};

const useImportsWhatsappByGroups = () => {
  const { data: groups, isLoading: loadingGroups } = useQuery<IWhatsappGroup[]>(
    {
      queryKey: ["contacts", "groups"],
      queryFn: async () =>
        (await apiWhatsapp.post("/contacts-evolution/groups"))?.data,
    }
  );

  return {
    groups,
    loadingGroups,
  };
};

const useImportsWhatsappByGroupsContact = (groupJid: string) => {
  const [selectedContacts, setSelectedContacts] = useAtom(contactsAtoms);

  const { data: contacts, isLoading } = useQuery({
    queryKey: ["contacts", "groups", groupJid],
    queryFn: async () => {
      const url = `/contacts-evolution/groups/participants/${groupJid}`;
      return (await apiWhatsapp.get<IGroupParticipant[]>(url))?.data;
    },
  });

  const selectedAll = contacts
    ? areAllItemsIncluded(
        contacts.map((d) => ({ remoteJid: d.id })),
        selectedContacts
      )
    : false;

  const selectAll = () => {
    setSelectedContacts((prev) => {
      if (!contacts?.length) return prev;

      const allSelected = contacts.every((c) =>
        prev.some((p) => p.phoneNumber === c?.id?.split("@")[0])
      );

      if (allSelected) {
        return prev.filter(
          (p) => !contacts.some((c) => c?.id?.split("@")[0] === p.phoneNumber)
        );
      } else {
        const newContacts = contacts
          .filter(
            (c) => !prev.some((p) => p.phoneNumber === c?.id?.split("@")[0])
          )
          .map((c) => ({
            name: c?.name || "",
            phoneNumber: c?.id?.split("@")[0],
          }));

        return [...prev, ...newContacts];
      }
    });
  };

  return {
    selectAll,
    selectedAll,
    contacts,
    isLoading,
  };
};

const useImportsWhatsappByContacts = () => {
  const [selectedContacts, setSelectedContacts] = useAtom(contactsAtoms);

  const { data: contacts, isLoading } = useQuery<IContactEvolution[]>({
    queryKey: ["contacts", "instance"],
    queryFn: async () => (await apiWhatsapp.post(`/contacts-evolution`))?.data,
  });

  const selectedAll = contacts
    ? areAllItemsIncluded(contacts, selectedContacts)
    : null;

  const selectAll = () => {
    setSelectedContacts((prev) => {
      if (!contacts?.length) return prev;

      const allSelected = contacts.every((c) =>
        prev.some((p) => p.phoneNumber === c?.remoteJid?.split("@")[0])
      );

      if (allSelected) {
        return prev.filter(
          (p) =>
            !contacts.some((c) => c?.remoteJid?.split("@")[0] === p.phoneNumber)
        );
      } else {
        const newContacts = contacts
          .filter(
            (c) =>
              !prev.some((p) => p.phoneNumber === c?.remoteJid?.split("@")[0])
          )
          .map((c) => ({
            name: c?.pushName || "",
            phoneNumber: c?.remoteJid?.split("@")[0],
          }));

        return [...prev, ...newContacts];
      }
    });
  };

  return {
    selectAll,
    selectedAll,
    contacts,
    isLoading,
  };
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

  return {
    utils: {
      addOrRemoveContact,
      selectedContacts,
    },
  };
};

export const ImportContacts = () => {
  const {
    utils: { addOrRemoveContact, selectedContacts },
  } = useImportWhatsapp();
  const { selectAll, selectedAll, contacts, isLoading } =
    useImportsWhatsappByContacts();

  if (isLoading) {
    return (
      <div className="p-10 grid place-items-center w-full min-h-[10rem]">
        <SimpleLoader className="border-t-indigo-500" />
      </div>
    );
  }

  if (!contacts) {
    return <div className="font-semibold my-6">Não há contatos</div>;
  }

  return (
    <>
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
      </section>

      <div className="bg-blue-50/40 border relative divide-y mt-2 rounded-xl max-h-[30rem] overflow-auto">
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
                  <img
                    alt=""
                    src={contact?.profilePicUrl}
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
    </>
  );
};

export const ImportGroups = () => {
  const { groups, loadingGroups } = useImportsWhatsappByGroups();

  if (loadingGroups) {
    return (
      <div className="grid min-h-[10rem] w-full place-items-center p-10">
        <SimpleLoader className="border-t-indigo-500" />
      </div>
    );
  }

  return (
    <div className="relative mt-2 max-h-[30rem] divide-y overflow-auto rounded-xl bg-blue-50/40 border">
      {groups?.map((group, idx) => (
        <GroupComponent group={group} key={idx} />
      ))}
    </div>
  );
};

const GroupComponent = ({ group }: { group: IWhatsappGroup }) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between gap-2 p-3">
        <div className="flex items-center gap-2">
          <div className="grid h-10 w-10 relative bg-white place-items-center overflow-hidden rounded-xl border-2">
            {group.pictureUrl ? (
              <img
                loading="lazy"
                onError={() => console.log("houve um erro ao carregar imagem")}
                src={group.pictureUrl}
                alt={group.subject.slice(0, 2)}
                style={{ objectFit: "cover" }}
              />
            ) : (
              <span className={`${fontSaira} font-semibold`}>
                {group.subject.slice(0, 1)}
              </span>
            )}
          </div>
          <span className={`${fontSaira} font-semibold`}>{group.subject}</span>
        </div>

        <div className="flex">
          <button
            type="button"
            data-open={open}
            onClick={() => setOpen((prev) => !prev)}
            className="w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300 transition-all opacity-90 hover:opacity-100 grid place-items-center
											data-[open=true]:rotate-90"
          >
            <RiArrowRightSLine size={20} />
          </button>
        </div>
      </div>

      {open && <ContactsOfGroups groupJid={group.id} />}
    </div>
  );
};

const ContactsOfGroups = ({ groupJid }: { groupJid: string }) => {
  const { utils } = useImportWhatsapp();
  const { addOrRemoveContact, selectedContacts } = utils;
  const { selectAll, isLoading, contacts, selectedAll } =
    useImportsWhatsappByGroupsContact(groupJid);

  if (isLoading) {
    return (
      <div className="p-3 flex gap-2 items-center">
        <div className="w-10 h-10 rounded-full bg-gray-300 animate-pulse"></div>
        <div className="flex flex-col gap-1">
          <span className="flex w-28 rounded h-5 bg-gray-300 animate-pulse"></span>
          <span className="flex w-16 rounded h-4 bg-gray-300 animate-pulse"></span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 divide-y shadow-inner bg-white">
      <div className="border-b p-4 flex gap-2 items-center">
        <button
          onClick={selectAll}
          type="button"
          data-selected={selectedAll}
          className="w-6 h-6 rounded-full bg-white text-white grid place-items-center border border-gray-200 data-[selected=true]:bg-indigo-500
									data-[selected=true]:border-indigo-500"
        >
          {selectedAll && <FaCheck size={10} />}
        </button>
        Selecionar todos os contatos
      </div>

      {contacts?.map((contact, idx) => {
        const selected = !!selectedContacts?.filter(
          (s) => s.phoneNumber === contact?.id.split("@")?.[0]
        )?.[0]?.phoneNumber;

        return (
          <div key={idx} className="flex gap-2 items-center p-2 px-4">
            <button
              onClick={() =>
                addOrRemoveContact({
                  phoneNumber: contact?.id,
                  name: contact.name || "",
                })
              }
              type="button"
              data-selected={selected}
              className="w-6 h-6 rounded-full bg-white text-white grid place-items-center border border-gray-200 data-[selected=true]:bg-indigo-500"
            >
              {selected && <FaCheck size={10} />}
            </button>
            <div className="w-10 h-10 bg-gray-200 grid place-items-center rounded-full relative overflow-hidden">
              {contact?.imgUrl && (
                <img
                  loading="lazy"
                  onError={() =>
                    console.log("houve um erro ao carregar imagem")
                  }
                  src={contact?.imgUrl}
                  style={{ objectFit: "cover" }}
                  alt=""
                />
              )}

              {!contact?.imgUrl && <FaUser className="opacity-60" />}
            </div>

            <span>{contact?.name || "sem nome"}</span>
          </div>
        );
      })}
    </div>
  );
};
