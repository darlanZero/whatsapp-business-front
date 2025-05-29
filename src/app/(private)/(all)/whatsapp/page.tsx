"use client";

import { FooterPagination } from "@/components/footer-pagination";
import { useWhatsapp } from "@/hooks/use-whatsapp";
import { IWhatsapp } from "@/interfaces/IWhatsapp";
import { fontInter, fontOpenSans, fontRoboto, fontSaira } from "@/utils/fonts";
import { formatNumber } from "@/utils/format-number";
import {
  StatusWhatsappLegend,
  StatusWhatsappStyle,
} from "@/utils/status-whatsapp";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import Link from "next/link";
import { FaPlus } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const limit = 10;
const date = dayjs();
date.locale("pt-br");

export default function Whatsapp() {
  const { whatsapps, page } = useWhatsapp();
  const { client, admin } = whatsapps;

  if (!client && !admin?.total) {
    return (
      <div className="w-full items-center justify-center min-h-[30rem] shadow-gray-600/20 flex-col flex p-6 rounded-xl">
        <div
          className={`${fontInter} text-indigo-500/80 font-semibold text-lg text-center`}
        >
          Você ainda não tem nenhuma instância
        </div>

        <Link
          href={{ query: { modal: "create" } }}
          className="p-2 px-4 flex items-center text-indigo-100 mt-5 gap-2 transition-all rounded-lg bg-indigo-500 shadow-md hover:shadow-xl opacity-80 hover:opacity-100 shadow-indigo-500/30 w-full sm:w-auto justify-center"
        >
          <span className={`${fontInter} font-semibold`}>Instancia</span>
          <FaPlus size={15} />
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-col flex gap-4 bg-white/60 p-4 sm:p-6 border rounded-xl">
      <header className="flex flex-col sm:flex-row flex-1 gap-3 items-stretch sm:items-center">
        <input
          type="text"
          className={`${fontOpenSans} bg-white rounded p-2 px-4 border flex-1 text-gray-500 text-md outline-none focus:ring-2 w-full`}
          placeholder="Pesquise aqui..."
        />
        <Link
          href={{ query: { modal: "create" } }}
          className="p-2 px-4 flex text-indigo-100 items-center justify-center gap-2 transition-all rounded-lg bg-blue-500 shadow-md hover:shadow-xl opacity-80 hover:opacity-100 shadow-blue-500/30 w-full sm:w-auto"
        >
          <span className={`${fontInter} font-semibold`}>Instancia</span>
          <FaPlus size={15} />
        </Link>
      </header>

      <section className="gap-3 grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4">
        {client && <WhatsappCard whatsapp={client} />}

        {admin?.whatsapps?.map((data, index) => {
          return <WhatsappCard key={index} whatsapp={data} />;
        })}
      </section>

      {admin?.whatsapps?.length && admin.total > 0 && (
        <FooterPagination page={page} total={admin.total} limit={limit} />
      )}
    </div>
  );
}

const WhatsappCard = (props: { whatsapp: IWhatsapp }) => {
  const { whatsapp } = props;
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const modalParam = params.get("modal");
    const nameParam = params.get("name");
    const isQrModalOpenForThisInstance =
      modalParam === "qr" && nameParam === whatsapp.instanceName;

    if (whatsapp?.status === "open" && isQrModalOpenForThisInstance) {
      const currentPathname = window.location.pathname;
      const newSearchParams = new URLSearchParams(params.toString());
      newSearchParams.delete("modal");
      newSearchParams.delete("number");
      newSearchParams.delete("name");

      const newUrl = `${currentPathname}?${newSearchParams.toString()}`;

      router.push(newUrl, { scroll: false });
    }
  }, [whatsapp?.status, whatsapp.instanceName, params, router]);

  return (
    <motion.div className="p-4 flex flex-col bg-gray-300/10 border mt-2 text-zinc-500 gap-3 rounded-lg w-full">
      <header className="flex items-center justify-between">
        <div>
          <h1 className={`${fontSaira} font-semibold truncate`}>
            {whatsapp.instanceName}
          </h1>
        </div>

        <Link
          href={`/whatsapp/${whatsapp.instanceName}`}
          className="w-10 h-10 grid place-items-center rounded-xl hover:bg-zinc-100 transition-colors flex-shrink-0"
        >
          <IoMdSettings />
        </Link>
      </header>

      {whatsapp?.status === "open" && (
        <section className="flex items-center bg-gray-500/10 rounded-xl p-3 justify-between">
          <div className="flex gap-2 items-center overflow-hidden">
            <div className="flex flex-col">
              <span
                className={`${fontRoboto} text-zinc-800 text-lg opacity-70 break-all`}
              >
                {formatNumber(whatsapp.phoneNumber)}
              </span>
            </div>
          </div>
        </section>
      )}

      {whatsapp?.status != "open" && (
        <section className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 bg-orange-400/20 opacity-80 hover:opacity-100 border border-orange-500/40 rounded-md p-2">
          <span
            className={`${fontInter} text-orange-600 font-semibold px-2 text-center sm:text-left`}
          >
            Conecte
          </span>
          <Link
            href={{
              query: {
                modal: "qr",
                number: whatsapp.phoneNumber,
                name: whatsapp.instanceName,
              },
            }}
            className={`${fontInter} bg-orange-500 text-white text-sm font-semibold opacity-80 hover:opacity-100 px-4 p-1 rounded-lg w-full sm:w-auto text-center`}
          >
            QR code
          </Link>
        </section>
      )}

      <footer className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between mt-2 gap-2">
        <div
          className={`${fontInter} px-4 p-[1px] rounded-full ${
            StatusWhatsappStyle[whatsapp.status]
          } text-sm border text-center w-full sm:w-auto`}
        >
          <span>{StatusWhatsappLegend[whatsapp.status]}</span>
        </div>

        <Link
          href={`?modal=delete&instance=${whatsapp.instanceName}`}
          className={`${fontInter} p-2 bg-red-600 font-semibold rounded-md opacity-70 transition-all hover:opacity-100 text-sm text-rose-100 w-full sm:w-auto text-center`}
        >
          Deletar
        </Link>
      </footer>
    </motion.div>
  );
};
