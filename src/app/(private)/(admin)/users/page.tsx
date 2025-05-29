"use client";

//import { FooterPagination } from "@/components/footer-pagination";
import { IUser } from "@/interfaces/IUser";
import { UserRole } from "@/interfaces/user-role";
import { fontInter, fontOpenSans, fontSaira } from "@/utils/fonts";
import { Search } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useState } from "react";
import { FaAt, FaPlus, FaRegTrashCan, FaWhatsapp } from "react-icons/fa6";
import { LuPen } from "react-icons/lu";
import { MdOutlineCalendarMonth } from "react-icons/md";
import { PiUserCircleGearFill } from "react-icons/pi";
import { RiCheckboxBlankCircleFill } from "react-icons/ri";
import { SiTarget } from "react-icons/si";
import { useGetAllUsers } from "./hooks";
import { FooterPagination } from "@/components/footer-pagination";
import { motion } from "framer-motion";
import { ModalLayout } from "@/components/modal-layout";
import { CreateUser } from "./create-user-modal";
import { DeleteUserModal } from "./delete-user";

const legendRole = {
  [UserRole.ADMIN]: "Administrador",
  [UserRole.CLIENT]: "Cliente",
  [UserRole.GESTOR]: "Gestor",
} satisfies Record<UserRole, string>;


const SearchBar: React.FC = () => (
  <label
    htmlFor=""
    className="flex border items-center rounded-md focus-within:ring-2 bg-white"
  >
    <div className="w-10 h-8 border-r grid place-items-center">
      <Search />
    </div>
    <input type="text" className="p-2 px-3 outline-none" />
  </label>
);

const TableHeader: React.FC = () => (
  <thead>
    <tr className="border-b border-zinc-20 divide-zinc-100 border-zinc-100 text-zinc-600 font-semibold divide-x">
      <th className={`text-left p-3 text-zinc-500 ${fontSaira}`}>Nome</th>
      <th
        className={`text-left p-3 text-zinc-500 items-center gap-2 ${fontSaira}`}
      >
        <div className="flex gap-2 items-center">
          <FaAt />
          <span>Email</span>
        </div>
      </th>
      <th
        className={`text-left  items-center gap-2 p-3 text-zinc-500 ${fontSaira}`}
      >
        <div className="flex gap-2 items-center">
          <PiUserCircleGearFill size={20} />
          <span>Papel</span>
        </div>
      </th>
      <th className={`text-left p-3 text-zinc-500 ${fontSaira}`}>
        <div className="flex gap-2 items-center">
          <RiCheckboxBlankCircleFill />
          <span>Status</span>
        </div>
      </th>
      <th className={`text-left p-3 text-zinc-500 ${fontSaira}`}>
        <div className="flex gap-2 items-center">
          <MdOutlineCalendarMonth size={18} />
          <span>Entrou em</span>
        </div>
      </th>
      <th className={`text-left p-3 text-zinc-500 ${fontSaira}`}>
        <div className="flex gap-2 items-center">
          <SiTarget />
          <span>Actions</span>
        </div>
      </th>
    </tr>
  </thead>
);

const TableRow = (props: { user: IUser }) => {
  const { user } = props;

  const statusText = user.isActive ? 'Ativo' : 'Inativo';
  const statusDotColor = user.isActive ? 'bg-emerald-500' : 'bg-red-500';
  const statusContainerStyles = user.isActive
    ? 'bg-emerald-400/10 border-emerald-400 text-emerald-700'
    : 'bg-red-400/10 border-red-400 text-red-700';

  const createdAt = typeof user.createdAt === 'string' ? new Date(user.createdAt) : user.createdAt;

  const formatedUserCreatedAt = createdAt.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  return (
    <tr className="divide-x border-zinc-100 divide-zinc-100 hover:bg-zinc-50/40">
      <td className="gap-2 p-1 px-3">
        <div className="flex items-center gap-1">
          <div className="w-6 h-6 bg-zinc-100 rounded-full" />
          <span className={`${fontSaira} font-semibold`}>{user.name} </span>
        </div>
      </td>
      <td className="p-1 px-3">
        <Link href="#" className="underline opacity-90 hover:opacity-100">
          {user?.email}
        </Link>
      </td>
      <td className="p-1 px-3">
        <span className="font-semibold">{legendRole[user.role]}</span>
      </td>
      <td className="p-1 px-3">
        <div className="flex items-center opacity-90">
          <div
            className={`p-[3px] px-2.5 border text-xs rounded-lg flex items-center gap-2 font-semibold ${statusContainerStyles}`}
          >
            <div className={`w-2 h-2 rounded-full ${statusDotColor}`}></div>
            {statusText}
          </div>
        </div>
      </td>

      <td className="p-1 px-3">{formatedUserCreatedAt}</td>
      <td className="p-1 px-1 w-0">
        <Actions userId={user.id.toString()} />
      </td>
    </tr>
  );
};

