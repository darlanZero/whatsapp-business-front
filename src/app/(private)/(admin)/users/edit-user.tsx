"use client";

import { Modal } from "@/components/modal-base";
import { IUser } from "@/interfaces/IUser";
import { queryClient } from "@/providers/query-provider";
import { apiAuth, apiWhatsapp } from "@/utils/api";
import { fontOpenSans, fontSaira } from "@/utils/fonts";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import {
  FaCity,
  FaEnvelope,
  FaGlobeAmericas,
  FaMapMarkerAlt,
  FaMapPin,
  FaRegUser,
} from "react-icons/fa";
import { IconType } from "react-icons/lib";
import { MdOutlineEmail, MdOutlineLocalPhone } from "react-icons/md";

import {
  updateUserSchema,
  UpdateUserSchema,
} from "@/schemas/update-user-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import Link from "next/link";
import { ReadonlyURLSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-toastify";

interface LabelProps {
  title: string;
  icon: IconType;
  children: React.ReactNode;
  htmlFor?: string;
  error?: string;
}

const useEditUser = (userId: string) => {
  const router = useRouter();
  const { data: user, isLoading: isLoadingUser } = useQuery<
    IUser & { isActive?: boolean }
  >({
    queryKey: [`users`, userId],
    queryFn: async () => (await apiWhatsapp.get(`/users/${userId}`))?.data,
    enabled: !!userId,
  });

  const form = useForm<UpdateUserSchema>({
    resolver: zodResolver(updateUserSchema),
  });

  const { reset, watch, setValue } = form;
  const isActiveValue = watch("isActive");

  useEffect(() => {
    if (user) {
      const userDataForForm: Partial<UpdateUserSchema> = {
        ...user,
        role: user.role || "CLIENTE",
        isActive: !!user.isActive,
        address: {
          street: user?.address?.street || "",
          city: user?.address?.city || "",
          state: user?.address?.state || "",
          zipCode: user?.address?.zipCode || "",
          country: user?.address?.country || "",
        },
      };
      reset(userDataForForm);
    }
  }, [user, reset]);

  const mutation = useMutation({
    mutationFn: async (data: UpdateUserSchema) => {
      if (data.address) {
        Object.keys(data.address).forEach((key) => {
          if (
            data.address &&
            (data.address[key as keyof typeof data.address] === "" ||
              data.address[key as keyof typeof data.address] === null)
          ) {
            delete data.address[key as keyof typeof data.address];
          }
        });
        if (Object.keys(data.address).length === 0) {
          delete data.address;
        }
      }
      return await apiAuth.put(`admin/users/${userId}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Usuário atualizado");
      router.push("/users");
    },
    onError: (error: unknown) => {
      if (error instanceof AxiosError) {
        const errorMessage =
          error?.response?.data?.message || "Verifique as informações";
        toast.error(errorMessage);
      } else {
        toast.error("Houve um erro interno, tente novamente mais tarde!");
      }
    },
  });

  return {
    form,
    updateUser: mutation.mutate,
    isLoadingUser,
    user,
    isActiveValue,
    setValue,
    mutation,
  };
};

export const EditUserModal = (props: { params: ReadonlyURLSearchParams }) => {
  const userId: string | null = props.params.get("userId");

  if (!userId) {
    return (
      <Modal.container className="bg-zinc-900/80">
        <div className="flex flex-col gap-2 items-center rounded-xl m-auto p-10 bg-zinc-900 text-zinc-300 font-semibold border border-zinc-800">
          <span>Não foi encontrado nenhum usuário para edição.</span>
          <Link
            href="?"
            className="bg-rose-600 text-white p-1 px-2 rounded opacity-90 hover:opacity-100"
          >
            Fechar
          </Link>
        </div>
      </Modal.container>
    );
  }

  return <ModaEditUser userId={userId} />;
};

const ModaEditUser = ({ userId }: { userId: string }) => {
  const { form, updateUser, isLoadingUser, isActiveValue, setValue, mutation } =
    useEditUser(userId);
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = form;

  if (isLoadingUser) {
    return (
      <Modal.container className="bg-zinc-900/80">
        <div className="flex flex-col gap-2 items-center rounded-xl m-auto p-10 bg-zinc-900 text-zinc-300 font-semibold border border-zinc-800">
          <span>Carregando dados do usuário...</span>
        </div>
      </Modal.container>
    );
  }

  const handleToggleIsActive = () => {
    setValue("isActive", !isActiveValue, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  return (
    <Modal.container>
      <Modal.form
        onSubmit={handleSubmit((data) => updateUser(data))}
        className="max-w-3xl w-full p-0 mx-auto"
      >
        <Modal.header className="p-4 border-b" title="Editar usuário" />

        <section className="flex flex-col md:flex-row items-start p-4 gap-4">
          <section className="flex flex-col gap-4 w-full md:w-3/5">
            <div className="flex flex-col flex-1 gap-4 p-4 bg-emerald-50/10 border border-emerald-200 rounded-xl">
              <h3
                className={`${fontSaira} text-lg font-semibold text-emerald-700 mb-2`}
              >
                Informações Pessoais
              </h3>
              <Label
                title="Nome"
                icon={FaRegUser}
                htmlFor="name"
                error={errors.name?.message}
              >
                <input
                  id="name"
                  type="text"
                  {...register("name")}
                  className="rounded-md border p-2 outline-none w-full bg-white text-zinc-800 border-zinc-300 focus:border-emerald-500 focus:ring-emerald-500"
                />
              </Label>

              <Label
                title="Username"
                icon={FaRegUser}
                htmlFor="username"
                error={errors.username?.message}
              >
                <input
                  id="username"
                  type="text"
                  {...register("username")}
                  className="rounded-md border p-2 outline-none w-full bg-white text-zinc-800 border-zinc-300 focus:border-emerald-500 focus:ring-emerald-500"
                />
              </Label>
            </div>

            <div className="flex flex-col flex-1 gap-4 p-4 bg-emerald-50/10 border border-emerald-200 rounded-xl">
              <h3
                className={`${fontSaira} text-lg font-semibold text-emerald-700 mb-2`}
              >
                Contato
              </h3>
              <Label
                title="Email"
                icon={MdOutlineEmail}
                htmlFor="email"
                error={errors.email?.message}
              >
                <input
                  id="email"
                  type="email"
                  {...register("email")}
                  className="rounded-md border p-2 outline-none w-full bg-white text-zinc-800 border-zinc-300 focus:border-emerald-500 focus:ring-emerald-500"
                />
              </Label>

              <Label
                title="Telefone"
                icon={MdOutlineLocalPhone}
                htmlFor="phoneNumber"
                error={errors.phoneNumber?.message}
              >
                <input
                  id="phoneNumber"
                  type="tel"
                  {...register("phoneNumber")}
                  placeholder="+55 (XX) XXXXX-XXXX"
                  className="rounded-md border p-2 outline-none w-full bg-white text-zinc-800 border-zinc-300 focus:border-emerald-500 focus:ring-emerald-500"
                />
              </Label>
            </div>
          </section>

          <section className="flex flex-col gap-4 w-full md:w-2/5">
            <div className="flex flex-1 justify-between items-center p-4 bg-zinc-100 border border-zinc-200 rounded-full">
              <span
                className={`${fontSaira} text-md font-semibold text-zinc-700`}
              >
                {isActiveValue ? "Usuário Ativo" : "Usuário Inativo"}
              </span>
              <button
                type="button"
                onClick={handleToggleIsActive}
                className={`w-[3.5rem] flex items-center h-[1.75rem] ring-1 ring-zinc-300 rounded-full cursor-pointer transition-colors duration-300 ease-in-out 
                            ${
                              isActiveValue ? "bg-emerald-500" : "bg-zinc-300"
                            }`}
                aria-pressed={isActiveValue}
                aria-label={
                  isActiveValue ? "Desativar usuário" : "Ativar usuário"
                }
              >
                <div
                  className={`w-[1.5rem] h-[1.5rem] m-px bg-white rounded-full shadow transform transition-transform duration-300 ease-in-out 
                                ${
                                  isActiveValue
                                    ? "translate-x-[1.6rem]"
                                    : "translate-x-0"
                                }`}
                />
              </button>
            </div>

            <div className="flex flex-col flex-1 justify-between gap-2 p-4 bg-zinc-100 border border-zinc-200 rounded-2xl">
              <span
                className={`${fontSaira} text-md font-semibold text-zinc-700`}
              >
                Cargo do usuário
              </span>
              <select
                {...register("role")}
                className="rounded-md border p-2 outline-none w-full bg-white text-zinc-800 border-zinc-300 focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="CLIENTE">Cliente</option>
                <option value="GESTOR_TRAFEGO">Gestor de Tráfego</option>
                <option value="ADMINISTRADOR">Administrador</option>
              </select>
              {errors.role && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.role.message}
                </p>
              )}
            </div>
          </section>
        </section>

        <section className="p-4 w-full">
          <div className="flex flex-col gap-4 p-4 bg-sky-50/10 border border-sky-200 rounded-xl">
            <h3
              className={`${fontSaira} text-lg font-semibold text-sky-700 mb-2`}
            >
              Endereço
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Label
                title="Rua"
                icon={FaMapMarkerAlt}
                htmlFor="address.street"
                error={errors.address?.street?.message}
              >
                <input
                  id="address.street"
                  type="text"
                  {...register("address.street")}
                  className="rounded-md border p-2 outline-none w-full bg-white text-zinc-800 border-zinc-300 focus:border-sky-500 focus:ring-sky-500"
                />
              </Label>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Label
                title="Cidade"
                icon={FaCity}
                htmlFor="address.city"
                error={errors.address?.city?.message}
              >
                <input
                  id="address.city"
                  type="text"
                  {...register("address.city")}
                  className="rounded-md border p-2 outline-none w-full bg-white text-zinc-800 border-zinc-300 focus:border-sky-500 focus:ring-sky-500"
                />
              </Label>
              <Label
                title="Estado (UF)"
                icon={FaMapPin}
                htmlFor="address.state"
                error={errors.address?.state?.message}
              >
                <input
                  id="address.state"
                  type="text"
                  maxLength={2}
                  {...register("address.state")}
                  placeholder="Ex: SP"
                  className="rounded-md border p-2 outline-none w-full bg-white text-zinc-800 border-zinc-300 focus:border-sky-500 focus:ring-sky-500"
                />
              </Label>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Label
                title="CEP"
                icon={FaEnvelope}
                htmlFor="address.zipCode"
                error={errors.address?.zipCode?.message}
              >
                <input
                  id="address.zipCode"
                  type="text"
                  {...register("address.zipCode")}
                  placeholder="00000-000"
                  className="rounded-md border p-2 outline-none w-full bg-white text-zinc-800 border-zinc-300 focus:border-sky-500 focus:ring-sky-500"
                />
              </Label>
              <Label
                title="País"
                icon={FaGlobeAmericas}
                htmlFor="address.country"
                error={errors.address?.country?.message}
              >
                <input
                  id="address.country"
                  type="text"
                  {...register("address.country")}
                  className="rounded-md border p-2 outline-none w-full bg-white text-zinc-800 border-zinc-300 focus:border-sky-500 focus:ring-sky-500"
                />
              </Label>
            </div>
          </div>
        </section>

        <footer className="w-full p-5 border-t border-zinc-200 flex justify-end">
          <button
            type="submit"
            disabled={mutation.isPending}
            className="p-2 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-semibold rounded-lg transition-colors duration-150 ease-in-out"
          >
            <span className={fontSaira}>
              {mutation.isPending ? "Salvando..." : "Salvar Alterações"}
            </span>
          </button>
        </footer>
      </Modal.form>
    </Modal.container>
  );
};
const Label = ({ title, icon: Icon, children, htmlFor, error }: LabelProps) => {
  return (
    <label htmlFor={htmlFor} className={"flex-col flex gap-1 w-full"}>
      <div className="flex text-zinc-600 items-center gap-1">
        <Icon size={15} />
        <span className={`font-semibold text-sm ${fontOpenSans}`}>{title}</span>
      </div>
      {children}
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </label>
  );
};
