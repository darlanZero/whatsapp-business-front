"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { atom, useAtom } from "jotai";
import { useMutation } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { FaChevronLeft, FaRegCheckCircle } from "react-icons/fa";
import { FaCheck, FaPlus, FaSquareWhatsapp } from "react-icons/fa6";

// Components
import PhoneInput from "@/components/input-number";
import { QRCodeDecoder } from "@/components/qr-decoder";
import { SimpleLoader } from "@/components/simple-loader";

import { ResponseAdminWhatsapps, useWhatsapp } from "@/hooks/use-whatsapp";
import { useCreateWhatsapp } from "@/utils/use-create-whatsapp";
import { useGenerateQrCore } from "@/utils/use-generate-code";
import { apiAuth } from "@/utils/api";
import { TOKEN_WHATSAPP_KEY } from "@/utils/cookies-keys";
import { fontSaira } from "@/utils/fonts";
import { formatNumber } from "@/utils/format-number";

import { IWhatsapp } from "@/interfaces/IWhatsapp";
import { getSocket } from "@/utils/socket";
import { queryClient } from "@/providers/query-provider";
import { FormProvider, useFormContext } from "react-hook-form";

const whatsappSelectedAtom = atom<number | null>(null);

interface AuthWhatsappResponse {
  token: string;
}

interface ClientAndAdmin {
  client?: IWhatsapp;
  admin?: ResponseAdminWhatsapps;
}

// Hooks
const useSelectWhatsapp = () => {
  const router = useRouter();

  const handleSelected = useMutation({
    mutationFn: async (whatsappId: number) => {
      const response = await apiAuth.post<AuthWhatsappResponse>(
        `/auth/whatsapp/${whatsappId}`
      );
      return response?.data.token;
    },
    onSuccess: (token) => {
      Cookies.set(TOKEN_WHATSAPP_KEY, token);
      router.push("/dashboard");
      toast.success("Selecionado com sucesso!");
    },
  });

  return { handleSelected };
};

// Validation
const validateStep = (step: number, name: string, phone: string): boolean => {
  switch (step) {
    case 0:
      if (!name?.trim()) {
        toast.error("Nome inválido!");
        return false;
      }
      return true;

    case 1:
      if (!phone?.trim()) {
        toast.error("Digite um número inválido!");
        return false;
      }
      return true;

    default:
      return false;
  }
};

// Components
const WhatsappComponent = ({ whatsapp }: { whatsapp: IWhatsapp }) => {
  const [whatsappSelected, setWhatsappSelected] = useAtom(whatsappSelectedAtom);
  const isSelected = whatsappSelected === whatsapp.id;

  return (
    <div
      data-selected={isSelected}
      className="flex p-4 bg-gray-50/40 opacity-80 hover:opacity-100 data-[selected=true]:opacity-100 border border-zinc-200 items-center transition-shadow rounded-xl gap-2"
    >
      <button
        type="button"
        onClick={() => setWhatsappSelected(whatsapp?.id)}
        data-selected={isSelected}
        className="w-8 h-8 border hover:bg-zinc-100 rounded-full border-zinc-200
        data-[selected=true]:bg-indigo-500 data-[selected=true]:border-indigo-600 text-white grid place-items-center"
      >
        {isSelected && <FaCheck />}
      </button>

      <div className="text-lg font-semibold text-gray-500 rounded p-1 px-2 bg-blue-50">
        {whatsapp?.instanceName}
      </div>

      <div className="text-base font-semibold text-gray-500">
        {formatNumber(whatsapp?.phoneNumber)}
      </div>
    </div>
  );
};

