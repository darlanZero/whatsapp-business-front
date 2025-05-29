import { fontSaira } from "@/utils/fonts";
import { TbTools } from "react-icons/tb";

export default function Unavailable() {
  return (
    <div className="flex w-full flex-1 py-20 select-none">
      <div className="flex m-auto text-gray-500 items-center justify-center flex-col gap-4">
        <TbTools size={50} />

        <span className={`${fontSaira} text-xl font-semibold`}>
          Página em manutenção
        </span>
      </div>
    </div>
  );
}
