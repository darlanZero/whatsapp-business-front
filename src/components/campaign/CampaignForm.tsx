"use client";

import { useAllLists } from "@/hooks/use-all-lists";
import {
  createCampaignSchema,
  CreateCampaignSchemaProps,
} from "@/schemas/create-campaign-schema";
import { fontInter, fontOpenSans, fontSaira } from "@/utils/fonts";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { Smile } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ImageUploader } from "./ImageUploader";
import { IoClose } from "react-icons/io5";
import Link from "next/link";

dayjs.extend(utc);

interface CampaignFormProps {
  initialValues?: Partial<CreateCampaignSchemaProps> & { file?: string };
  onSubmit?: (data: CreateCampaignSchemaProps, file: File | null) => void;
  isSubmitting?: boolean;
}

const useCampaignForm = (
  initialValues?: Partial<CreateCampaignSchemaProps>
) => {
  const [file, setFile] = useState<File | null>(null);
  const messageRef = useRef<HTMLTextAreaElement | null>(null);

  const formatDate = (date?: string) =>
    date ? dayjs(date).format("YYYY-MM-DD") : "";

  const formatTimeUTC = (time?: string) =>
    time ? dayjs.utc(time).format("HH:mm") : "";

  const form = useForm<CreateCampaignSchemaProps>({
    resolver: zodResolver(createCampaignSchema),
    defaultValues: {
      ...initialValues,
      startAt: formatDate(initialValues?.startAt),
      endAt: formatDate(initialValues?.endAt),
      startTimeAt: formatTimeUTC(initialValues?.startTimeAt),
      endTimeAt: formatTimeUTC(initialValues?.endTimeAt),
    },
  });

  const insertAtCursor = (text: string) => {
    const textarea = messageRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const value = textarea.value;

    const newValue = value.slice(0, start) + text + value.slice(end);

    textarea.value = newValue;
    form.setValue("content", newValue);

    requestAnimationFrame(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd = start + text.length;
    });
  };

  return {
    messageRef,
    insertAtCursor,
    handles: {
      form,
      file,
      setFile,
    },
  };
};

