import { SimpleLoader } from "@/components/simple-loader";
import { ICampaignStatus } from "@/interfaces/ICampaign";
import { IContact } from "@/interfaces/IContact";
import { apiWhatsapp } from "@/utils/api";
import { fontInter, fontSaira } from "@/utils/fonts";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { HiDotsVertical } from "react-icons/hi";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { AxiosError } from "axios";
import { queryClient } from "@/providers/query-provider";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { useRouter } from "next/navigation";

dayjs.locale("pt-br");

interface CampaignComponentProps {
  data: {
    name: string;
    total_contacts: number;
    status: ICampaignStatus;
    saved_contacts: IContact[];
    createdAt?: string;
    id: number;
  };
}

interface IStatusStyle {
  background: string;
  textColor: string;
}

interface IButtonOptionProps {
  id: number;
  status: ICampaignStatus;
}

function calculatePercentage(part: number, total: number): number {
  if (total === 0) return 0;
  return Math.trunc((part / total) * 100);
}

const statusStyle = {
  FINISH: {
    background: "oklch(93% 0.034 272.788)",
    textColor: "oklch(58.5% 0.233 277.117)",
  }, //indigo
  STOPPED: { background: "#ffe2e2", textColor: "#fb2c36" }, // red
  CREATED: { background: "#e7e5e4", textColor: "#101828" }, // gray
  RUNNING: { background: "#d0fae5", textColor: "oklch(69.6% 0.17 162.48)" }, // emerald
} satisfies Record<ICampaignStatus, IStatusStyle>;

const legendStatus = {
  FINISH: "Concluída",
  STOPPED: "Inativa",
  CREATED: "Pausado",
  RUNNING: "Ativa",
} satisfies Record<ICampaignStatus, string>;

const useButtonOptions = () => {
  const startMutate = useMutation({
    mutationFn: async (campaignId: number) => {
      await apiWhatsapp.post(`/campaigns/run/${campaignId}`);
    },

    onError: (err: unknown) => {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data?.message);
      } else {
        toast.error("Houve um erro interno");
      }
    },

    onSuccess: () => {
      toast.success("Atualizado com sucesso!");
    },
  });

  const deleteMutate = useMutation({
    mutationFn: async (campaignId: number) => {
      return await apiWhatsapp.delete(`/campaigns/${campaignId}`);
    },

    onError: (err: unknown) => {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data?.message);
      } else {
        toast.error("houve um erro ao tentar deletar");
      }
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["campaigns"],
      });
    },
  });

  const stopMudate = useMutation({
    mutationFn: async (campaignId: number) => {
      const { data } = await apiWhatsapp.post(`/campaigns/stop/${campaignId}`);
      return data;
    },

    onError: (err: unknown) => {
      console.log("houve um erro", err);
    },

    onSuccess: () => {
      toast.success("Atualizado com sucesso!");
    },
  });

  return {
    startMutate,
    stopMudate,
    deleteMutate,
  };
};

