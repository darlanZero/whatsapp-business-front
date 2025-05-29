"use client";

import { UserContext } from "@/contexts/user-context";
import { IWhatsapp } from "@/interfaces/IWhatsapp";
import { UserRole } from "@/interfaces/user-role";
import { apiWhatsapp } from "@/utils/api";
import { fontInter, fontSaira } from "@/utils/fonts";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { HiCloudUpload } from "react-icons/hi";
import { IoIosArrowDown } from "react-icons/io";
import { IoAlertCircle } from "react-icons/io5";

type ResponseAdminWhatsapps = {
  total: number;
  whatsapps: IWhatsapp[];
};

const useWhatsapps = () => {
  const { informations } = useContext(UserContext);

  const { data: whatsappAdmin } = useQuery<ResponseAdminWhatsapps>({
    queryKey: ["whatsapp", "admin"],
    queryFn: async () => {
      const url = `/whatsapp/list`;
      return (await apiWhatsapp.get<ResponseAdminWhatsapps>(url))?.data;
    },
    enabled:
      informations?.role === UserRole.ADMIN ||
      informations?.role === UserRole.GESTOR,
  });

  const { data: whatsappClient } = useQuery<IWhatsapp>({
    queryKey: ["whatsapp", "client"],
    enabled: informations?.role === UserRole.CLIENT,
    queryFn: async () =>
      (await apiWhatsapp.get<IWhatsapp>("/whatsapp/instance/my-whatsapp"))?.data,
  });

  return {
    whatsapps: {
      client: whatsappClient,
      admin: whatsappAdmin,
    },
  };
};

export default function Contacts() {
  const { whatsapps } = useWhatsapps();
  const { client, admin } = whatsapps;

  const router = useRouter();

  const instance = client?.instanceName || admin?.whatsapps?.[0]?.instanceName;

  return (
    <div className="flex flex-col gap-2 bg-white/70 border rounded-xl text-gray-500">
      <header className="flex gap-2 p-5 border-b">
        <input
          type="text"
          placeholder="Pequise aqui..."
          className="p-2 border rounded bg-white outline-none flex flex-1"
        />

        <button className="p-2 min-w-[10rem] flex hover:bg-zinc-100/90 items-center rounded-lg bg-gray-50 font-semibold capitalize border gap-2 justify-between">
          {instance || "Nenhuma instancia selecionada"}
          <IoIosArrowDown size={18} className="w-10" />
        </button>

        {instance && (
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={() => router.push(`?modal=import&instance=${instance}`)}
            type="button"
            className="p-3 overflow-hidden relative px-5 bg-indigo-500 shadow-md shadow-indigo-500/30 text-indigo-100 rounded-xl
              before:content-[''] before:bg-indigo-600/40 before:w-50 before:h-50 before:absolute before:top-0 before:left-[50%] before:rotate-[-45deg] 
              before:z-[0] hover:before:left-[20%] before:transition-all flex items-center gap-4"
          >
            <HiCloudUpload />
            <div className={`${fontSaira} relative z-10`}>Importar</div>
          </motion.button>
        )}
      </header>

      {instance && (
        <section className="p-4 flex text-indigo-500 gap-3 items-center bg-indigo-100/40 opacity-70 rounded-xl mx-auto px-10 border border-indigo-200 m-6">
          <IoAlertCircle size={20} />
          <span
            className={`${fontInter} font-semibold items-center flex gap-1 text-lg`}
          >
            Nenhum contato ainda para
            <b className="p-1 px-2 bg-indigo-100 rounded-xl">{instance}</b>
          </span>
        </section>
      )}
    </div>
  );
}