const EnterComponent = () => (
  <section className="flex flex-col p-10 bg-gradient-to-tl from-indigo-700 shadow-xl to-blue-700 rounded-2xl max-w-[28rem]">
    <header className="mx-auto gap-4 text-2xl font-semibold text-white flex items-center">
      <svg
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12 4L4 8L12 12L20 8L12 4Z" fill="currentColor" />
        <path d="M4 12L12 16L20 12" fill="currentColor" />
        <path d="M4 16L12 20L20 16" fill="currentColor" />
      </svg>
      <h2>Salva Zap!</h2>
    </header>

    <section className="flex flex-col gap-2 text-white">
      <header className="text-2xl mt-5 font-semibold text-center">
        <h2 className={fontSaira}>Seja bem vindo(a) à Salva Zap!</h2>
      </header>

      <div className="flex flex-col gap-5 mt-5">
        {[
          "Abra o Whatsapp no seu celular",
          <>
            Toque em <b>Configurações</b> e selecione{" "}
            <b>Aparelhos conectados</b>
          </>,
          <>
            Toque em <b>Conectar um aparelho</b>
          </>,
          "Aponte o celular para esta tela para capturar o código QR",
        ].map((text, index) => (
          <div key={index} className="flex gap-2 items-center">
            <FaRegCheckCircle size={22} className="min-w-6" />
            <span className={fontSaira}>{text}</span>
          </div>
        ))}
      </div>
    </section>

    <footer className="mt-[10rem] flex flex-col">
      <button className="bg-white rounded-lg shadow shadow-gray-700 text-indigo-900 p-3">
        <span className={`${fontSaira} font-semibold`}>Próximo</span>
      </button>
    </footer>
  </section>
);

const GenerateQR = ({ name, phone }: { name: string; phone: string }) => {
  const { data } = useGenerateQrCore({
    name,
    number: phone.replace(/\D/g, ""),
  });

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
    <div className="flex flex-col gap-5 text-gray-600">
      <header className="flex text-center w-full flex-col">
        <h1 className={`${fontSaira} text-3xl text-center font-semibold`}>
          Escaneie o QR Code
        </h1>
      </header>

      {data?.base64 && <QRCodeDecoder base64={data?.base64} />}
    </div>
  );
};

const ShowWhatsapps = ({ client, admin }: ClientAndAdmin) => {
  const [whatsappSelected] = useAtom(whatsappSelectedAtom);
  const { handleSelected } = useSelectWhatsapp();

  const selectWhatsapp = async () => {
    if (whatsappSelected) {
      await handleSelected.mutateAsync(whatsappSelected);
    }
  };

  return (
    <div className="flex flex-col gap-5 w-full m-auto max-w-[25rem]">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="grid place-items-center w-full relative before:content-[''] before:w-30 before:h-6 before:absolute before:bg-blue-500 before:opacity-60 before:blur-xl before:rounded before:top-[80%]"
      >
        <FaSquareWhatsapp size={90} className="text-indigo-500 z-20" />

        <Link
          href="/whatsapp"
          className="w-10 h-10 bg-gradient-to-bl from-indigo-500 to-blue-500 absolute top-0 right-0 rounded-lg hover:shadow-xl grid place-items-center"
        >
          <FaPlus className="text-indigo-100" size={22} />
        </Link>
      </motion.div>

      <motion.span
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`${fontSaira} font-semibold mt-10 text-2xl text-gray-700 text-center`}
      >
        Para continuar, selecione um whatsapp
      </motion.span>

      {client?.id && <WhatsappComponent whatsapp={client} />}

      {admin?.whatsapps?.length &&
        admin.whatsapps.map((e) => (
          <WhatsappComponent key={e.id} whatsapp={e} />
        ))}

      <motion.button
        type="button"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        disabled={!whatsappSelected}
        data-ok={!!whatsappSelected}
        onClick={selectWhatsapp}
        className="p-3 font-semibold transition-all data-[ok=true]:hover:shadow-xl bg-indigo-500 hover:bg-indigo-600 rounded-md text-indigo-100 data-[ok=false]:bg-gray-100 data-[ok=false]:text-gray-400 data-[ok=false]:cursor-default"
      >
        <span className={fontSaira}>Entrar</span>
      </motion.button>
    </div>
  );
};