const ButtonOptions = ({ status, id }: IButtonOptionProps) => {
  const [openOption, setOpenOption] = useState<boolean>(false);
  const { startMutate, stopMudate, deleteMutate } = useButtonOptions();
  const router = useRouter();

  return (
    <div className="ml-4 flex  flex-col relative text-gray-200">
      <button
        type="button"
        onClick={() => setOpenOption((p) => !p)}
        className="p-2 rounded-full grid place-items-center"
      >
        <HiDotsVertical size={15} className="text-gray-600" />
      </button>
      {openOption && (
        <div className="flex flex-col w-[10rem] top-0 rounded absolute overflow-auto right-[100%] bg-gray-900 shadow-xl">
          {status === "CREATED" && (
            <button
              type="button"
              onClick={() => startMutate.mutateAsync(id)}
              className="flex gap-4 hover:bg-stone-700 p-2 rounded-md"
            >
              {startMutate.isPending && <SimpleLoader className="w-5 h-5" />}
              <span>Rodar</span>
            </button>
          )}

          {status === "STOPPED" && (
            <button
              type="button"
              onClick={() => startMutate.mutateAsync(id)}
              className="flex gap-4 hover:bg-stone-700 p-2 rounded-md"
            >
              {startMutate.isPending && <SimpleLoader className="w-5 h-5" />}
              Continuar
            </button>
          )}

          {status === "RUNNING" && (
            <button
              type="button"
              onClick={() => stopMudate.mutateAsync(id)}
              className="flex gap-4 hover:bg-stone-700 p-2 rounded-md"
            >
              {stopMudate.isPending && <SimpleLoader className="w-5 h-5" />}
              Parar
            </button>
          )}

          <button
            type="button"
            onClick={() => deleteMutate.mutateAsync(id)}
            className="flex gap-4 hover:bg-stone-700 p-2 rounded-md"
          >
            Deletar
          </button>

          <button
            type="button"
            onClick={() => router.push(`/campaign/${id}`)}
            className="flex gap-4 hover:bg-stone-700 p-2 rounded-md"
          >
            Editar
          </button>
        </div>
      )}
    </div>
  );
};

export const CampaignComponent = ({ data }: CampaignComponentProps) => {
  const { name, status, id, saved_contacts, total_contacts, createdAt } = data;

  const porcetage = `${calculatePercentage(
    saved_contacts.length,
    total_contacts
  )}%`;

  return (
    <div className="flex border bg-white  text-gray-500 border-zinc-200 p-5 rounded-xl">
      <div className="flex flex-col flex-1 overflow-auto gap-2">
        <section className="flex justify-between overflow-auto">
          <div>
            <h2 className={`${fontInter} text-2xl text-gray-600 font-semibold`}>
              {name}
            </h2>
          </div>

          <div className="flex divide-x divide-gray-300">
            <div className="flex flex-col text-center px-6">
              <span className={`${fontSaira} text-base opacity-80`}>
                Alcance
              </span>
              <span className="text-lg">{saved_contacts?.length}</span>
            </div>

            <div className="flex flex-col text-center px-6">
              <span className={`${fontSaira} text-base opacity-80`}>
                Mensagens abertas
              </span>
              <span className="text-lg">0</span>
            </div>

            <div className="flex flex-col text-center px-6">
              <span className={`${fontSaira} text-base opacity-80`}>
                Respostas
              </span>
              <span className="text-lg">0</span>
            </div>

            <div className="flex flex-col text-center px-6">
              <span className={`${fontSaira} text-base opacity-80`}>
                Data de criação
              </span>
              <span className="text-lg text-nowrap">
                {createdAt ? dayjs(createdAt).format("DD, MMM [de] YYYY") : "-"}
              </span>
            </div>

            <div className="flex flex-col text-center px-6">
              <span className={`${fontSaira} text-base opacity-80`}>
                Previsão
              </span>
              <span className="text-lg">-</span>
            </div>
          </div>
        </section>

        <footer className="flex gap-4 items-center flex-wrap">
          <div
            style={{ backgroundColor: statusStyle[status].background }}
            className="flex px-1 items-center rounded-full p-0.5"
          >
            <div
              style={{ backgroundColor: statusStyle[status].textColor }}
              className="w-4 h-4 rounded-full"
            ></div>
            <span
              style={{ color: statusStyle[status].textColor }}
              className="px-5 text-sm"
            >
              {legendStatus[status]}
            </span>
          </div>

          <div
            style={{ backgroundColor: statusStyle[status].background }}
            className="flex px-1 items-center rounded-full p-0.5"
          >
            <span
              style={{ color: statusStyle[status].textColor }}
              className="px-5 text-sm"
            >
              {porcetage}
            </span>
          </div>

          <div
            style={{ backgroundColor: statusStyle[status].background }}
            className="w-full flex h-0.5"
          >
            <motion.div
              animate={{
                background: statusStyle[status].textColor,
                width: porcetage,
              }}
            ></motion.div>
          </div>
        </footer>
      </div>

      <ButtonOptions status={status} id={id} />
    </div>
  );
};
