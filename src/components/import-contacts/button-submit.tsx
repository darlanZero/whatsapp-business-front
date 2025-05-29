import { fontSaira } from "@/utils/fonts";
import { SimpleLoader } from "../simple-loader";

interface ButtonSubmitProps {
  isPending: boolean;
}

export const ButtonSubmit = ({ isPending }: ButtonSubmitProps) => {
  return (
    <button
      id="import-button"
      type="submit"
      data-loading={isPending}
      className={`p-3 px-4 sm:px-6 mt-5 rounded-lg transition-all flex items-center gap-2 ${fontSaira} font-medium
		bg-indigo-500 text-white`}
    >
      {isPending && (
        <>
          <SimpleLoader className="w-5 h-5" />
          <span className="text-sm sm:text-base">Importando...</span>
        </>
      )}

      {!isPending && <span className="text-sm sm:text-base">Importar</span>}
    </button>
  );
};
