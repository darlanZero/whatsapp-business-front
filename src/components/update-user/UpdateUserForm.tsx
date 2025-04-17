"use client";

import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { FormInput } from "@/components/update-user/FormInput";
import { fontInter, fontSaira } from "@/utils/fonts";
import { toast } from "react-toastify";
import { updateUser } from "@/hooks/use-update-profile";
import { queryClient } from "@/providers/query-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, userSchema } from "@/schemas/user-schema";
import { api } from "@/utils/api";


function useBusinessLogic() {
 

  const userQuery = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => (await api.get("/user-profile/i"))?.data,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<User>({
    values: userQuery?.data || null,
    resolver: zodResolver(userSchema)
  });

  const mutation = useMutation({
    mutationFn: async (data: User) => {
      return await updateUser(userQuery.data!.id, data);
    },
    onSuccess: () => {
      toast.success("Seus dados foram atualizados com sucesso!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });

      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
    onError: () => {
      toast.error("Erro ao atualizar os dados, tente novamente.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    },
  });

  const onSubmit = (data: User) => {
    mutation.mutate(data);
  };

  return {
    register,
    handleSubmit,
    errors,
    onSubmit,
    userProfile: userQuery.data,
    isLoading: userQuery.isLoading,
    isError: userQuery.isError,
  };
}


export default function UpdateUserForm() {
  const {
    register,
    handleSubmit,
    errors,
    onSubmit,
    userProfile,
    isLoading,
    isError,
  } = useBusinessLogic();

  if (isLoading) {
    return <p>Carregando...</p>;
  }

  if (isError || !userProfile) {
    return <p>Erro ao carregar o perfil de usuário.</p>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-6">
        <div className="space-y-4">
          <h2 className={`${fontSaira} text-xl font-medium text-gray-700`}>
            Informações Pessoais
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormInput
              id="nome"
              label="Nome"
              placeholder={userProfile?.name}
              required
              error={errors.name?.message}
              {...register("name", { required: "Nome é obrigatório" })}
            />
            <FormInput
              id="email"
              label="Email"
              placeholder={userProfile?.email}
              type="email"
              required
              error={errors.email?.message}
              {...register("email", {
                required: "Email é obrigatório",
                pattern: {
                  value:
                    /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                  message: "Formato de email inválido",
                },
              })}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className={`${fontSaira} text-xl font-medium text-gray-700`}>
            Endereço
          </h2>

          <FormInput
            id="rua"
            label="Rua"
            placeholder={userProfile?.address?.street ?? "Não informado"}
            required
            error={errors.address?.street?.message}
            {...register("address.street", { required: "Rua é obrigatória" })}
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormInput
              id="cidade"
              label="Cidade"
              placeholder={userProfile?.address?.city ?? "Não informado"}
              required
              error={errors.address?.city?.message}
              {...register("address.city", { required: "Cidade é obrigatória" })}
            />
            <FormInput
              id="estado"
              label="Estado"
              placeholder={userProfile?.address?.state ?? "Não informado"}
              required
              error={errors.address?.state?.message}
              {...register("address.state", { required: "Estado é obrigatório" })}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormInput
              id="cep"
              label="Código Postal"
              placeholder={userProfile?.address?.zipCode ?? "Não informado"}
              required
              error={errors.address?.zipCode?.message}
              {...register("address.zipCode", { required: "CEP é obrigatório" })}
            />
            <FormInput
              id="pais"
              label="País"
              placeholder={userProfile?.address?.country ?? "Não informado"}
              required
              error={errors.address?.country?.message}
              {...register("address.country", { required: "País é obrigatório" })}
            />
          </div>
        </div>
      </div>
      <button
        type="submit"
        className={`${fontInter} mt-4 w-full rounded bg-blue-500 py-2 px-4 font-semibold text-white hover:bg-blue-600`}
      >
        Atualizar
      </button>
    </form>
  );
}
