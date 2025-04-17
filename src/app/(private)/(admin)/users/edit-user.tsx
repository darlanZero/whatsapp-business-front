"use client";

import { Modal } from "@/components/modal-base";
import { IUser } from "@/interfaces/IUser";
import { queryClient } from "@/providers/query-provider";
import { api } from "@/utils/api";
import { fontOpenSans, fontSaira } from "@/utils/fonts";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { FaRegUser } from "react-icons/fa";
import { IconType } from "react-icons/lib";
import { MdOutlineEmail, MdOutlineLocalPhone } from "react-icons/md";

import {
  updateUserSchema,
  UpdateUserSchema,
} from "@/schemas/update-user-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { ReadonlyURLSearchParams } from "next/navigation";
import { toast } from "react-toastify";

interface LabelProps {
  title: string;
  icon: IconType;
  children: React.ReactNode;
}

const useEditUser = (userId: string) => {
  const { data: user } = useQuery<IUser>({
    queryKey: [`users`, userId],
    queryFn: async () => (await api.get(`/users/${userId}`))?.data,
  });

  const form = useForm<UpdateUserSchema>({
    resolver: zodResolver(updateUserSchema),
    values: user,
  });

  const mutation = useMutation({
    mutationFn: async (data: UpdateUserSchema) => {
      return await api.put(`/users/${userId}`, data);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("updated");
    },

    onError: () => {
      toast("Verifique as informações");
    },
  });

  return { form, updateUser: mutation.mutate };
};

export const EditUserModal = (props: { params: ReadonlyURLSearchParams }) => {
  const userId: string | null = props.params.get("userId");

  if (!userId)
    return (
      <Modal.container className="bg-zinc-900/80">
        <div className="flex flex-col gap-2 items-center rounded-xl m-auto p-10 bg-zinc-900 text-zinc-300 font-semibold border border-zinc-800">
          <span>Não foi encontrado nenhum usuário</span>

          <Link
            href="?"
            className="bg-rose-600 text-white p-1 px-2 rounded opacity-90 hover:opacity-100"
          >
            Fechar
          </Link>
        </div>
      </Modal.container>
    );

  return <ModaEditUser userId={userId} />;
};

const ModaEditUser = ({ userId }: { userId: string }) => {
  const { form, updateUser } = useEditUser(userId);
  const { register } = form;

  return (
    <Modal.container>
      <Modal.form
        onSubmit={form.handleSubmit((data) => updateUser(data))}
        className="max-w-[40rem] p-0"
      >
        <Modal.header className="p-4 border-b" title="Editar usuário" />

        <section className="flex items-start p-4 gap-4">
          <section className="flex flex-col gap-4 flex-[2]">
            <div className="flex flex-col flex-1 gap-4 p-4 bg-emerald-50/10 border rounded-xl">
              <Label title="Nome" icon={FaRegUser}>
                <input
                  type="text"
                  {...register("name")}
                  className="rounded-md border p-2 outline-none"
                />
              </Label>

              <Label title="Username" icon={FaRegUser}>
                <input
                  type="text"
                  {...register("username")}
                  className="rounded-md border p-2 outline-none"
                />
              </Label>
            </div>

            <div className="flex flex-col flex-1 gap-4 p-4 bg-emerald-50/10 border rounded-xl">
              <Label title="Email" icon={MdOutlineEmail}>
                <input
                  type="text"
                  {...register("email")}
                  className="rounded-md border p-2 outline-none"
                />
              </Label>

              <Label title="Telefone" icon={MdOutlineLocalPhone}>
                <input
                  type="text"
                  {...register("phoneNumber")}
                  className="rounded-md border p-2 outline-none"
                />
              </Label>
            </div>
          </section>

          <section className="flex flex-col gap-4 flex-1">
            <div className="flex flex-1 justify-between items-center p-4 bg-zinc-50 border rounded-full">
              <span className={`${fontSaira} text-md font-semibold`}>
                Usuário ativo
              </span>
              <button
                type="button"
                className="w-[3rem] flex h-[1.5rem] ring-2 ring-zinc-200 bg-zinc-200 overflow-hidden rounded-full"
              >
                <div className="w-[1.5rem] h-[1.5rem] bg-zinc-500 rounded-full" />
              </button>
            </div>

            <div className="flex flex-col flex-1 justify-between gap-2 p-4 bg-zinc-50 border rounded-2xl">
              <span className={`${fontSaira} text-md font-semibold`}>
                Cargo do usuário
              </span>

              <div className="flex flex-wrap gap-2">
                <div className="p-1 text-sm bg-blue-600 text-white px-2 shadow rounded">
                  <span className={fontSaira}>Cliente</span>
                </div>

                <div className="p-1 text-sm bg-white px-2 shadow rounded">
                  <span className={fontSaira}>Outro</span>
                </div>
                <div className="p-1 text-sm bg-white px-2 shadow rounded">
                  <span className={fontSaira}>Administrador</span>
                </div>
              </div>
            </div>
          </section>
        </section>

        <footer className="w-full p-5 border-t">
          <button className="p-2 px-4 bg-indigo-500 opacity-90 hover:opacity-100 text-indigo-100 font-semibold rounded-lg">
            <span className={fontSaira}>Salvar</span>
          </button>
        </footer>
      </Modal.form>
    </Modal.container>
  );
};

const Label = ({ title, icon: Icon, children }: LabelProps) => {
  return (
    <label className={"flex-col flex gap-1"}>
      <div className="flex text-zinc-500 items-center gap-1">
        <Icon size={15} />
        <span className={`font-semibold ${fontOpenSans}`}>{title}</span>
      </div>

      {children}
    </label>
  );
};
