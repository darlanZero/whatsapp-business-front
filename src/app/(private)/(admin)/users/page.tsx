"use client";

import { IUser } from "@/interfaces/IUser";
import { UserRole } from "@/interfaces/user-role";
import { fontOpenSans, fontSaira } from "@/utils/fonts";
import { Search } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { Suspense } from "react";
import { FaAt, FaRegTrashCan } from "react-icons/fa6";
import { LuPen } from "react-icons/lu";
import { MdOutlineCalendarMonth } from "react-icons/md";
import { PiUserCircleGearFill } from "react-icons/pi";
import { RiCheckboxBlankCircleFill } from "react-icons/ri";
import { SiTarget } from "react-icons/si";
import { useGetAllUsers } from "./hooks";
import { FooterPagination } from "@/components/footer-pagination";

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
  return (
    <tr className="divide-x border-zinc-100 divide-zinc-100 hover:bg-zinc-50">
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
        <div className="flex items-center opacity-80">
          <div className="p-[2px] px-2 border text-sm rounded-lg flex items-center gap-2 font-semibold bg-emerald-400/10 border-emerald-400 text-emerald-700">
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            Ativo
          </div>
        </div>
      </td>

      <td className="p-1 px-3">25 jun 2024, 3:23 pm</td>
      <td className="p-1 px-3 w-0">
        <Actions userId={user.id.toString()} />
      </td>
    </tr>
  );
};

const Actions = ({ userId }: { userId: string }) => (
  <div className="flex gap-1 items-center">
    <Link
      href={`?modal=edit-user&userId=${userId}`}
      className="flex items-center gap-2 bg-gray-50 text-zinc-800 p-1 px-2 rounded-md opacity-80 hover:opacity-100"
    >
      <LuPen />
      <span>Editar</span>
    </Link>
    <button className="flex items-center gap-2 bg-gray-50 text-zinc-800 p-1 px-2 rounded-md opacity-80 hover:opacity-100">
      <FaRegTrashCan />
      <span>Deletar</span>
    </button>
  </div>
);

function UsersContent() {
  const params = useSearchParams();
  const initialPage: number = Number(params.get("page")) || 1;
  const { data, isLoading, limit } = useGetAllUsers(initialPage);

  if (isLoading) {
    return (
      <div className="flex w-full flex-col gap-2">
        <div className="p-4 bg-zinc-100 rounded-lg animate-pulse"></div>
        <div className="h-[10rem] bg-zinc-100 rounded-lg animate-pulse w-full"></div>
      </div>
    );
  }

  if (!data?.users && !isLoading) {
    return (
      <div className="flex flex-col gap-2">
        <h1 className="font-semibold text-xl">
          Nenhum usuário registrado ainda
        </h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col rounded-xl border bg-white p-6">
      <header className="flex text-xl font-semibold mb-5">
        <h1 className={`${fontSaira} text-zinc-500`}>Todos os usuários</h1>
      </header>

      <SearchBar />

      <section className="flex flex-col border border-zinc-100 bg-white mt-2 rounded-md text-zinc-500">
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
