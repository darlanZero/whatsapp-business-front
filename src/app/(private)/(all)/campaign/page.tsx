"use client";

import { ICampaign } from "@/interfaces/ICampaign";
import { IContact } from "@/interfaces/IContact";
import { queryClient } from "@/providers/query-provider";
import { fontInter, fontOpenSans, fontSaira } from "@/utils/fonts";
import { getSocket } from "@/utils/socket";
import Link from "next/link";
import { useCallback, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import { HiDotsVertical } from "react-icons/hi";
import { IoCalendarOutline } from "react-icons/io5";
import { CampaignComponent } from "./campaign";
import { useCampaign } from "./hooks";

interface DashboardProps {
  data: {
    title: string;
  };
}

const Dashboard = ({ data }: DashboardProps) => {
  return (
    // Container principal do Dashboard
    <div className="p-3 flex flex-col bg-white rounded-xl flex-1 border border-zinc-200">
      {/* Header do Dashboard */}
      <header className="flex justify-between items-center">
        <h2 className={`${fontOpenSans} font-semibold text-gray-700`}>
          {data?.title}
        </h2>
        <button className="w-6 h-6">
          <HiDotsVertical />
        </button>
      </header>

      <section className="flex flex-col sm:flex-row justify-between mt-5 gap-4">
        <div className="flex flex-col w-full sm:flex-1">
          <span className={`${fontInter} text-emerald-500`}>+123%</span>
          <h2 className={`${fontSaira} text-gray-800 font-semibold text-3xl`}>
            1234
          </h2>
        </div>
        <div className="p-3 border rounded-xl w-full sm:flex-1 min-h-[50px]"></div>
      </section>
    </div>
  );
};

export default function Campaign() {
  const { campaigns, isLoading } = useCampaign();

  const updateCampaignProgress = (
    campaign: ICampaign,
    data: { status: string; saved_contact?: IContact }
  ) => {
    const updatedContacts = data.saved_contact
      ? [...(campaign.saved_contacts || []), data.saved_contact]
      : campaign.saved_contacts || [];

    return {
      ...campaign,
      status: data.status || campaign.status,
      saved_contacts: updatedContacts,
    };
  };

  const handleSocketProgress = useCallback(
    (data: {
      campaignId: number;
      saved_contact?: IContact;
      status: string;
    }) => {
      console.log(data);
      if (!data?.campaignId) return;

      queryClient.setQueryData(["campaigns"], (oldData: ICampaign[]) => {
        if (!Array.isArray(oldData)) return oldData;

        return oldData.map((campaign) =>
          campaign.id === data.campaignId
            ? updateCampaignProgress(campaign, data)
            : campaign
        );
      });
    },
    []
  );

  useEffect(() => {
    const socket = getSocket();

    socket.emit("join");
    socket.on("campaign:progress", handleSocketProgress);

    return () => {
      socket.off("campaign:progress", handleSocketProgress);
    };
  }, [handleSocketProgress]);

  return (
    <div className="flex flex-col w-full p-3">
      <header className="flex items-center flex-wrap justify-between py-2">
        <h1
          className={`${fontSaira} font-semibold text-nowrap text-gray-800	 text-2xl`}
        >
          Resumo das campanhas
        </h1>

        <button className="p-2 px-5 flex items-center gap-2 text-gray-500 rounded bg-gray-100 border-gray-300 border">
          <IoCalendarOutline size={16} />
          <span>Período: Ultimos 60 dias</span>
        </button>
      </header>

      <div className="flex gap-2 flex-wrap">
        <Dashboard data={{ title: "Alcance" }} />
        <Dashboard data={{ title: "Mensagem abertas" }} />
        <Dashboard data={{ title: "Respostas" }} />
      </div>

      <section className="flex flex-wrap gap-3 mt-4 items-center">
        <div
          className={`${fontInter} p-2 px-3 bg-white border text-gray-900 border-zinc-200 rounded`}
        >
          Período: Ultimos 60 dias
        </div>
        <div
          className={`${fontInter} p-2 px-3 bg-white border border-zinc-200 rounded text-gray-900`}
        >
          Status: Tudo
        </div>

        <Link
          href="/campaign/create"
          className="flex gap-2 p-2 items-center text-white bg-indigo-600 opacity-90 hover:opacity-100 px-10 rounded"
        >
          <FaPlus size={15} />
          <span className={fontSaira}>Criar nova campanha</span>
        </Link>
      </section>

      <section className="flex flex-col gap-2 mt-5">
        {campaigns?.map((campaign) => {
          return (
            <CampaignComponent
              key={campaign.id}
              data={{
                id: campaign.id!,
                name: campaign?.name,
                status: campaign?.status,
                createdAt: campaign?.createdAt?.toString(),
                total_contacts: campaign.total_contacts,
                saved_contacts: campaign.saved_contacts || [],
              }}
            />
          );
        })}
      </section>

      {!campaigns?.length && !isLoading && (
        <div className="flex flex-1 w-full mt-[10rem  ] items-center justify-center">
          <span className={`${fontSaira} text-2xl font-semibold text-gray-500`}>
            Ainda não há campanhas!
          </span>
        </div>
      )}
    </div>
  );
}
