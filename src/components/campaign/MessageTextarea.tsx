import { fontInter } from "@/utils/fonts";
import { Paperclip, Smile } from "lucide-react";

const MessageTextarea = () => {
  return (
    <div className="flex flex-col w-full">
      <label htmlFor="mensagem" className={`${fontInter} mb-1 font-medium text-gray-900`}>
        Mensagem
      </label>
      <div className="relative">
        <textarea
          id="mensagem"
          name="mensagem"
          placeholder="Digite sua mensagem aqui..."
          aria-label="Mensagem"
          rows={4}
          className={`${fontInter} w-full border border-gray-300 rounded-md p-3 pr-16 focus:border-indigo-500 focus:ring-indigo-500 text-gray-800 placeholder-gray-400 resize-none`}
        />
        <div className="absolute bottom-2 right-3 flex items-center gap-2">
          <button
            type="button"
            aria-label="Anexar arquivo"
            className="p-1 rounded-full hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            <Paperclip className="w-5 h-5 text-gray-400" />
          </button>
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
  );
};

export default MessageTextarea;