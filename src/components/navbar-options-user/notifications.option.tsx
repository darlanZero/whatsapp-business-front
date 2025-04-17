"use client";

import { useClickOutside } from "@/hooks/use-click-outside";
import { fontSaira } from "@/utils/fonts";
import { useRef } from "react";
import { ModalOptions } from "../modal-options";

interface NavBarNotificationOptionProps {
  close: () => void;
}

export const NavBarNotificationOption = ({
  close,
}: NavBarNotificationOptionProps) => {
  const divRef = useRef<HTMLDivElement>(null);
  useClickOutside(divRef, close);

  return (
    <ModalOptions.container ref={divRef}>
      <div className="flex items-center justify-center select-none p-2 h-[5rem] text-zinc-500">
        <span className={fontSaira}>Nenhuma mensagem</span>
      </div>
    </ModalOptions.container>
  );
};
