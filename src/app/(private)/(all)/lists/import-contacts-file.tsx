"use client";

import { SimpleLoader } from "@/components/simple-loader";
import { API_BASE_URL } from "@/constants/urls";
import { queryClient } from "@/providers/query-provider";
import { TOKEN_KEY } from "@/utils/cookies-keys";
import { fontInter, fontSaira } from "@/utils/fonts";
import { formatNumber } from "@/utils/format-number";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useAtom } from "jotai";
import Cookies from "js-cookie";
import { useRef, useState } from "react";
import { FaCheck } from "react-icons/fa";
import { FaCircleCheck } from "react-icons/fa6";
import { TbLabelImportantFilled } from "react-icons/tb";
import { toast } from "react-toastify";
import { IWhatsappToCreate, contactsAtoms } from "./atom";

interface IResponseImportScv {
  name: string;
  phone: string;
  progress?: number;
}

// Função para transformar NDJSON em objetos JSON
const parseNDJSON = () => {
  let ndjsonBuffer = "";
  return new TransformStream({
    transform(chunk, controller) {
      console.log(chunk);
      ndjsonBuffer += chunk;
      const items = ndjsonBuffer.split("\n");
      items
        .slice(0, -1)
        .forEach((item) => controller.enqueue(JSON.parse(item)));
      ndjsonBuffer = items[items.length - 1];
    },
    flush(controller) {
      if (ndjsonBuffer) controller.enqueue(JSON.parse(ndjsonBuffer));
    },
  });
};

// Hook para gerenciar o input file
const useFileInput = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => inputRef.current?.click();

  return { inputRef, handleClick };
};

// Hook para gerenciar drag-and-drop
const useDragAndDrop = () => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
  };

  return { dragActive, handleDrag, handleDrop };
};

// Hook para gerenciar o estado do arquivo
const useFileState = () => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleFile = (selectedFile: File | undefined) => {
    if (
      selectedFile &&
      (
        selectedFile.type === "text/csv" ||
        selectedFile.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        selectedFile.type === "application/vnd.ms-excel"
      )
    ) {
      setFileName(selectedFile.name);
      setFile(selectedFile);
    }
  };
  

  return { fileName, file, handleFile };
};

const useStreamingState = () => {
  const [items, setItems] = useState<IResponseImportScv[]>([]);

  const addItem = (chunk: IResponseImportScv) => {
    if (chunk?.name) {
      setItems((prev) => [...prev, chunk]);

      queryClient.setQueryData(
        ["contacts", "csv"],
        (data: IResponseImportScv[]) => {
          return [...data, chunk];
        }
      );
    }
  };

  const resetStream = () => {
    setItems([]);
  };

  return { items, handleItem: addItem, resetStream };
};

const useAbortController = () => {
  const abortControllerRef = useRef<AbortController | null>(null);

  const createAbortController = () => {
    abortControllerRef.current = new AbortController();
  };

  const abortStreaming = () => {
    abortControllerRef.current?.abort();
    console.log("Streaming parado.");
  };

  return { abortControllerRef, createAbortController, abortStreaming };
};

const handleFileUpload = async (
  file: File,
  token: string,
  onItemReceived: (chunk: IResponseImportScv) => void,
  abortController: AbortController
) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch(`${API_BASE_URL}/contacts/upload`, {
      method: "POST",
      body: formData,
      signal: abortController.signal,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const reader = response.body
      ?.pipeThrough(new TextDecoderStream())
      .pipeThrough(parseNDJSON());

    if (reader) {
      const writable = new WritableStream({
        write(chunk) {
          onItemReceived(chunk);
        },
        abort(reason) {
          console.log("Stream aborted:", reason);
        },
      });

      await reader.pipeTo(writable, { signal: abortController.signal });
    }
  } catch {
    console.log("houve um erro ao tentar pegar os dados");
  }
};

const useContacts = () => {
  const [contacts, setContacts] = useAtom(contactsAtoms);

  const addItem = (data: IWhatsappToCreate) => {
    setContacts((prev) => {
      const currentContacts = prev || [];

      const existingIndex = currentContacts.findIndex(
        (c) => c.phoneNumber === data.phoneNumber
      );

      if (existingIndex >= 0) {
        return [
          ...currentContacts.slice(0, existingIndex),
          ...currentContacts.slice(existingIndex + 1),
        ];
      }

      return [
        ...currentContacts,
        {
          ...data,
          id: Date.now().toString(), // ID único
          createdAt: new Date().toISOString(),
        },
      ];
    });
  };

  return {
    contacts,
    setContacts,
    addItem,
  };
};

const areAllItemsIncluded = (
  smallerArray: IResponseImportScv[],
  largerArray: IWhatsappToCreate[]
): boolean => {
  return smallerArray.every((smallItem) =>
    largerArray.some(
      (largeItem) => largeItem.phoneNumber === smallItem.phone.split("@")[0]
    )
  );
};

