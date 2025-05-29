import { DetailsList } from "@/components/create-list-contact/details-list";
import { Modal } from "@/components/modal-base";
import { fontSaira } from "@/utils/fonts";

export const DetailsListModal = () => {
  return (
    <Modal.container className="bg-blue-900/20">
      <Modal.box className="rounded-3xl max-w-[80rem] shadow overflow-hidden">
        <Modal.header
          title="Detalhes da Lista"
          className={`${fontSaira} text-gray-800 font-bold p-4 `}
        />
        <DetailsList />
      </Modal.box>
    </Modal.container>
  );
};
