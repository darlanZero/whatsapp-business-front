import PhoneInput from "@/components/input-number";
import { Modal } from "@/components/modal-base";
import { queryClient } from "@/providers/query-provider";
import { api } from "@/utils/api";
import { fontSaira } from "@/utils/fonts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

const createWhatsappSchema = z.object({
  name: z.string().min(1),
  phone: z
    .string()
    .refine((value) => /^\(\d{2}\) \d{5}-\d{4}$/.test(value), {
      message: "O telefone deve estar no formato (99) 99999-9999",
    })
    .transform((value) => `55${value.replace(/\D/g, "")}`),
});

type CreateWhatsappSchemaProps = z.infer<typeof createWhatsappSchema>;

const useCreateWhatsapp = () => {
  const router = useRouter();
  const form = useForm<CreateWhatsappSchemaProps>({
    resolver: zodResolver(createWhatsappSchema),
  });

  const handleCreate = useMutation({
    mutationFn: async (data: CreateWhatsappSchemaProps) => {
      const response = await api.post("/whatsapp/instance", {
        integration: "WHATSAPP-BAILEYS",
        phoneNumber: data.phone,
        instanceName: data.name,
        number: data.phone,
        qrcode: true,
      });

      console.log(response);
    },

    onSuccess: async () => {
      toast.success("Criado com sucesso!");
      await queryClient.invalidateQueries({
        queryKey: ["whatsapp"],
      });

      router.push("?");
    },

    onError: () => {
      toast.error("Houve um erro ao tentar criar uma nova instância");
    },
  });

  return {
    form,
    handleCreate,
  };
};
export const CreateWhatsapp = () => {
  const { form, handleCreate } = useCreateWhatsapp();
  const { handleSubmit, register, formState } = form;
  const { errors } = formState;

  return (
    <Modal.container>
      <Modal.form
        className="p-6 shadow-xl rounded-2xl text-gray-600 gap-4"
        onSubmit={handleSubmit((data) => handleCreate.mutate(data))}
      >
        <Modal.header title="Criar nova instância" />
        <label htmlFor="" className="flex flex-col gap-2">
          <span className={`${fontSaira} font-semibold text-gray-500`}>
            Nome
          </span>
          <input
            {...register("name")}
            type="text"
            placeholder="Minha instância"
            className="p-2 bg-gray-50 rounded border outline-none focus:ring-2 ring-blue-500 transition-shadow"
          />
          {errors.name && (
            <span className="text-red-500 text-sm">{errors.name.message}</span>
          )}
        </label>

        <label htmlFor="" className="flex flex-col gap-2">
          <span className={`${fontSaira} font-semibold text-gray-500`}>
            Telefone
          </span>
          <PhoneInput
            {...register("phone")}
            type="text"
            placeholder="digite seu número"
            className="p-2 bg-gray-50 rounded border outline-none focus:ring-2 ring-blue-500 transition-shadow"
          />
          {errors.phone && (
            <span className="text-red-500 text-sm">{errors.phone.message}</span>
          )}
        </label>

        <footer className="mt-4 w-full flex flex-col">
          <button className="bg-blue-500 hover:bg-blue-600 transition-colors p-3 text-white px-4 rounded-lg grid place-items-center">
            <span className={`${fontSaira} font-semibold`}>Criar</span>
          </button>
        </footer>
      </Modal.form>
    </Modal.container>
  );
};
