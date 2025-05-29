"use client";

import { ImportGroups } from "@/components/import-contacts/import-by-groups";
import { ImportContactsByRecentChats } from "@/components/import-contacts/import-by-chats";
import { useState } from "react";
import { ImportContacts } from "@/components/import-contacts/import-by-contacts";

export type Option = "contacts" | "groups" | "chats";

export const ImportWhatsapp = () => {
  const [option, setOption] = useState<Option>("contacts");

  return (
    <div className="flex flex-col gap-2">
      <header className="flex gap-2">
        <input
          type="text"
          placeholder="Pequise aqui..."
          className="p-2 border rounded-lg border-zinc-200 bg-white outline-none flex flex-1"
        />
      </header>

      <section className="flex items-center gap-4 justify-between">
        <div className="font-semibold"></div>
        <div className="flex gap-2 items-center rounded-xl border border-zinc-200 p-1">
          <button
            onClick={() => setOption("contacts")}
            type="button"
            data-selected={option === "contacts"}
            className="flex px-2 p-1 font-semibold data-[selected=true]:bg-gray-100 rounded-lg opacity-90 data-[selected=true]:opacity-100 hover:opacity-100"
          >
            Contatos
          </button>

          <button
            onClick={() => setOption("chats")}
            type="button"
            data-selected={option === "chats"}
            className="flex px-2 p-1 font-semibold data-[selected=true]:bg-gray-100 rounded-lg opacity-90 data-[selected=true]:opacity-100 hover:opacity-100"
          >
            Recentes
          </button>

          <button
            onClick={() => setOption("groups")}
            type="button"
            data-selected={option === "groups"}
            className="flex px-2 p-1 font-semibold data-[selected=true]:bg-gray-100 rounded-lg opacity-90 data-[selected=true]:opacity-100 hover:opacity-100"
          >
            Grupos
          </button>
        </div>
      </section>

      {option === "contacts" && <ImportContacts />}
      {option === "chats" && <ImportContactsByRecentChats />}
      {option === "groups" && <ImportGroups />}
    </div>
  );
};
