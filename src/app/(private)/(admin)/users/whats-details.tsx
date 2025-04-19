import { Modal } from "@/components/modal-base";
import { fontSaira } from "@/utils/fonts";

export const WhatsDetails = () => {
  return (
    <Modal.container>
      <Modal.form className="p-5 max-w-[50rem] border border-zinc-200 rounded-xl">
        <Modal.header title="Gerenciar whatsapps" />

        <section className="grid grid-cols-2 gap-3 mt-4">
          <div className="flex p-4 border bg-blue-50/30 rounded-xl border-zinc-200">
            <header className="font-semibold">
              <h1 className={`${fontSaira} text-lg`}>Nova</h1>
            </header>
          </div>
          <div className="flex p-4 border bg-blue-50/30 rounded-xl border-zinc-200">
            <header className="font-semibold">
              <h1 className={`${fontSaira} text-lg`}>Nova</h1>
            </header>
          </div>
        </section>
      </Modal.form>
    </Modal.container>
  );
};
