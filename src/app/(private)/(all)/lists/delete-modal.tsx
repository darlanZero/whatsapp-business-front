import { DeleteListButton } from "@/components/create-list-contact/delete-button";
import { Modal } from "@/components/modal-base";
import { useSearchParams } from "next/navigation";

export const DeleteListModal = () => {
  const params = useSearchParams();
  const id = params.get("listId");

  return (
    <Modal.container>
      <Modal.form className="w-full flex-col max-w-md p-6 rounded-2xl h-auto shadow-md bg-gray-50 flex items-center">
        <Modal.header title="Excluir Lista" className="text-lg font-semibold" />
        {id && <DeleteListButton listId={Number(id)} />}
      </Modal.form>
    </Modal.container>
  );
};
