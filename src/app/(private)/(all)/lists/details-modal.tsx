// import { DetailsList } from "@/components/create-list-contact/details-list";
import { Modal } from "@/components/modal-base";
import Unavailable from "@/components/unavailable";
import { fontSaira } from "@/utils/fonts";

export const DetailsListModal = () => {
  return (
    <Modal.container>
      <Modal.form className="rounded-xl">
        <Modal.header
          title="Detalhes da Lista"
          className={`${fontSaira} text-gray-800 font-bold p-4 `}
        />
        <Unavailable/>
        {/* <DetailsList /> */}
      </Modal.form>
    </Modal.container>
  );
};
