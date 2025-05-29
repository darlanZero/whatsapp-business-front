import { Button } from "@/components/ui/button";
import { fontInter } from "@/utils/fonts";

const FormActions = () => {
  return (
    <div className="flex w-full flex-col sm:flex-row justify-center sm:justify-end gap-3 mt-1 px-4 sm:px-0">
      <Button
        type="submit"
        variant="default"
        aria-label="Criar Campanha"
        className={`${fontInter} text-sm sm:text-base py-1.5 px-4 sm:py-2 lg:order-1 sm:px-6 bg-indigo-600 hover:bg-indigo-800 text-white rounded-md shadow-lg `}
      >
        Criar Campanha
      </Button>
      
      <Button
        type="button"
        variant="outline"
        aria-label="Cancelar"
        className={`${fontInter} rounded-md text-sm sm:text-base  py-1.5 px-4 sm:py-2 sm:px-6 bg-red-600 hover:bg-red-800 text-white shadow-lg `}
      >
        Cancelar
      </Button>
    </div>
  );
};

export  {FormActions};