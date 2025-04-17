import { fontSaira } from "@/utils/fonts";
import React, { forwardRef, HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

export type ModalType = "notifications" | "messages" | "config";
export type RecordModal = Record<ModalType, boolean>;

interface ModalOptionsButtonProps extends HTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  name: string;
}
const ModalOptionsContainer = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ children, ...props }, ref) => {
  const { className, ...rest } = props;

  const style = twMerge(
    "flex absolute divide-y rounded-lg top-[100%] right-0 mt-2 bg-white shadow w-full max-w-[15rem] flex-col",
    className
  );

  return (
    <div {...rest} ref={ref} className={style}>
      {children}
    </div>
  );
});

ModalOptionsContainer.displayName = "ModalOptionsContainer";

const ModalOptionsButton = ({
  children,
  name,
  ...props
}: ModalOptionsButtonProps) => {
  return (
    <button
      {...props}
      type="button"
      className="flex p-2 gap-2 items-center hover:bg-zinc-100"
    >
      {children}
      <span className={`${fontSaira} text-zinc-500`}>{name}</span>
    </button>
  );
};

const ModalOptions = {
  container: ModalOptionsContainer,
  button: ModalOptionsButton,
};

export { ModalOptions };
