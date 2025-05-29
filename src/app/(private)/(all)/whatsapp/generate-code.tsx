import { Loader } from "@/components/loader";
import { Modal } from "@/components/modal-base";
import { QRCodeDecoder } from "@/components/qr-decoder";
import { IWhatsapp } from "@/interfaces/IWhatsapp";
import { queryClient } from "@/providers/query-provider";
import { fontSaira } from "@/utils/fonts";
import { getSocket } from "@/utils/socket";
import { useGenerateQrCore } from "@/utils/use-generate-code";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-toastify";

export const GenerateQrCode = () => {
  const params = useSearchParams();
  const number = params.get("number");
  const instance = params.get("name");
  const { data } = useGenerateQrCore({ name: instance, number });

  useEffect(() => {
    const socket = getSocket();

    socket.on("whatsapp-connection", async (data: IWhatsapp) => {
      if (data?.status === "open") {
        toast.success("Whatsapp conectando com sucesso!");
        await queryClient.invalidateQueries({ queryKey: ["whatsapp"] });
      }
    });

    return () => {
      socket.off("whatsapp-connection");
    };
  }, []);

  return (
    <Modal.container>
      <Modal.form className="p-4 flex justify-center border border-zinc-200 rounded-xl items-center">
        <Modal.header title="Gerar" />
        <h2
          className={`${fontSaira} text-2xl mt-5 text-center font-semibold text-gray-600`}
        >
          Scaneia o QR Code para conectar seu whatsapp
        </h2>

        {data?.base64 && <QRCodeDecoder base64={data?.base64} />}

        {!data?.base64 && (
          <div className="relative mb-10">
            <Loader className="text-zinc-800 my-6" />
          </div>
        )}
      </Modal.form>
    </Modal.container>
  );
};
