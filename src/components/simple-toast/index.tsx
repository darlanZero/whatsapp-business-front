import { fontSaira } from "@/utils/fonts";

export const useToast = ({ message }: { message: string }) => (
  <div className={`${fontSaira} text-base text-zinc-200`}>{message}</div>
);
