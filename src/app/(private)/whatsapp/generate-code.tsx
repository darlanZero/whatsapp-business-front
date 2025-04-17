import { Modal } from "@/components/modal-base";
import { QRCodeDecoder } from "@/components/qr-decoder";
import { queryClient } from "@/providers/query-provider";
import { api } from "@/utils/api";
import { fontSaira } from "@/utils/fonts";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect } from "react";

interface useGenerateQrCoreProps {
  name?: string | null;
  number?: string | null;
}

type GetQrCode = {
  base64: string;
};

const useGenerateQrCore = (props: useGenerateQrCoreProps) => {
  const { data } = useQuery({
    queryKey: ["whatsapp", "qrcode"],
    enabled: !!props.name && !!props.number,
    queryFn: async () => {
      const url = `/whatsapp/instance/connect/${props.name}?phoneNumber=${props.number}`;
      return (await api.get<GetQrCode>(url))?.data;
    },
  });

  const invalidateQueries = useCallback(async () => {
    await queryClient.invalidateQueries({
      queryKey: ["whatsapp"],
    });
  }, []);

  useEffect(() => {
    return () => {
      invalidateQueries();
    };
  }, [invalidateQueries]);

  return {
    data,
  };
};

export const GenerateQrCode = () => {
  const params = useSearchParams();
  const number = params.get("number");
  const instance = params.get("name");

  const { data } = useGenerateQrCore({ name: instance, number });

  return (
    <Modal.container>
      <Modal.form className="p-4 flex justify-center shadow-lg rounded-xl items-center">
        <Modal.header title="Gerar" />
        <h2
          className={`${fontSaira} text-2xl mt-5 text-center font-semibold text-gray-600`}
        >
          Scaneia o QR Code para conectar seu whatsapp
        </h2>
        {data?.base64 && <QRCodeDecoder base64={data?.base64} />}
      </Modal.form>
    </Modal.container>
  );
};
