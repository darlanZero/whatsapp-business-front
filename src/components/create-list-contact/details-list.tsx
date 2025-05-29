import { UpdateListModal } from "@/app/(private)/(all)/lists/update";
import { IContact } from "@/interfaces/IContact";
import { queryClient } from "@/providers/query-provider";
import { apiWhatsapp } from "@/utils/api";
import { fontInter, fontOpenSans, fontSaira } from "@/utils/fonts";
import { formatNumber } from "@/utils/format-number";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { IoTrash } from "react-icons/io5";
import { MdContacts, MdEdit } from "react-icons/md";
import { toast } from "react-toastify";
import { z } from "zod";
import { FooterPagination } from "../footer-pagination";
import PhoneInput, { formatPhoneNumber } from "../input-number";
import { Loader } from "../loader";
import { SimpleLoader } from "../simple-loader";

interface ResponseGetAllContacts {
  contacts: IContact[];
  total: number;
}

interface ContactListProps {
  contacts: IContact[];
  total: number;
  onEditListClick: (listId: number) => void;
  currentListId: number;
}

interface ShowSelectedContactProps {
  contactId: number;
  clear: () => void;
}

const updateContactSchema = z.object({
  name: z.string(),
  phoneNumber: z.string(),
});

type UpdateContactSchemaProps = z.infer<typeof updateContactSchema>;

const useContactsLogic = (listIdParam: string | null) => {
  const listId = listIdParam ? parseInt(listIdParam, 10) : null;

  const { data, isLoading, isError, isFetching } =
    useQuery<ResponseGetAllContacts>({
      queryKey: ["lists", listId],
      queryFn: async () => {
        if (listId === null || isNaN(listId)) {
          return { contacts: [], total: 0 };
        }
        const response = await apiWhatsapp.get(`/contacts/all/${listId}`);
        return response?.data || { contacts: [], total: 0 };
      },
      enabled: listId !== null && !isNaN(listId),
    });

  return { data, isLoading, isError, listId, isFetching };
};

const ShowSelectedContact = (props: ShowSelectedContactProps) => {
  const { contactId, clear } = props;
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const { data: contact, isLoading: loadingContact } = useQuery<IContact>({
    queryKey: ["contacts", contactId],
    queryFn: async () =>
      (await apiWhatsapp.get(`/contacts/${contactId}`))?.data,
  });

  useEffect(() => {
    setIsDeleting(false);
  }, [contact?.id]);

  const form = useForm<UpdateContactSchemaProps>({
    resolver: zodResolver(updateContactSchema),
    values: {
      name: contact?.name || "",
      phoneNumber: contact?.phoneNumber
        ? formatPhoneNumber(contact?.phoneNumber)
        : "",
    },
  });

  const updateContactMutation = useMutation({
    mutationFn: async (data: UpdateContactSchemaProps) => {
      const res = await apiWhatsapp.put(`/contacts/${contactId}`, data);

      return res?.data;
    },

    onSuccess: async () => {
      toast.success("Atualizado com sucesso!", {
        hideProgressBar: true,
        pauseOnFocusLoss: false,
      });

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["contacts"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["lists"],
        }),
      ]);
    },

    onError: (err: unknown) => {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data.message, {
          hideProgressBar: true,
        });
      } else {
        toast.error("Houve um erro ao tentar atualizar", {
          hideProgressBar: true,
        });
      }
    },
  });

  const deleteContactMutation = useMutation({
    mutationFn: async () => {
      const res = await apiWhatsapp.delete(`/contacts/${contactId}`);
      console.log(res);
      return res;
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["contacts"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["lists"],
        }),
      ]);

      toast.success("Deletado com sucesso!", {
        hideProgressBar: true,
      });

      setIsDeleting(false);
      clear();
    },
  });

  if (loadingContact) {
    return "loading...";
  }

  const {
    register,
    formState: { isLoading },
  } = form;

  const { isPending } = updateContactMutation;

  const loader = isPending || isLoading;

  if (isDeleting) {
    return (
      <div className="flex flex-col flex-1 p-10 text-center">
        <div className="flex">
          <button onClick={() => setIsDeleting(false)}>Fechar</button>
        </div>
        <div className="flex m-auto flex-col gap-2 w-full max-w-[16rem]">
          <span className="font-semibold ">
            Tem certeza que deseja deletar esse contato da lista?
          </span>

          <button
            onClick={() => deleteContactMutation.mutate()}
            className="font-semibold text-rose-100 bg-rose-500 hover:bg-rose-700 shadow-xl transition-all p-2 rounded"
          >
            Tenho certeza
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={form.handleSubmit((dat) => updateContactMutation.mutate(dat))}
      className="flex flex-col w-full"
    >
      <div className="flex flex-1 p-5 gap-4 flex-col">
        <label htmlFor="" className="flex flex-col gap-1">
          <span className="font-semibold">Nome</span>
          <input
            {...register("name")}
            type="text"
            className={`p-2 text-lg text-gray-700 font-semibold border outline-none focus:ring-2 ring-indigo-500 ${fontOpenSans} bg-white rounded-lg`}
          />
        </label>

        <label htmlFor="" className="flex flex-col gap-1">
          <span className="font-semibold">Telefone</span>
          <PhoneInput
            type="text"
            className={`p-2 text-lg text-gray-700 font-semibold border outline-none focus:ring-2 ring-indigo-500 ${fontOpenSans} bg-white rounded-lg`}
            {...register("phoneNumber")}
          />
        </label>
      </div>

      <footer className="flex p-3 items-center justify-between">
        <div className="">
          <button
            type="button"
            onClick={() => setIsDeleting(true)}
            className="p-3 bg-gray-200 rounded-full px-3 opacity-60 hover:opacity-100"
          >
            <span className={`${fontSaira} font-semibold`}>
              <IoTrash />
            </span>
          </button>
        </div>
        <div className="">
          <button className="p-2 flex bg-indigo-500 text-indigo-100 rounded-full px-5 opacity-80 hover:opacity-100 hover:shadow">
            {loader && <SimpleLoader className="w-5 h-5" />}
            <span className={`${fontSaira} font-semibold`}>Atualizar</span>
          </button>
        </div>
      </footer>
    </form>
  );
};