const Actions = ({ userId }: { userId: string }) => (
  <div className="flex gap-1 items-center">
    <Link
      href={`?modal=whats&userId=${userId}`}
      className="flex items-center gap-2 border hover:text-black hover:shadow transition-all border-zinc-200 text-zinc-800 p-1 px-2 rounded-md opacity-80 hover:opacity-100"
    >
      <FaWhatsapp />
      <span>Whatsapp</span>
    </Link>
    <Link
      href={`?modal=edit-user&userId=${userId}`}
      className="flex items-center gap-2 border hover:text-black hover:shadow transition-all border-zinc-200 text-zinc-800 p-1 px-2 rounded-md opacity-80 hover:opacity-100"
    >
      <LuPen />
      <span>Editar</span>
    </Link>
    <Link
      href={`?modal=delete&userId=${userId}`}
      className="flex items-center gap-2 border hover:text-black hover:shadow transition-all border-zinc-200 text-zinc-800 p-1 px-2 rounded-md opacity-80 hover:opacity-100"
    >
      <FaRegTrashCan />
      <span>Deletar</span>
    </Link>
  </div>
);

function UsersContent() {
  const params = useSearchParams();
  const initialPage: number = Number(params.get("page")) || 1;

  const [isActiveFilter, setIsActiveFilter] = useState<boolean | undefined>(undefined);

  const { data, isLoading, limit } = useGetAllUsers(initialPage, isActiveFilter);
  const router = useRouter();

  const handleStatusFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;

    if (value === 'true') {
      setIsActiveFilter(true);
      router.push("?page=1");
      return;
    }

    if (value === 'false') {
      setIsActiveFilter(false);
      return;
    }
    

    setIsActiveFilter(undefined);
    router.push("?page=1");
  }

  if (isLoading) {
    return (
      <div className="flex w-full flex-col gap-2">
        <div className="p-4 bg-zinc-100 rounded-lg animate-pulse"></div>
        <div className="h-[10rem] bg-zinc-100 rounded-lg animate-pulse w-full"></div>
      </div>
    );
  }

  if (!data?.users) {
    return (
      <div className="flex flex-col gap-2">
        <h1 className={`${fontInter} font-semibold text-xl`}>
          Nenhum usuário registrado ainda
        </h1>
      </div>
    );
  }

  return (
    <ModalLayout
      modals={{
        create: CreateUser,
        delete: DeleteUserModal
      }}
    >
      <div className="flex flex-col rounded-xl border bg-white p-6">
        <header className="flex items-center justify-between text-xl font-semibold mb-5 p-4 border-b">
            <select
              id="statusFilter"
              value={isActiveFilter === undefined ? "all" : String(isActiveFilter)}
              onChange={handleStatusFilterChange}
              className={`${fontSaira} text-zinc-600 bg-white border border-zinc-300 rounded-lg p-2 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full sm:w-auto sm:min-w-[200px]`}
            >
              <option value="all">Todos os usuários</option>
              <option value="true">Ativos</option>
              <option value="false">Inativos</option>
            </select>

          <motion.button
            type="button"
            whileTap={{ scale: 0.94 }}
            onClick={() => router.push("?modal=create")}
            className="p-2 px-4 bg-indigo-500 shadow-md shadow-indigo-500/30 text-indigo-100 rounded-xl flex items-center justify-center gap-2 text-sm sm:text-base" 
          >
            <FaPlus />
            <span className={`${fontSaira}`}>Nova Usuário</span>
          </motion.button>
        </header>

        <SearchBar />

        <section className="flex overflow-x-auto flex-col border border-zinc-100 bg-white mt-2 rounded-md text-zinc-500">
          {data?.users && data?.users?.length > 0 && (
            <table className="table-auto w-full border-collapse">
              <TableHeader />
              <tbody className={`${fontOpenSans} divide-y`}>
                {data?.users.map((user, index) => (
                  <TableRow key={index} user={user} />
                ))}
              </tbody>
            </table>
          )}

          {isLoading && (
            <div className="flex w-full flex-col gap-3">
              <div className="w-full min-h-[10rem] animate-pulse bg-zinc-100 rounded-md" />
            </div>
          )}

          {data?.total && (
            <FooterPagination
              page={initialPage}
              total={data.total}
              limit={limit}
            />
          )}
        </section>
      </div>

    </ModalLayout>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={<div className="flex w-[20rem] h-[5rem] bg-red-200"></div>}
    >
      <UsersContent />
    </Suspense>
  );
}
