"use client";

import { FooterPagination } from "@/components/footer-pagination";
import { UserContext } from "@/contexts/user-context";
import { IWhatsapp } from "@/interfaces/IWhatsapp";
import { UserRole } from "@/interfaces/user-role";
import { api } from "@/utils/api";
import { fontInter, fontOpenSans, fontRoboto, fontSaira } from "@/utils/fonts";
import { formatNumber } from "@/utils/format-number";
import {
  StatusWhatsappLegend,
  StatusWhatsappStyle,
} from "@/utils/status-whatsapp";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";

type ResponseAdminWhatsapps = {
  total: number;
  whatsapps: IWhatsapp[];
};

const limit = 10;
const date = dayjs();
date.locale("pt-br");

const useWhatsapp = () => {
  const { informations } = useContext(UserContext);
  const params = useSearchParams();
  const initialPage = Number(params?.get("page")) || 1;

  const [page, setPage] = useState<number>(initialPage);

  useEffect(() => {
    setPage(initialPage);
  }, [initialPage]);

  const { data: whatsappAdmin } = useQuery<ResponseAdminWhatsapps>({
    queryKey: ["whatsapp", "admin", page],

    enabled:
      informations?.role === UserRole.ADMIN ||
      informations?.role === UserRole.GESTOR,

    queryFn: async () =>
      (
        await api.get<ResponseAdminWhatsapps>(
          `/whatsapp/list?page=${page}&limit=${limit}`
        )
      )?.data,
  });

  const { data: whatsappClient } = useQuery<IWhatsapp>({
    queryKey: ["whatsapp", "client"],
    enabled: informations?.role === UserRole.CLIENT,
    queryFn: async () =>
      (await api.get<IWhatsapp>("/whatsapp/instance/my-whatsapp"))?.data,
  });

  return {
    page,
    whatsapps: {
      admin: whatsappAdmin,
      client: whatsappClient,
    },
  };
};

export default function Whatsapp() {
  const { whatsapps, page } = useWhatsapp();
  const { client, admin } = whatsapps;

  if (!client && !admin?.total) {
    return (
      <div className="w-full items-center justify-center min-h-[30rem] shadow-inner shadow-gray-600/20 flex-col flex bg-white p-6 rounded-xl">
        <div className="text-indigo-500/80 font-semibold text-lg">
          Você ainda não tem nenhuma instância
        </div>

        <Link
          href={{ query: { modal: "create" } }}
          className="p-2 px-4 flex items-center mt-5 gap-2 transition-all rounded-lg bg-indigo-500 shadow-md hover:shadow-xl opacity-80 hover:opacity-100 shadow-indigo-500/30"
        >
          <span className={`${fontInter} font-semibold`}>Instancia</span>
          <FaPlus size={15} />
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-col flex gap-2 bg-white/60 p-6 border rounded-xl">
      <header className="flex-1 flex gap-2 items-center">
        <input
          type="text"
          className={`${fontOpenSans} bg-white rounded p-2 px-4 border flex-1 text-gray-500 text-md outline-none focus:ring-2`}
          placeholder="Pesquise aqui..."
        />
        <Link
          href={{ query: { modal: "create" } }}
          className="p-2 px-4 flex items-center gap-2 transition-all rounded-lg bg-blue-500 shadow-md hover:shadow-xl opacity-80 hover:opacity-100 shadow-blue-500/30"
        >
          <span className={`${fontInter} font-semibold`}>Instancia</span>
          <FaPlus size={15} />
        </Link>
      </header>

      <section className="gap-2 flex-wrap grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4">
        {client && <WhatsappCard whatsapp={client} />}

        {admin?.whatsapps?.map((data, index) => {
          return <WhatsappCard key={index} whatsapp={data} />;
        })}

        <button className="w-20 h-20 bg-white rounded-xl border border-indigo-500/40 m-2 border-dashed grid place-items-center">
          <FaPlus size={20} className="text-indigo-300" />
        </button>
      </section>

      {admin?.whatsapps?.length && (
        <FooterPagination page={page} total={admin.total} limit={limit} />
      )}
    </div>
  );
}

const WhatsappCard = (props: { whatsapp: IWhatsapp }) => {
  const { whatsapp } = props;

  return (
    <div className="p-4 flex flex-col bg-gray-300/10 border mt-2 text-zinc-500 gap-2 rounded-lg w-full">
      <header className="flex items-center justify-between">
        <div>
          <h1 className={`${fontSaira} font-semibold`}>
            {whatsapp.instanceName}
          </h1>
        </div>

        <Link
          href={`/whatsapp/${whatsapp.instanceName}`}
          className="w-10 h-10 grid place-items-center rounded-xl hover:bg-zinc-100 transition-colors"
        >
          <IoMdSettings />
        </Link>
      </header>

      {whatsapp?.status === "open" && (
        <section className="flex items-center bg-gray-500/10 rounded-xl p-3 justify-between">
          <div className="flex gap-2 items-center">
            <div className="flex flex-col">
              <span
                className={`${fontRoboto} text-zinc-800 text-lg opacity-70`}
              >
                {formatNumber(whatsapp.phoneNumber)}
              </span>
            </div>
          </div>
        </section>
      )}

      {whatsapp?.status != "open" && (
        <section className="flex items-center bg-orange-400/20 opacity-80 hover:opacity-100 border border-orange-500/40 rounded-md p-2 justify-between">
          <span className="text-orange-600 font-semibold px-2">Conecte</span>
          <Link
            href={{
              query: {
                modal: "qr",
                number: whatsapp.phoneNumber,
                name: whatsapp.instanceName,
              },
            }}
            className="bg-orange-500 text-white text-sm font-semibold opacity-80 hover:opacity-100 px-4 p-1 rounded-lg"
          >
            QR code
          </Link>
        </section>
      )}

      <footer className="flex items-center justify-between mt-2">
        <div
          className={`px-4 p-[1px] rounded-full ${
            StatusWhatsappStyle[whatsapp.status]
          } text-sm border `}
        >
          <span>{StatusWhatsappLegend[whatsapp.status]}</span>
        </div>

        <Link
          href={`?modal=delete&instance=${whatsapp.instanceName}`}
          className={`${fontInter} p-2 bg-red-600 font-semibold rounded-md opacity-70 transition-all hover:opacity-100 text-sm text-rose-100`}
        >
          Deletar
        </Link>
      </footer>
    </div>
  );
};