export const ImportCSV = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { inputRef, handleClick } = useFileInput();
  const { dragActive, handleDrag, handleDrop } = useDragAndDrop();
  const { fileName, file, handleFile } = useFileState();
  const { items, handleItem, resetStream } = useStreamingState();
  const { addItem, setContacts, contacts } = useContacts();
  const { abortControllerRef, createAbortController, abortStreaming } =
    useAbortController();

  const { data: contactsIn } = useQuery<IResponseImportScv[]>({
    queryKey: ["contacts", "csv"],
    queryFn: async () => {
      const cachedData = queryClient.getQueryData<IResponseImportScv[]>([
        "contacts",
        "csv",
      ]);

      return cachedData || []; // Retorna os dados do cache ou um array vazio
    },
  });

  const selectAll = () => {
    setContacts((prev) => {
      if (!contactsIn?.length) return prev;

      const newContacts = contactsIn
        .filter(
          (c) => !prev.some((p) => p.phoneNumber === c.phone.split("@")[0])
        )
        .map((c) => ({
          name: c.name,
          phoneNumber: c.phone.split("@")[0],
        }));

      return [...prev, ...newContacts];
    });
  };

  // Função para lidar com a mudança no input file
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFile(e.target.files?.[0]);
  };

  // Função para iniciar o streaming
  const startStreaming = async () => {
    if (!file) return;

    createAbortController();
    setLoading(true);
    resetStream();

    try {
      const token = Cookies.get(TOKEN_KEY) || null;

      if (!token) {
        toast.error("Houve um erro ao tentar fazer o request");
        return;
      }

      await handleFileUpload(
        file,
        token,
        handleItem,
        abortControllerRef.current!
      );
    } catch {
      console.log("Houve um erro");
    } finally {
      setLoading(false);
    }
  };

  const selectedAll = contactsIn
    ? areAllItemsIncluded(contactsIn, contacts)
    : false;

  return (
    <div className="flex flex-col mt-4">
      <section
        data-loading={loading}
        className="data-[loading=true]:hidden flex gap-4 mt-2"
      >
        <div
          onClick={handleClick}
          onDrop={(e) => {
            handleDrop(e);
            handleFile(e.dataTransfer.files[0]);
          }}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          data-loading={loading}
          className={`border-2 data-[loading=true]:hidden flex-1 flex border-dashed gap-2 items-center p-3 rounded-lg text-center cursor-pointer transition-all ${
            dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".csv"
            onChange={handleChange}
            className="hidden"
          />

          {fileName && <FaCircleCheck className="text-gray-600" />}

          {fileName && (
            <p className="text-gray-500 font-semibold">
              Arquivo selecionado: {fileName}
            </p>
          )}

          {!fileName && (
            <p className="text-gray-500 font-semibold">
              Arraste e solte um arquivo CSV aqui ou clique para selecionar
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={startStreaming}
          data-ok={!!file}
          className="bg-indigo-500 data-[ok=false]:opacity-40 data-[ok=false]:cursor-default data-[ok=false]:pointer-events-none font-semibold flex gap-2 items-center text-indigo-50 px-4 py-2 rounded-lg hover:bg-indigo-600 transition-all shadow-xl"
        >
          <TbLabelImportantFilled />
          Carregar
        </button>
      </section>

      <div
        data-loading={loading}
        className="data-[loading=false]:hidden flex flex-col items-center gap-2 p-10 border border-gray-100 rounded-xl mt-2"
      >
        <header className="font-semibold flex gap-2 items-center text-lg">
          <SimpleLoader className="border-t-gray-500 w-6 h-6 my-4" />
          <h2 className={fontSaira}>Carregando dados do .CSV</h2>
        </header>

        <div className="w-full flex bg-gray-100 overflow-hidden h-4 rounded-full">
          <motion.div
            className="bg-gradient-to-r from-indigo-500 to-blue-600 shadow-xl h-full rounded-full transition-all"
            animate={{ width: `${items?.[items?.length - 1]?.progress}%` }}
          />
        </div>

        <button
          type="button"
          onClick={abortStreaming}
          className="bg-gray-100 text-gray-600 p-2 font-semibold px-4 rounded-full"
        >
          Cancelar
        </button>
      </div>

      {!!contactsIn?.length && (
        <div className="flex font-semibold justify-between items-center mt-6 py-3">
          <div className="flex gap-2">
            <button
              onClick={selectAll}
              data-selected={selectedAll}
              className="w-6 h-6 bg-white border border-zinc-200 rounded-lg data-[selected=true]:bg-indigo-600 data-[selected=true]:border-indigo-500 grid place-items-center"
              type="button"
            >
              {contacts?.length === contacts?.length && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <FaCheck className="text-white" size={10} />
                </motion.div>
              )}
            </button>

            <span className={fontInter}>Selecionar todos</span>
          </div>

          <span>{contacts?.length} contatos selecionados</span>
        </div>
      )}

      <div
        data-loading={loading}
        className="data-[loading=true]:hidden bg-gray-50/50 rounded-xl border max-h-[20rem] overflow-auto"
      >
        <div className="divide-y flex flex-col">
          {contactsIn &&
            contactsIn.map((item, idx) => (
              <div
                key={idx}
                className="p-3 text-gray-500 justify-between flex gap-2 items-center font-semibold"
              >
                <div className="flex gap-2 items-center">
                  <button
                    data-selected={contacts?.some(
                      (c) => c.phoneNumber === item.phone
                    )}
                    className="w-6 h-6 bg-white border border-zinc-200 rounded-lg data-[selected=true]:bg-indigo-600
                    data-[selected=true]:border-indigo-500 grid place-items-center"
                    type="button"
                    onClick={() =>
                      addItem({ name: item.name, phoneNumber: item.phone })
                    }
                  >
                    {contacts?.some((c) => c.phoneNumber === item.phone) && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                      >
                        <FaCheck className="text-white" size={10} />
                      </motion.div>
                    )}
                  </button>
                  <span className="px-2 bg-gray-100 rounded-xl">
                    {item.name}
                  </span>
                </div>
                <span>{formatNumber(item?.phone)}</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
