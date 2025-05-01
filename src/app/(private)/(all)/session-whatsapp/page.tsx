"use client";

import { SimpleLoader } from "@/components/simple-loader";
import { useWhatsapp } from "@/hooks/use-whatsapp";
import { IWhatsapp } from "@/interfaces/IWhatsapp";
import { apiAuth } from "@/utils/api";
import { TOKEN_WHATSAPP_KEY } from "@/utils/cookies-keys";
import { fontSaira } from "@/utils/fonts";
import { formatNumber } from "@/utils/format-number";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { atom, useAtom } from "jotai";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaCheck, FaPlus, FaSquareWhatsapp } from "react-icons/fa6";
import { toast } from "react-toastify";

const whatsappSelectedAtom = atom<number | null>(null);

interface AuthWhatsappResponse {
  token: string;
}

const useSelectWhatsapp = () => {
  const router = useRouter();

  const handleSelected = useMutation({
    mutationFn: async (whatsappId: number) => {
      const response = await apiAuth.post<AuthWhatsappResponse>(
        `/auth/whatsapp/${whatsappId}`
      );

      const data = response?.data;
      return data.token;
    },
    onSuccess: (token) => {
      Cookies.set(TOKEN_WHATSAPP_KEY, token);

      router.push("/dashboard");

      toast.success("Selecionado com sucesso!");
    },
  });

  return {
    handleSelected,
  };
};

const WhatsappComponent = ({ whatsapp }: { whatsapp: IWhatsapp }) => {
  const [whatsappSelected, setWhatsappSelected] = useAtom(whatsappSelectedAtom);
  const isSelected = whatsappSelected === whatsapp.id;

  return (
    <div
      data-selected={isSelected}
      className="flex p-4 bg-gray-50/40 opacity-80 hover:opacity-100 data-[selected=true]:opacity-100 border border-zinc-200 items-center transition-shadow rounded-xl gap-2"
    >
      <button
        type="button"
        onClick={() => setWhatsappSelected(whatsapp?.id)}
        data-selected={isSelected}
        className="w-8 h-8 border hover:bg-zinc-100 rounded-full border-zinc-200
        data-[selected=true]:bg-indigo-500 data-[selected=true]:border-indigo-600 text-white grid place-items-center"
      >
        {isSelected && <FaCheck />}
      </button>

      <div className="text-lg font-semibold text-gray-500 rounded p-1 px-2 bg-blue-50">
        {whatsapp?.instanceName}
      </div>

      <div className="text-base font-semibold text-gray-500">
        {formatNumber(whatsapp?.phoneNumber)}
      </div>
    </div>
  );
};

export default function SessionWhatsappExpired() {
  const { whatsapps, isLoading } = useWhatsapp();
  const { handleSelected } = useSelectWhatsapp();
  const [whatsappSelected] = useAtom(whatsappSelectedAtom);
  const { client, admin } = whatsapps;

  const selectWhatsapp = async () => {
    if (whatsappSelected) {
      await handleSelected.mutateAsync(whatsappSelected);
    }
  };

  if (isLoading) {
    return (
      <div className="flex w-full flex-1 h-screen fixed top-0 left-0 z-40 bg-white overflow-auto p-10">
        <div className="flex flex-col m-auto gap-4 w-full max-w-[25rem] ">
          <div className="relative grid place-items-center">
            <SimpleLoader className="border-t-indigo-500" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-1 h-screen fixed top-0 left-0 z-40 bg-white overflow-auto p-10">
      <div className="flex flex-col m-auto gap-4 w-full max-w-[25rem] ">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="grid place-items-center w-full relative
          before:content-[''] before:w-30 before:h-6 before:absolute
          before:bg-blue-500 before:opacity-60 before:blur-xl	before:rounded before:top-[80%]"
        >
          <FaSquareWhatsapp size={90} className="text-indigo-500 z-20" />

          <Link
            href="/whatsapp"
            className="w-10 h-10 bg-gradient-to-bl from-indigo-500 to-blue-500 absolute top-0 right-0 rounded-lg hover:shadow-xl grid place-items-center"
          >
            <FaPlus className="text-indigo-100" size={22} />
          </Link>
        </motion.div>

        <motion.span
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={`${fontSaira} font-semibold mt-10 text-2xl text-gray-700 text-center`}
        >
          Para continuar, selecione um whatsapp
        </motion.span>

        {client?.id && <WhatsappComponent whatsapp={client} />}

        {admin?.whatsapps?.length &&
          admin?.whatsapps?.map((e) => {
            return <WhatsappComponent key={e.id} whatsapp={e} />;
          })}

        <motion.button
          type="button"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          disabled={!whatsappSelected}
          data-ok={!!whatsappSelected}
          onClick={selectWhatsapp}
          className="p-3 font-semibold transition-all data-[ok=true]:hover:shadow-xl bg-indigo-500 hover:bg-indigo-600 rounded-md text-indigo-100
          data-[ok=false]:bg-gray-100 data-[ok=false]:text-gray-400 data-[ok=false]:cursor-default"
        >
          <span className={fontSaira}>Entrar</span>
        </motion.button>
      </div>
    </div>
  );
}