const Connect = ({ whatsapp }: { whatsapp?: IWhatsapp }) => {
  const [step, setStep] = useState<number>(0);
  const form = useFormContext();

  const handleStep = async () => {
    const name = form.getValues("name");
    const phone = form.getValues("phone");

    if (!validateStep(step, name, phone)) return;

    if (step === 0) {
      setStep(1);
      return;
    }
  };

  useEffect(() => {
    if (whatsapp?.id && whatsapp?.status !== "open") {
      setStep(2);
    }
  }, [whatsapp]);

  const renderStepContent = () => {
    switch (step) {
      case 0:
        return (
          <div className="flex flex-col gap-5 text-gray-600">
            <header className="flex text-center">
              <h1 className={`${fontSaira} text-3xl font-semibold`}>
                Dê um nome para seu whatsapp!
              </h1>
            </header>
            <section className="gap-4 flex flex-col">
              <input
                type="text"
                {...form.register("name")}
                className="p-3 rounded-lg border border-zinc-200"
                placeholder="Digite um nome..."
              />
            </section>
          </div>
        );
      case 1:
        return (
          <div className="flex flex-col gap-5 text-gray-600">
            <header className="flex text-center gap-2">
              <button
                type="button"
                onClick={() => setStep(0)}
                className="bg-gray-50 rounded-full w-10 h-10 grid place-items-center"
              >
                <FaChevronLeft size={20} />
              </button>
              <h1 className={`${fontSaira} text-3xl font-semibold`}>
                Seu número
              </h1>
            </header>
            <section className="gap-4 flex flex-col">
              <PhoneInput
                className="p-3 border border-zinc-200 rounded-lg"
                {...form.register("phone")}
              />
            </section>
          </div>
        );
      case 2:
        return whatsapp?.instanceName ? (
          <GenerateQR
            name={whatsapp.instanceName}
            phone={whatsapp.phoneNumber}
          />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <>
      <EnterComponent />

      <section className="flex flex-col flex-1 gap-4 w-full max-w-[26rem]">
        <div className="flex flex-col my-auto">
          {renderStepContent()}

          {step === 0 && (
            <button
              onClick={handleStep}
              type="button"
              data-loading={form.formState.isSubmitting}
              className="p-3 flex items-center gap-4 bg-indigo-500 text-white rounded-lg w-full mt-5 hover:bg-indigo-700 transition-all shadow-lg font-semibold
              data-[loading=true]:opacity-50 justify-center data-[loading=true]:cursor-default"
            >
              Próximo
            </button>
          )}

          {step === 1 && (
            <button
              onClick={handleStep}
              type="submit"
              data-loading={form.formState.isSubmitting}
              className="p-3 flex items-center gap-4 bg-indigo-500 text-white rounded-lg w-full mt-5 hover:bg-indigo-700 transition-all shadow-lg font-semibold
              data-[loading=true]:opacity-50 justify-center"
            >
              {form.formState.isSubmitting && (
                <SimpleLoader className="w-6 h-6 border-t-white" />
              )}
              Próximo
            </button>
          )}
        </div>

        <footer className="flex gap-2 items-center justify-center">
          {[0, 1, 2].map((index) => (
            <span
              key={index}
              data-selected={step === index}
              className="w-4 h-4 data-[selected=true]:w-10 transition-all bg-gray-200 data-[selected=true]:bg-indigo-500 rounded-full"
            />
          ))}
        </footer>
      </section>
    </>
  );
};

export default function SessionWhatsappExpired() {
  const { whatsapps, isLoading } = useWhatsapp();
  const { form, handleCreate } = useCreateWhatsapp();
  const { client, admin } = whatsapps;

  const shouldShowConnect =
    !admin?.whatsapps?.length && client?.status !== "open";

  const shouldShowWhatsapps =
    admin?.whatsapps?.length || client?.status === "open";

  if (isLoading) {
    return (
      <div className="flex w-full flex-1 h-screen fixed top-0 left-0 z-40 bg-white overflow-auto p-10">
        <div className="flex flex-col m-auto gap-4 w-full max-w-[25rem]">
          <div className="relative grid place-items-center">
            <SimpleLoader className="border-t-indigo-500" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(async (d) => {
          await handleCreate.mutateAsync(d);
        })}
        className="fixed top-0 left-0 z-40 h-screen w-full flex-1 overflow-auto bg-white p-10"
      >
        <div className="m-auto flex lg:flex-row not-lg:items-center not-lg:flex-col-reverse flex-col w-full max-w-[60rem] justify-between gap-6">
          {shouldShowConnect && <Connect whatsapp={client} />}

          {shouldShowWhatsapps && (
            <ShowWhatsapps admin={admin} client={client} />
          )}
        </div>
      </form>
    </FormProvider>
  );
}
