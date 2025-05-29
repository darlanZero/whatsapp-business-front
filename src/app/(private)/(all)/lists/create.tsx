import { CreateList } from "@/components/create-list-contact/create-list";
import { Modal } from "@/components/modal-base";

export const CreateListModal = () => {
  return (
    <Modal.container>
      <Modal.box className="w-full flex-col max-w-md p-5 rounded-2xl h-auto shadow-md bg-gray-50 flex items-center">
        <Modal.header
          title="Criar nova lista"
          className="text-lg font-semibold"
        />
        <CreateList />
      </Modal.box>
    </Modal.container>
  );
};
