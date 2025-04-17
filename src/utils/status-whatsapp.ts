import { StatusWhatsapp } from "@/interfaces/IWhatsapp";

export const StatusWhatsappStyle: Record<StatusWhatsapp, string> = {
  close: "bg-red-500/20 text-red-500 border-red-400",
  connecting: "bg-orange-500/10 text-orange-500 border-orange-400",
  open: "bg-emerald-500/10	 text-emerald-500 border-emerald-400",
};

export const StatusWhatsappLegend: Record<StatusWhatsapp, string> = {
  close: "Fechado",
  connecting: "Conectando",
  open: "Aberta",
};
