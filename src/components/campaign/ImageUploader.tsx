import { useRef, useEffect, useState } from "react";
import { CloudUpload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fontInter } from "@/utils/fonts";
import { IImageUploader } from "@/interfaces/IImageUploader";

const ImageUploader = ({ file, setFile }: IImageUploader) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files?.[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  }

  // Gera uma URL de visualização ao selecionar um novo arquivo
  useEffect(() => {
    if (!file) return;

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url); // limpa a URL anterior
  }, [file]);

   const renderPreview = () => {
    if (!file || !previewUrl) return null;

    if (file.type.startsWith("image/")) {
      return (
        <img
          src={previewUrl}
          alt="Preview"
          className="max-w-xs mt-2 rounded-lg shadow"
        />
      );
    }

    if (file.type.startsWith("video/")) {
      return (
        <video controls className="max-w-xs mt-2 rounded-lg shadow">
          <source src={previewUrl} type={file.type} />
          Seu navegador não suporta o elemento de vídeo.
        </video>
      );
    }

    if (file.type.startsWith("audio/")) {
      return (
        <audio controls className="mt-2">
          <source src={previewUrl} type={file.type} />
          Seu navegador não suporta o elemento de áudio.
        </audio>
      );
    }

    if (file.type === "application/pdf") {
      return (
        <iframe
          src={previewUrl}
          className="w-full h-64 mt-2 border border-gray-300 rounded-lg"
          title="PDF Preview"
        />
      );
    }

    return (
      <p className="text-sm text-gray-500 mt-2">
        Arquivo não suportado para visualização.
      </p>
    );
  };

  return (
    <div
      className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg px-4 py-6 border-gray-300 bg-gray-50"
      aria-label="Upload de arquivo"
      tabIndex={0}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragOver}
      onDragEnd={handleDragOver}
      onClick={() => inputRef.current?.click()}
    >
      <CloudUpload className="w-10 h-10 mb-2 text-indigo-500" />
      <p className={`${fontInter} text-gray-700 text-center mb-3`}>
        Arraste e solte o arquivo aqui ou clique para selecionar
      </p>
      <Button
        type="button"
        variant="default"
        onClick={(e) => {
          e.stopPropagation(); // ← impede que o clique chegue ao div pai
          inputRef.current?.click();
        }}
        className={`${fontInter} bg-indigo-600 hover:bg-indigo-700 text-white mb-2`}
      >
        Selecionar Arquivo
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,video/mp4,audio/mpeg,application/pdf"
        className="hidden"
        onChange={handleFileChange}
      />
      <span className={`${fontInter} text-xs text-gray-700`}>
        PNG, JPG, MP4, MP3, PDF — até 10MB
      </span>

      {file && (
        <div className="w-full mt-4 flex flex-col items-center justify-center">
          <span className={`${fontInter} text-sm font-medium text-gray-700`}>
            {file.name}
          </span>
          {renderPreview()}
        </div>
      )}
    </div>
  );
};

export { ImageUploader };
