import { useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { CloudUpload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fontInter } from "@/utils/fonts";
import { toast } from "react-toastify";
import { IImageUploader } from '@/interfaces/IImageUploader'



const ImageUploader = ({ file, setFile }: IImageUploader) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const { mutate: uploadFile, isPending } = useMutation({
    mutationFn: async (file: File) => {
      //TODO: Substituir pela implementação real. Apenas Simula o upload.
      return new Promise<File>((resolve) => {
        setTimeout(() => resolve(file), 1000);
      });
    },
    onSuccess: (uploadedFile) => {
      setFile(uploadedFile);
      toast.success("Imagem carregada com sucesso!")
    },
    onError: (error) => {
      console.error("Erro no upload:", error);
      //TODO: Add Adicione tratamento de erro personalizado aqui
      toast.error("Erro ao carregar imagem. Tente novamente mais tarde!")
    }
  });

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files?.[0]) {
      uploadFile(e.dataTransfer.files[0]);
    }
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files?.[0]) {
      uploadFile(e.target.files[0]);
    }
  }

  return (
    <div
      className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg px-4 py-6 w-full
        ${isPending ? "border-indigo-500 bg-indigo-50" : "border-gray-300 bg-gray-50"}
      `}
      aria-label="Upload de imagem"
      tabIndex={0}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragOver} // Reutilizamos a mesma função
      onDragEnd={handleDragOver}   // Reutilizamos a mesma função
      onClick={() => inputRef.current?.focus()}
    >
      <CloudUpload className={`w-10 h-10 mb-2 ${isPending ? "text-indigo-600 animate-pulse" : "text-indigo-500"}`} aria-hidden="true" />
      <p className={`${fontInter} text-gray-700 text-center mb-3`}>
        {isPending ? "Processando upload..." : "Arraste e solte sua imagem aqui ou faça upload"}
      </p>
      <Button
        type="button"
        variant="default"
        aria-label="Selecionar Arquivo"
        className={`${fontInter} bg-indigo-600 hover:bg-indigo-700 text-white mb-2 ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
        onClick={() => !isPending && inputRef.current?.click()}
        disabled={isPending}
      >
        {isPending ? "Enviando..." : "Selecionar Arquivo"}
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept="image/png, image/jpeg"
        className={`${fontInter} hidden`}
        onChange={handleFileChange}
        aria-label="Selecionar Arquivo"
        tabIndex={-1}
        disabled={isPending}
      />
      <span className={`${fontInter} text-xs text-gray-700`}>PNG, JPG até 10MB</span>
      {file && (
        <div className="mt-2 flex items-center gap-2">
          <span className={`${fontInter} text-sm font-medium text-gray-700`}>{file.name}</span>
          {isPending && (
            <span className={`${fontInter} text-xs text-indigo-600`}>Enviando...</span>
          )}
        </div>
      )}
    </div>
  );
};

export  {ImageUploader};