"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fontInter, fontSaira } from "@/utils/fonts";
import { Eye, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { CiImport } from "react-icons/ci";
import { IoMdContact } from "react-icons/io";

// Definição da interface no mesmo arquivo
type ListCardProps = {
  id: number;
  title: string;
  onPopulate?: () => void;
  onViewDetails?: () => void;
};

const ListCard = ({ id, title, onPopulate, onViewDetails }: ListCardProps) => {
  const router = useRouter();

    const handlerDelete = () => {
        router.push(`?modal=delete&listId=${id}`);
      };

  return (
    <Card className="w-full bg-white p-4 sm:p-6 flex flex-col transition-all hover:shadow-xl hover:-translate-y-0.5">
      <div className="flex justify-end mb-2">
        <Button
          size="sm"
          variant="ghost"
          onClick={onViewDetails}
          className={`${fontInter} text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 flex items-center gap-1`}
        >
          <Eye className="h-4 w-4" />
          <span>Ver Detalhes</span>
        </Button>
      </div>

      <div className="flex-1 flex flex-col justify-between space-y-4">
        <div className="p-2 sm:p-3 bg-blue-50/70 rounded-xl">
          <h2
            className={`${fontSaira} text-xl sm:text-2xl font-semibold text-center text-gray-900 line-clamp-2`}
          >
            {title}
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
          <Button
            onClick={onPopulate}
            className={`${fontInter} bg-indigo-700 hover:bg-indigo-900 text-white w-full sm:w-auto`}
          >
            Popular
          </Button>

          <Button
            variant="destructive"
            className={`${fontInter} bg-red-600 hover:bg-red-700 flex items-center gap-1 w-full sm:w-auto`}
            onClick={handlerDelete}
          >
            <Trash2 className="h-4 w-4" />
            Excluir
          </Button>
        </div>
      </div>
    </Card>
  );
};

export { ListCard };