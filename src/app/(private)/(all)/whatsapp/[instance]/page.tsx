"use client";

import { IWhatsappEvolution } from "@/interfaces/IWhatsappClient";
import { apiAuth } from "@/utils/api";
import { fontInter, fontSaira } from "@/utils/fonts";
import { formatNumber } from "@/utils/format-number";
import {
  StatusWhatsappLegend,
  StatusWhatsappStyle,
} from "@/utils/status-whatsapp";
import { useMutation, useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";
import { TbUserCircle } from "react-icons/tb";
import { toast } from "react-toastify";

const useEditWhatsapp = () => {
  const params = useParams();

  const { data, isLoading } = useQuery<IWhatsappEvolution>({
    enabled: !!params?.instance,
    queryKey: ["whatsapp", "instance", params.instance],
    queryFn: async () =>
      (await apiAuth.get(`/whatsapp/instance/fetch/${params.instance}`))?.data,
  });

  const restart = useMutation({
    mutationFn: async (name: string) => {
      const response = await apiAuth.post(`/whatsapp/instance/restart/${name}`);
      console.log(response);
    },

    onSuccess: () => {
      toast.success("Reiniciado com sucesso!", { toastId: "restart" });
    },
  });

  return {
    data,
    restart,
    isLoading,
  };
};

export default function EditWhatsapp() {
  const { data, restart, isLoading } = useEditWhatsapp();

  if (isLoading) {
    return <>loading...</>;
  }

  if (!data) {
    return <>not found!</>;
  }

  return (
    <div className="flex flex-col gap-4">
      <Link
        href="/whatsapp"
        className="w-10 h-10 bg-white shadow rounded-full grid place-items-center text-gray-700 opacity-90 hover:opacity-100"
      >
        <FaArrowLeft />
      </Link>
      <div className="flex w-full p-5 gap-5 bg-white rounded-xl border text-gray-600 flex-col">
        <header className="flex items-center justify-between gap-3 font-semibold">
          <h1 className={`${fontSaira} text-xl capitalize`}>{data?.name}</h1>
          <div
            className={`px-4 p-[1px] rounded-full ${StatusWhatsappStyle[data.connectionStatus]
              } text-sm border `}
          >
            <span>{StatusWhatsappLegend[data.connectionStatus]}</span>
          </div>
        </header>

        {data?.connectionStatus === "open" && (
          <section className="flex items-center gap-2 bg-zinc-50 border rounded-xl  justify-between">
            <div className="flex gap-2 items-center flex-1 p-3 ">
              <div className="w-12 h-12 bg-white shadow-inner rounded-full relative overflow-hidden">
                {data?.profilePicUrl && (
                  <Image
                    alt=""
                    quality={20}
                    src={data?.profilePicUrl}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                )}
              </div>
              <div
                className={`${fontInter} flex flex-col items-center font-semibold text-gray-600`}
              >
                {formatNumber(data?.number)}
              </div>
            </div>
          </section>
        )}

        {data?.connectionStatus !== "open" && (
          <section className="flex shadow-lg shadow-yellow-500/10 items-center opacity-90 hover:opacity-100 gap-2 p-4 border-yellow-500/50 bg-yellow-400/10  border rounded-lg justify-between">
            <span
              className={`${fontInter} text-xl text-yellow-600 font-semibold`}
            >
              Para conectar, escaneie o QR code.
            </span>

            <Link
              href={{
                query: { modal: "qr", number: data.number, name: data.name },
              }}
              className="bg-yellow-500 text-white p-3 px-4 rounded-lg"
            >
              Gerar QR code
            </Link>
          </section>
        )}

        <footer className="w-full justify-between flex items-center gap-2">
          <div />
          <div className="flex items-center gap-2">
            <button
              type="button"
              style={{ opacity: restart.isPending ? 0.4 : 1 }}
              onClick={() => restart.mutate(data.name)}
              className="p-1 px-4 bg-gray-50 text-white rounded-md "
            >
              <span
                className={`${fontInter} font-semibold text-gray-500 text-sm uppercase`}
              >
                Restart
              </span>
            </button>
            <Link
              href={{ query: { modal: "disconnect", instance: data?.name } }}
              className="p-1 px-4 bg-red-500 text-white rounded-md hover:bg-red-600 uppercase"
            >
              <span
                className={`${fontInter} font-semibold text-red-100 text-sm`}
              >
                Desconectar
              </span>
            </Link>
          </div>
        </footer>
      </div>

      <section className="flex w-full text-gray-500 gap-4">
        <div className="flex flex-1 bg-white border rounded-lg p-3 flex-col gap-3">
          <header className="flex items-center gap-2 font-semibold">
            <TbUserCircle />
            <h1 className={fontSaira}>Contatos</h1>
          </header>
          <span className="flex text-3xl text-gray-600 font-semibold">
            {data?._count.Contact}
          </span>
        </div>

        <div className="flex flex-1 bg-white border rounded-lg p-3 flex-col gap-3">
          <header className="flex items-center gap-2 font-semibold">
            <TbUserCircle />
            <h1 className={fontSaira}>Chats</h1>
          </header>
          <span className="flex text-3xl text-gray-600 font-semibold">
            {data?._count.Chat}
          </span>
        </div>
        <div className="flex flex-1 bg-white border rounded-lg p-3 flex-col gap-3">
          <header className="flex items-center gap-2 font-semibold">
            <TbUserCircle />
            <h1 className={fontSaira}>Mensagens</h1>
          </header>
          <span className="flex text-3xl text-gray-600 font-semibold">
            {data?._count?.Message}
          </span>
        </div>
      </section>
    </div>
  );
}
