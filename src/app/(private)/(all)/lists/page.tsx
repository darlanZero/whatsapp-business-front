"use client";

import { ListCard } from "@/components/create-list-contact/list-card";
import { ModalLayout } from "@/components/modal-layout";
import { fontSaira } from "@/utils/fonts";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { FaPlus } from "react-icons/fa";
import { CreateListModal } from "./create";
import { DetailsListModal } from "./details-modal";
import { ImportContacts } from "./import";
import { IList } from "@/interfaces/IList";
import { apiWhatsapp } from "@/utils/api";
import { DeleteListModal } from "./delete-modal";

interface IListContactResponse {
  list: IList;
  _count: {
    contacts: number;
  };
}

export default function Lists() {
  const router = useRouter();

  const { data: lists = [], isLoading } = useQuery<IListContactResponse[]>({
    queryKey: ["lists"],
    queryFn: async () => {
      return (await apiWhatsapp.get("/lists-contacts"))?.data;
    },
  });

  const handlePopulateList = (id: number) => {
    router.push(`?modal=populate&id=${id}`);
  };

  const handlerViewDetails = (id: number) => {
    router.push(`?modal=details&id=${id}`);
  };

  return (
    <ModalLayout
      modals={{
        create: CreateListModal,
        details: DetailsListModal,
        populate: ImportContacts,
        delete: DeleteListModal
      }}
    >
      <div className="flex flex-col gap-6 p-4">
        <header className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            className="p-3 w-full sm:flex-1 bg-white rounded-xl border text-gray-500 outline-none focus:ring-2 ring-indigo-500 transition-shadow"
            placeholder="Pesquise por uma lista..."
          />

          <motion.button
            type="button"
            whileTap={{ scale: 0.94 }}
            onClick={() => router.push("?modal=create")}
            className="w-full sm:w-auto p-3 px-5 bg-indigo-500 shadow-md shadow-indigo-500/30 text-indigo-100 rounded-xl flex items-center justify-center gap-4"
          >
            <FaPlus />
            <div className={`${fontSaira}`}>Nova Lista</div>
          </motion.button>
        </header>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-5 2xl:grid-cols-5 gap-6">
            {lists.map(({ list, _count }: IListContactResponse) => (
              <ListCard
                key={list.id}
                id={list.id}
                title={list.name}
                count={_count}
                onPopulate={() => handlePopulateList(list.id)}
                onViewDetails={() => handlerViewDetails(list.id)}
              />
            ))}
          </div>
        )}
      </div>
    </ModalLayout>
  );
}