const ContactsList = ({
  contacts,
  total,
  onEditListClick,
  currentListId,
}: ContactListProps) => {
  const [contactsSelected, setContactSelected] = useState<number | null>(null);

  return (
    <div className="flex flex-col min-h-[30rem] bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className={`${fontSaira} text-xl font-semibold text-gray-800`}>
          Detalhes da Lista
        </h2>
        <button
          type="button"
          onClick={() => onEditListClick(currentListId)}
          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Editar nome da lista"
        >
          <MdEdit size={24} />
        </button>
      </div>

      <div className="flex divide-x flex-1">
        <div className="flex flex-col divide-y flex-[2] max-h-[30rem] overflow-auto">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              data-selected={contact?.id === contactsSelected}
              onClick={() => setContactSelected(contact?.id)}
              className="flex items-center text-start justify-between hover:bg-gray-50 data-[selected=true]:bg-gray-100 cursor-pointer p-2 px-4"
            >
              <div className="flex items-center space-x-4">
                <div className="flex flex-col">
                  <span className={`${fontInter} font-medium text-gray-900`}>
                    {contact.name}
                  </span>
                  <span className={`${fontInter} text-sm text-gray-500`}>
                    {formatNumber(contact?.phoneNumber)}
                  </span>
                </div>
              </div>
            </div>
          ))}
          {contacts.length === 0 && (
            <div className="p-4 text-center text-gray-500">
              Nenhum contato encontrado.
            </div>
          )}
        </div>
        <div className="flex flex-1 border-l">
          {contactsSelected ? (
            <ShowSelectedContact
              clear={() => setContactSelected(null)}
              contactId={contactsSelected}
            />
          ) : (
            <div className="flex items-center flex-col gap-1 m-auto text-gray-500 p-4 text-center">
              <MdContacts size={40} />
              <span className={`${fontSaira} text-xl`}>
                Selecione um contato para ver os detalhes
              </span>
            </div>
          )}
        </div>
      </div>
      <footer className="border-t">
        <FooterPagination page={1} limit={10} total={total} />
      </footer>
    </div>
  );
};

const DetailsList = () => {
  const params = useSearchParams();
  const listIdFromQuery = params?.get("id");

  const { data, isLoading, isError, listId } =
    useContactsLogic(listIdFromQuery);

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const handleOpenUpdateModal = () => {
    setIsUpdateModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="relative grid place-items-center py-10 min-h-[30rem]">
        <Loader />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="h-[10rem] grid place-items-center w-full">
        <span className="opacity-50">
          Houve um erro ao tentar buscar os detalhes
        </span>
      </div>
    );
  }

  return (
    <>
      <ContactsList
        total={data?.total || 0}
        contacts={data?.contacts || []}
        onEditListClick={handleOpenUpdateModal}
        currentListId={Number(listId)}
      />

      {isUpdateModalOpen && <UpdateListModal />}
    </>
  );
};

export { DetailsList };
