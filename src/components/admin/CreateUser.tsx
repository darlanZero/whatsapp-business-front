import { z } from "zod";
import { IconType } from "react-icons/lib";
import { fontOpenSans, fontSaira } from "@/utils/fonts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { createUserSchema } from "@/schemas/create-user-schema";
import { toast } from "react-toastify";
import { apiAuth } from "@/utils/api";
import { FaBriefcase, FaLock, FaRegUser } from "react-icons/fa";
import { MdOutlineEmail, MdOutlineLocalPhone } from "react-icons/md";
import { Modal } from "../modal-base";
import { SimpleLoader } from "../simple-loader";
import { useRouter } from "next/navigation";
import { FaAddressCard } from "react-icons/fa6";
import { AxiosError } from "axios";

type CreateUserSchema = z.infer<typeof createUserSchema>;

interface LabelProps {
  title: string;
  icon: IconType;
  children: React.ReactNode;
}

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

const useCreateUser = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const form = useForm<CreateUserSchema>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      role: "CLIENTE",
    }
  });

  const mutation = useMutation({
    mutationFn: async (data: CreateUserSchema) => {
      return await apiAuth.post(`admin/users/create`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Usuário criado com sucesso!");
      form.reset();
      router.push("/users");
    },
    onError: (error: unknown) => {
      console.error("Erro ao criar usuário:", error);
      if (error instanceof AxiosError) {
        const errorMessage =
          error.response?.data?.message ||
          "Não foi possível criar o usuário. Verifique as informações.";
        toast.error(errorMessage);
      }
    },
  });

  return { form, createUser: mutation.mutate, isCreating: mutation.isPending };
};

