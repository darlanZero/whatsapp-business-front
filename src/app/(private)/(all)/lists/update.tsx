import { UpdateList } from "@/components/create-list-contact/update-list";
import { Modal } from "@/components/modal-base";
import { fontSaira } from "@/utils/fonts";

export const UpdateListModal = () => {
  return (
    <Modal.container className="bg-transparent">
      <Modal.form className="w-full flex-col max-w-md p-5 rounded-2xl h-auto shadow-md bg-gray-50 flex items-center justify-center">
        <Modal.header title="Atualizar nome da Lista" 
          className={`${fontSaira} text-lg font-semibold text-gray-900`}/>
        <UpdateList />
      </Modal.form>
    </Modal.container>
  );
};
