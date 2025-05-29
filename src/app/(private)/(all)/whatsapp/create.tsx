import PhoneInput from "@/components/input-number";
import { Modal } from "@/components/modal-base";
import { SimpleLoader } from "@/components/simple-loader";
import { fontSaira } from "@/utils/fonts";
import { useCreateWhatsapp } from "@/utils/use-create-whatsapp";
import { useRouter } from "next/navigation";

export const CreateWhatsapp = () => {
  const { form, handleCreate } = useCreateWhatsapp();
  const { handleSubmit, register, formState } = form;
  const { errors } = formState;
  const router = useRouter();

  return (
    <Modal.container>
      <Modal.form
        className="p-6 shadow-xl rounded-2xl text-gray-600 gap-4"
        onSubmit={handleSubmit(async (data) => {
          await handleCreate.mutateAsync(data);
          router.push("?");
        })}
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
            placeholder="Digite seu número"
            className="p-2 bg-gray-50 rounded border outline-none focus:ring-2 ring-blue-500 transition-shadow"
          />
          {errors.phone && (
            <span className="text-red-500 text-sm">{errors.phone.message}</span>
          )}
        </label>

        <footer className="mt-4 w-full flex flex-col">
          <button
            disabled={handleCreate.isPending}
            data-disabled={handleCreate.isPending}
            className="bg-blue-500 hover:bg-blue-600 data-[disabled=true]:opacity-50 data-[disabled=true]:cursor-default hover:data-[disabled=true]:opacity-50 transition-colors p-3 text-white px-4 rounded-lg flex gap-2 items-center justify-center gap-4"
          >
            {handleCreate.isPending && <SimpleLoader className="w-5 h-5" />}
            <span className={`${fontSaira} font-semibold`}>Criar</span>
          </button>
        </footer>
      </Modal.form>
    </Modal.container>
  );
};
