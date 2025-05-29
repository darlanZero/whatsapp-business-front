"use client";

import { SimpleLoader } from "@/components/simple-loader";
import { API_BASE_URL } from "@/constants/urls";
import { TOKEN_KEY } from "@/utils/cookies-keys";
import { fontSaira } from "@/utils/fonts";
import { useMutation } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { useSearchParams } from "next/navigation";
import React, { useRef, useState } from "react";
import { FaCircleCheck } from "react-icons/fa6";
import { TbLabelImportantFilled } from "react-icons/tb";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface IApiUploadResponse {
  message: string;
  totalDataLinesProcessed: number;
  successfullySavedContacts: number;
}

const useFileInput = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const handleClick = () => inputRef.current?.click();
  return { inputRef, handleClick };
};

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
    e.stopPropagation();
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
      (selectedFile.type === "text/csv" ||
        selectedFile.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        selectedFile.type === "application/vnd.ms-excel")
    ) {
      setFileName(selectedFile.name);
      setFile(selectedFile);
    } else if (selectedFile) {
      toast.warn("Por favor, selecione um arquivo CSV ou Excel válido.");
      setFileName(null);
      setFile(null);
    }
  };
  const resetFile = () => {
    setFileName(null);
    setFile(null);
  };
  return { fileName, file, handleFile, resetFile };
};

// Hook para gerenciar o AbortController (para cancelamento do upload)
const useAbortControllerHook = () => {
  const abortControllerRef = useRef<AbortController | null>(null);
  const createAbortController = () => {
    abortControllerRef.current = new AbortController();
    return abortControllerRef.current;
  };
  const abortUpload = () => {
    abortControllerRef.current?.abort();
    console.log("Upload cancelado pelo usuário.");
  };
  return { abortControllerRef, createAbortController, abortUpload };
};

// Função de mutação para TanStack Query
const performFileUploadMutation = async ({
  file,
  token,
  listId,
  signal,
}: {
  file: File;
  listId: string;
  token: string;
  signal: AbortSignal;
}): Promise<IApiUploadResponse> => {
  if (!listId) {
    throw new Error("List ID is required for the upload.");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("listId", listId);

  const response = await fetch(`${API_BASE_URL}/contacts/upload`, {
    method: "POST",
    body: formData,
    signal: signal,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  let responseBody;
  try {
    responseBody = await response.json();
  } catch {
    const textResponse = await response.text().catch(() => response.statusText);
    throw new Error(
      `Falha no upload: ${response.status} - ${
        textResponse || "Erro desconhecido."
      }`
    );
  }

  if (!response.ok) {
    const errorMessage =
      responseBody?.message ||
      JSON.stringify(responseBody) ||
      response.statusText;
    throw new Error(
      `Falha no upload: ${response.status} - ${
        errorMessage || "Erro desconhecido."
      }`
    );
  }

  return responseBody as IApiUploadResponse;
};

export const ImportByFile = () => {
  const listId = useSearchParams()?.get("id") || null;
  const { inputRef, handleClick } = useFileInput();
  const { dragActive, handleDrag, handleDrop } = useDragAndDrop();
  const { fileName, file, handleFile, resetFile } = useFileState();
  const { createAbortController, abortUpload: manualAbortUpload } =
    useAbortControllerHook();

  const { mutate: uploadFile, isPending: isLoadingUpload } = useMutation<
    IApiUploadResponse,
    Error,
    { file: File; token: string; signal: AbortSignal; listId: string }
  >({
    mutationFn: performFileUploadMutation,
    onSuccess: (data) => {
      toast.info(
        `Linhas processadas: ${data.totalDataLinesProcessed}. Contatos salvos: ${data.successfullySavedContacts}.`
      );

      resetFile();
    },
    onError: (error: Error) => {
      console.error("Erro na mutação:", error);
      if (error.name === "AbortError") {
        toast.warn("O upload foi cancelado.");
      } else {
        toast.error(
          `Falha no upload: ${error.message || "Erro desconhecido."}`
        );
      }
    },
    onSettled: () => {
      console.log("Upload finalizado (settled).");
    },
  });

  const handleStartUpload = async () => {
    if (!file) {
      toast.warn("Por favor, selecione um arquivo CSV ou Excel primeiro.");
      return;
    }

    const token = Cookies.get(TOKEN_KEY);
    if (!token) {
      toast.error("Erro de autenticação. Por favor, faça login novamente.");
      return;
    }

    const abortController = createAbortController();

    if (listId) {
      uploadFile({
        file,
        token,
        listId,
        signal: abortController.signal,
      });
    }
  };

  const cancelCurrentUpload = () => {
    manualAbortUpload();
  };

  return (
    <div className="flex flex-col mt-4">
      <section
        data-loading={isLoadingUpload}
        className="data-[loading=true]:hidden flex flex-col sm:flex-row gap-4 mt-2"
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
          className={`border-2 flex-1 flex border-dashed gap-2 items-center p-3 rounded-lg text-center cursor-pointer transition-all ${
            dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            onChange={(e) => handleFile(e.target.files?.[0])}
            className="hidden"
            disabled={isLoadingUpload}
          />

          {fileName && (
            <FaCircleCheck className="text-gray-600 flex-shrink-0" />
          )}

          {fileName && (
            <p className="text-gray-500 font-semibold truncate">
              Arquivo: {fileName}
            </p>
          )}

          {!fileName && (
            <p className="text-gray-500 font-semibold">
              Arraste e solte um arquivo CSV/Excel aqui ou clique para
              selecionar
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={handleStartUpload}
          disabled={!file || isLoadingUpload}
          className="bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed font-semibold flex gap-2 items-center text-indigo-50 px-4 py-2 rounded-lg hover:bg-indigo-600 transition-all shadow-xl justify-center"
        >
          <TbLabelImportantFilled />
          {isLoadingUpload ? "Carregando..." : "Carregar Arquivo"}
        </button>
      </section>

      <div
        data-loading={isLoadingUpload}
        className="data-[loading=false]:hidden flex flex-col items-center gap-2 p-10 border border-gray-100 rounded-xl mt-2"
      >
        <header className="font-semibold flex gap-2 items-center text-lg">
          <SimpleLoader className="border-t-gray-500 w-6 h-6 my-4" />
          <h2 className={fontSaira}>Processando arquivo no servidor...</h2>
        </header>
        <p className="text-sm text-gray-600 mt-1">
          Isso pode levar alguns instantes. você pode fechar esse modal!
        </p>
        <button
          type="button"
          onClick={cancelCurrentUpload}
          className="mt-4 bg-gray-200 text-gray-700 p-2 font-semibold px-6 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Cancelar Upload
        </button>
      </div>
    </div>
  );
};
