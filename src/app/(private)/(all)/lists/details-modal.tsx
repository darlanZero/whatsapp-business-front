import { DetailsList } from "@/components/create-list-contact/details-list";
import { Modal } from "@/components/modal-base";
import { fontSaira } from "@/utils/fonts";

export const DetailsListModal = () => {
  return (
    <Modal.container>
      <Modal.form>
        <Modal.header
          title="Detalhes da Lista"
          className={`${fontSaira} text-gray-800 font-bold p-4 `}
        />
        <DetailsList />
      </Modal.form>
    </Modal.container>
  );
};
