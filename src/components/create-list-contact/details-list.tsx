import { IContact } from "@/interfaces/IContact";
import { apiWhatsapp } from "@/utils/api";
import { fontInter } from "@/utils/fonts";
import { useQuery } from "@tanstack/react-query";
import { User } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Loader } from "../loader";

interface ResponseGetAllContacts {
  contacts: IContact[];
  total: number;
}

const useContactsLogic = (listId: string | null) => {
  const { data, isLoading, isError } = useQuery<ResponseGetAllContacts>({
    queryKey: ["lists", listId],
    queryFn: async () =>
      (await apiWhatsapp.get(`/contacts/all/${listId}`))?.data || [],
  });

  return { data, isLoading, isError };
};

const ErrorMessage = () => (
  <div
    className={`${fontInter} flex items-center p-3 justify-center text-rose-600`}
  >
    Erro ao carregar contatos
  </div>
);

const ContactCard = ({ contact }: { contact: IContact }) => (
  <div className="w-full max-w-lg border-gray-200 p-4 rounded-lg border">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="flex flex-col">
          <span className={`${fontInter} font-medium text-gray-900`}>
            {contact.name}
          </span>
          <span className={`${fontInter} text-sm text-gray-500`}>
            {contact.phoneNumber}
          </span>
        </div>
      </div>
      <User className="h-5 w-5 text-gray-400" />
    </div>
  </div>
);

const ContactsList = ({ contacts }: { contacts: IContact[] }) => (
  <div className="space-y-3 p-6">
    {contacts.map((contact, index: number) => (
      <ContactCard key={index} contact={contact} />
    ))}
  </div>
);

const DetailsList = () => {
  const params = useSearchParams();
  const listId = params?.get("id");
  const { data, isLoading, isError } = useContactsLogic(listId);

  if (isLoading)
    return (
      <div className="relative grid place-items-center pb-10 ">
        <div className="relative">
          <Loader />
        </div>
      </div>
    );

  if (isError || !data?.contacts) return <ErrorMessage />;

  return <ContactsList contacts={data?.contacts} />;
};

export { DetailsList };
