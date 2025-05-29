"use client";

import { IWhatsappToCreate } from "@/app/(private)/(all)/lists/atom";
import { useImportsContacts } from "@/app/(private)/(all)/lists/import";
import { SimpleLoader } from "@/components/simple-loader";
import { IGroupParticipant } from "@/interfaces/IParticipantEvoluition";
import { IWhatsappGroup } from "@/interfaces/IWhatsappGroup";
import { apiWhatsapp } from "@/utils/api";
import { fontSaira } from "@/utils/fonts";
import { useQuery } from "@tanstack/react-query";
import { atom, useAtom } from "jotai";
import { useState } from "react";
import { FaCheck, FaUser } from "react-icons/fa";
import { RiArrowRightSLine } from "react-icons/ri";
import { ButtonSubmit } from "./button-submit";
import { addOrRemoveContact, areAllItemsIncluded } from "./utils";

export type Option = "contacts" | "groups";

const selectedContactsAtom = atom<IWhatsappToCreate[]>([]);

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
  const [selectedContacts, setSelectedContacts] =
    useAtom<IWhatsappToCreate[]>(selectedContactsAtom);

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
    selectedContacts,
    setSelectedContacts,
  };
};

export const ImportGroups = () => {
  const { groups, loadingGroups } = useImportsWhatsappByGroups();
  const { handleSubmit } = useImportsContacts();
  const [selectedContacts] = useAtom<IWhatsappToCreate[]>(selectedContactsAtom);

  if (loadingGroups) {
    return (
      <div className="grid min-h-[10rem] w-full place-items-center p-10">
        <SimpleLoader className="border-t-indigo-500" />
      </div>
    );
  }

  return (
    <form
      className="flex flex-col"
      onSubmit={async (e) => {
        e.preventDefault();
        await handleSubmit.mutateAsync(selectedContacts);
      }}
    >
      <div className="relative mt-2 mb-2 max-h-[30rem] divide-y overflow-auto rounded-xl bg-blue-50/40 border">
        {groups?.map((group, idx) => (
          <GroupComponent group={group} key={idx} />
        ))}
      </div>

      <div>
        <ButtonSubmit isPending={handleSubmit.isPending} />
      </div>
    </form>
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
  const {
    selectAll,
    isLoading,
    contacts,
    selectedContacts,
    setSelectedContacts,
    selectedAll,
  } = useImportsWhatsappByGroupsContact(groupJid);

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
                addOrRemoveContact(
                  {
                    phoneNumber: contact?.id,
                    name: contact.name || "",
                  },
                  setSelectedContacts
                )
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