// Componente Modal Refatorado
export const CreateUserModal = () => {
  const { form, createUser, isCreating } = useCreateUser();
  const {
    register,
    formState: { errors },
  } = form;

  const inputClass =
    "rounded-md border p-2 outline-none focus:ring-2 ring-indigo-500 border-zinc-300 w-full bg-white";
  const errorClass = "text-red-500 text-xs mt-1";

  return (
    <Modal.container>
      <Modal.form
        onSubmit={form.handleSubmit((data) => createUser(data))}
        className="max-w-5xl w-full mx-auto bg-white rounded-lg shadow-xl overflow-hidden" // Modal menor e centralizado
      >
        <Modal.header className="p-4 border-b" title="Criar novo usuário" />

        <section className="flex flex-col lg:flex-row p-6 gap-6">
          <section className="flex flex-col gap-4 flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label title="Nome Completo" icon={FaRegUser}>
                  <input
                    id="name"
                    type="text"
                    {...register("name")}
                    className={inputClass}
                    placeholder="Digite o nome completo"
                  />
                </Label>
                {errors.name && (
                  <span className={errorClass}>{errors.name.message}</span>
                )}
              </div>
              <div>
                <Label title="Username" icon={FaRegUser}>
                  <input
                    id="username"
                    type="text"
                    {...register("username")}
                    className={inputClass}
                    placeholder="Digite o nome de usuário"
                  />
                </Label>
                {errors.username && (
                  <span className={errorClass}>{errors.username.message}</span>
                )}
              </div>
            </div>
            {/* Linha 2: Email e CPF/CNPJ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label title="Email" icon={MdOutlineEmail}>
                  <input
                    id="email"
                    type="email"
                    {...register("email")}
                    className={inputClass}
                    placeholder="exemplo@dominio.com"
                  />
                </Label>
                {errors.email && (
                  <span className={errorClass}>{errors.email.message}</span>
                )}
              </div>
              <div>
                <Label title="CPF/CNPJ" icon={FaAddressCard}>
                  <input
                    id="cpfCnpj"
                    type="text"
                    {...register("cpfCnpj")}
                    className={inputClass}
                    placeholder="000.000.000-00 ou 00.000.000/0000-00"
                  />
                </Label>
                {errors.cpfCnpj && (
                  <span className={errorClass}>{errors.cpfCnpj.message}</span>
                )}
              </div>
            </div>
            {/* Linha 3: Cargo do Usuário e Telefone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label title="Cargo do usuário" icon={FaBriefcase}>
                  <select
                    id="role"
                    {...register("role")}
                    className={inputClass}
                  >
                    <option value="CLIENTE">Cliente</option>
                    <option value="GESTOR_TRAFEGO">Gestor de Tráfego</option>
                    <option value="ADMINISTRADOR">Administrador</option>
                  </select>
                </Label>
                {errors.role && (
                  <span className={errorClass}>{errors.role.message}</span>
                )}
              </div>
              <div>
                <Label title="Telefone" icon={MdOutlineLocalPhone}>
                  <input
                    id="phoneNumber"
                    type="tel"
                    {...register("phoneNumber")}
                    className={inputClass}
                    placeholder="(00) 90000-0000"
                  />
                </Label>
                {errors.phoneNumber && (
                  <span className={errorClass}>
                    {errors.phoneNumber.message}
                  </span>
                )}
              </div>
            </div>
            {/* Linha 4: Senha */}
            <div>
              <Label title="Senha" icon={FaLock}>
                <input
                  id="password"
                  type="password"
                  {...register("password")}
                  className={inputClass}
                  placeholder="Crie uma senha forte"
                />
              </Label>
              {errors.password && (
                <span className={errorClass}>{errors.password.message}</span>
              )}
            </div>
          </section>
          {/* Coluna da Direita: Endereço */}
          <section className="flex flex-col gap-4 lg:w-1/3">
            <div className="flex flex-col gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl h-full">
              <h3
                className={`${fontSaira} text-md font-semibold text-zinc-700 mb-2`}
              >
                Endereço (Opcional)
              </h3>
              <div>
                <Label title="Rua" icon={FaAddressCard}>
                  <input
                    id="street"
                    type="text"
                    {...register("address.street")}
                    className={inputClass}
                    placeholder="Nome da rua, Nº"
                  />
                </Label>
                {errors.address?.street && (
                  <span className={errorClass}>
                    {errors.address.street.message}
                  </span>
                )}
              </div>
              <div>
                <Label title="Cidade" icon={FaAddressCard}>
                  <input
                    id="city"
                    type="text"
                    {...register("address.city")}
                    className={inputClass}
                    placeholder="Nome da cidade"
                  />
                </Label>
                {errors.address?.city && (
                  <span className={errorClass}>
                    {errors.address.city.message}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label title="Estado" icon={FaAddressCard}>
                    <input
                      id="state"
                      type="text"
                      {...register("address.state")}
                      className={inputClass}
                      placeholder="UF"
                    />
                  </Label>
                  {errors.address?.state && (
                    <span className={errorClass}>
                      {errors.address.state.message}
                    </span>
                  )}
                </div>
                <div>
                  <Label title="CEP" icon={FaAddressCard}>
                    <input
                      id="zipCode"
                      type="text"
                      {...register("address.zipCode")}
                      className={inputClass}
                      placeholder="00000-000"
                    />
                  </Label>
                  {errors.address?.zipCode && (
                    <span className={errorClass}>
                      {errors.address.zipCode.message}
                    </span>
                  )}
                </div>
              </div>
              <div>
                <Label title="País" icon={FaAddressCard}>
                  <input
                    id="country"
                    type="text"
                    {...register("address.country")}
                    className={inputClass}
                    placeholder="País"
                  />
                </Label>
                {errors.address?.country && (
                  <span className={errorClass}>
                    {errors.address.country.message}
                  </span>
                )}
              </div>
            </div>
          </section>
        </section>

        <footer className="w-full p-4 border-t flex justify-end bg-slate-50">
          <button
            type="submit"
            className={`py-2 px-5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg flex items-center gap-2 transition-colors duration-150 ${
              isCreating ? "opacity-60 cursor-not-allowed" : ""
            }`}
            disabled={isCreating}
          >
            {isCreating ? (
              <>
                <SimpleLoader className="w-5 h-5 border-white" />
                <span className={fontSaira}>Criando...</span>
              </>
            ) : (
              <span className={fontSaira}>Criar Usuário</span>
            )}
          </button>
        </footer>
      </Modal.form>
    </Modal.container>
  );
};