const CampaignForm = (props: CampaignFormProps) => {
  const { initialValues, onSubmit, isSubmitting } = props;
  const { lists, isLoading: listsLoading } = useAllLists();
  const { messageRef, insertAtCursor, handles } =
    useCampaignForm(initialValues);
  const { form, file, setFile } = handles;
  const { handleSubmit, register } = form;

  useEffect(() => {
    const fetchFile = async () => {
      if (!initialValues?.file) return;

      try {
        const response = await fetch(initialValues.file);
        const blob = await response.blob();

        const filename = initialValues.file.split("/").pop() || "arquivo";
        const file = new File([blob], filename, { type: blob.type });

        setFile(file);
      } catch (error) {
        console.error("Erro ao carregar arquivo da URL:", error);
      }
    };

    fetchFile();
  }, [initialValues?.file, setFile]);

  return (
    <form
      className="bg-white w-full text-gray-500 mx-auto rounded-3xl border border-gray-200 flex flex-col"
      onSubmit={handleSubmit((data) => onSubmit?.(data, file))}
      aria-label="Formulário de criação de campanha"
      autoComplete="off"
    >
      <header className="border-b flex  p-4 justify-between items-center border-zinc-200">
        <h2
          className={`${fontSaira} text-xl sm:text-2xl font-semibold text-gray-600`}
        >
          Criar Nova Campanha
        </h2>

        <Link
          href="/campaign"
          className="w-10 h-10 bg-gray-100 rounded-xl grid place-items-center"
        >
          <IoClose size={22} />
        </Link>
      </header>

      <div
        className={`${fontInter} flex gap-4 overflow-x-auto items-center px-4 border-b py-5 border-zinc-200`}
      >
        <span
          className={`${fontOpenSans} w-[15rem] text-base font-semibold text-gray-600 gap-4`}
        >
          Nome da campanha
        </span>

        <input
          type="text"
          {...register("name")}
          className="p-3 shadow shadow-gray-300 rounded-xl flex-1 outline-none focus:ring-2 ring-indigo-400"
          placeholder="Digite o nome da campanha"
        />
      </div>

      <div className="flex gap-5 items-center overflow-x-auto p-4 border-b flex-wrap border-zinc-200">
        <div className={`${fontInter} flex gap-4 items-center`}>
          <span
            className={`${fontOpenSans} w-[15rem] text-base font-semibold text-gray-600 gap-4`}
          >
            Lista de contatos
          </span>

          {listsLoading && (
            <div className="flex w-[10rem] rounded-lg animate-pulse h-10 bg-gray-200"></div>
          )}

          {!listsLoading && (
            <select
              {...register("listId", { valueAsNumber: true })}
              className="p-3 shadow shadow-gray-300 text-sm w-[10rem] rounded-xl flex-1"
            >
              <option value="0" disabled>
                Selecione uma lista
              </option>
              {lists.map(({ list }) => (
                <option key={list.id} value={list.id}>
                  {list.name}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className={`${fontInter} flex gap-10 flex-1 items-center `}>
          <span
            className={`${fontOpenSans} text-base font-semibold text-gray-600 gap-4`}
          >
            Velocidade da campanha
          </span>

          <span className="flex p-3 flex-1 rounded-lg cursor-not-allowed bg-stone-100">
            Lento
          </span>
        </div>
      </div>

      <div className=" flex p-4 flex-col gap-4 overflow-x-auto flex-wrap items-start border-b border-zinc-200">
        <div className="flex items-center max-w-[60%] gap-4 w-full">
          <span
            className={`${fontOpenSans} w-[15rem] text-base font-semibold text-gray-600 gap-4`}
          >
            Agendar Campanha
          </span>

          <input
            type="date"
            {...register("startAt")}
            className="bg-white flex-1 p-2 rounded-lg shadow shadow-gray-300 "
          />

          <input
            type="date"
            {...register("endAt")}
            className="bg-white flex-1 p-2 rounded-lg shadow shadow-gray-300 "
          />
        </div>
        <div className="flex items-center gap-2 w-full flex-wrap">
          <label
            htmlFor={"funcionamento"}
            className={"flex items-center w-full gap-4"}
          >
            <span
              className={`${fontOpenSans} w-[15rem] text-nowrap w text-base font-semibold text-gray-600 gap-4`}
            >
              Horário de funcionamento
            </span>
            <input
              type="time"
              {...register("startTimeAt")}
              id={"funcionamento"}
              className={`${fontInter} max-w-[10rem] flex-1 p-2 text-sm shadow shadow-zinc-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            />
            <span className="font-semibold text-sm opacity-60">Até às</span>
            <input
              type="time"
              {...register("endTimeAt")}
              id={"funcionamento"}
              className={`${fontInter} max-w-[10rem] flex-1 p-2 text-sm shadow shadow-zinc-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            />
          </label>

          <label
            htmlFor="recurrence"
            className={`${fontInter} mb-1 flex gap-2 items-center text-sm font-medium text-gray-800`}
          >
            <span>Programação</span>
            <select
              id="recurrence"
              name="recurrence"
              disabled={isSubmitting}
              className={`${fontInter} p-3 border border-gray-300 rounded-md bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50`}
              aria-label="Recorrência"
            >
              <option value="uma-vez">Uma vez</option>
              <option value="diariamente">Diariamente</option>
              <option value="semanalmente">Semanalmente</option>
              <option value="mensalmente">Mensalmente</option>
            </select>
          </label>
        </div>
      </div>

      <div className="w-full p-4 border-b border-zinc-200 flex-wrap flex overflow-x-auto">
        <label htmlFor={"funcionamento"} className={"flex w-full gap-4 flex-wrap"}>
          <span
            className={`${fontOpenSans} w-[15rem] text-nowrap text-base font-semibold text-gray-600 gap-4`}
          >
            Arquivo para campanha
          </span>

          <ImageUploader file={file} setFile={(file) => setFile(file)} />
          {file && (
            <div>
              <button
                type="button"
                onClick={() => setFile(null)}
                className="p-2 px-5 border border-dashed bg-gray-100 rounded-xl"
              >
                <span className={`${fontSaira} font-semibold`}>Remover</span>
              </button>
            </div>
          )}
        </label>
      </div>

      <div className="w-full p-4 border-b flex-wrap flex">
        <label htmlFor={"funcionamento"} className={"flex w-full gap-4 flex-wrap"}>
          <span
            className={`${fontOpenSans} w-[15rem] text-nowrap text-base font-semibold text-gray-600 gap-4`}
          >
            Mensagem
          </span>
          <div className="flex flex-col gap-2 flex-1">
            <div>
              <button
                type="button"
                onClick={() => insertAtCursor("[nome]")}
                className="bg-indigo-500 shadow-xl hover:shadow-indigo-300 rounded-full transition-all p-2 text-white px-10 opacity-80 hover:opacity-100"
              >
                <span className={fontSaira}>Nome do destinário</span>
              </button>
            </div>
            <div className="relative flex-1">
              <Controller
                name="content"
                control={form.control}
                render={({ field }) => (
                  <textarea
                    id="mensagem"
                    {...field}
                    placeholder="Digite sua mensagem aqui..."
                    aria-label="Mensagem"
                    ref={messageRef}
                    rows={4}
                    className={`${fontInter} w-full outline-none rounded-md p-3 pr-16 border border-gray-200 *:text-gray-800 placeholder-gray-400 resize-none`}
                  />
                )}
              />
              <div className="absolute bottom-3 right-1 flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Inserir emoji"
                  className="p-1 rounded-full hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                >
                  <Smile className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        </label>
      </div>

      <div className="w-full flex p-5 gap-3">
        <button
          type="submit"
          className={`${fontInter} text-sm transition-all sm:text-base py-1.5 px-4 sm:py-2 sm:px-6 bg-indigo-600 hover:bg-indigo-800 text-white rounded-md shadow-lg `}
        >
          Ativar campanha
        </button>
        <button
          type="button"
          className={`${fontInter} rounded-md text-sm sm:text-base py-1.5 px-4 sm:py-2 sm:px-6 bg-red-600 hover:bg-red-800 text-white shadow-lg `}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

export { CampaignForm };
