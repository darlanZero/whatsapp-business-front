import { Modal } from "@/components/modal-base";
import { fontSaira } from "@/utils/fonts";

export const WhatsDetails = () => {
  return (
    <Modal.container>
      <Modal.form className="p-5 max-w-[50rem] border border-zinc-200 rounded-xl">
        <Modal.header title="Gerenciar whatsapps" />

        <section className="grid gap-3 mt-2">
          <div className="flex p-4 border bg-blue-50/30 rounded-xl">
            <header className="font-semibold">
              <h1 className={`${fontSaira} text-lg`}>Em breve</h1>
            </header>
          </div>
        </section>
      </Modal.form>
    </Modal.container>
  );
};
