"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { fontInter, fontOpenSans, fontSaira } from "@/utils/fonts";
import { Eye, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { CiImport } from "react-icons/ci";
import { IoMdContact } from "react-icons/io";

type ListCardProps = {
  id: number;
  title: string;
  count: { contacts: number };
  onPopulate?: () => void;
  onViewDetails?: () => void;
};

const ListCard = ({
  id,
  count,
  title,
  onPopulate,
  onViewDetails,
}: ListCardProps) => {
  const router = useRouter();

  return (
    <Card className="w-full bg-white p-6 gap-2 flex flex-col transition-all hover:shadow-xl hover:translate-y-[-2px]">
      <div className="flex justify-between">
        <div className="font-semibold gap-0.5 items-center justify-center flex text-gray-500">
          <IoMdContact />
          <span>{count?.contacts}</span>
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={onViewDetails}
          className={`${fontOpenSans} text-indigo-900 hover:text-indigo-950 hover:bg-indigo-50 flex items-center gap-1`}
        >
          <Eye className="h-4 w-4" />
          <span>Ver Detalhes</span>
        </Button>
      </div>
      <div className="flex-1 flex flex-col gap-3 justify-between">
        <div className="p-3 bg-blue-50/70 rounded-xl">
          <h2
            className={`${fontSaira} text-2xl font-semibold text-center text-gray-900 line-clamp-2`}
          >
            {title}
          </h2>
        </div>

        <div className="flex gap-3 justify-between">
          <button
            onClick={onPopulate}
            className={`${fontSaira} bg-gradient-to-br from-indigo-50 to-purple-50 hover:from-indigo-100 hover:shadow-inner shadow-indigo-500/10 transition-all flex gap-2 items-center text-indigo-900 p-1 rounded-xl px-5`}
          >
            <CiImport size={20} />
            <span>Popular</span>
          </button>

          <button
            onClick={() => router.push(`?modal=delete&listId=${id}`)}
            className={`${fontInter} grid items-center hover:bg-gray-100 w-10 h-10 bg-gray-50 rounded-xl place-items-center gap-1`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </Card>
  );
};

export { ListCard };
