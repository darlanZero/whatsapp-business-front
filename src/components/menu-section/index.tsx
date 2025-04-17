"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import {
	createContext,
	ElementType,
	HTMLAttributes,
	ReactNode,
	useContext,
	useState
} from "react";
import { twMerge } from "tailwind-merge";
import { Button } from "../ui/button";

interface MenuContextType {
  open: boolean;
  toggle: () => void;
}

interface MenuContainerProps {
  children: ReactNode;
}

interface MenuTriggerProps {
  icon: ElementType;
  label: string;
  className?: string;
}

interface MenuOptionsProps extends HTMLAttributes<HTMLDivElement>{
  children: ReactNode;
}

interface MenuOptionLinkProps {
  href: string;
  icon: ElementType;
  label: string;
}

const MenuContext = createContext<MenuContextType | null>(null);

const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) throw new Error("useMenu must be used within a Menu.Container");
  return context;
};

const MenuContainer = ({ children }: MenuContainerProps) => {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen((prev) => !prev);

  return (
    <MenuContext.Provider value={{ open, toggle }}>
      <div className="flex flex-col relative">{children}</div>
    </MenuContext.Provider>
  );
};

const MenuTrigger = ({ icon: Icon, label, className }: MenuTriggerProps) => {
  const { open, toggle } = useMenu();

  return (
    <Button
      data-open={open}
      onClick={toggle}
      variant="ghost"
      className={twMerge(
        "w-auto justify-start text-black hover:bg-zinc-50 font-black hover:cursor-pointer",
        "data-[open=true]:shadow data-[open=true]:bg-zinc-50 z-20 text-zinc-600",
        className
      )}
    >
      <Icon className="mr-2 h-4 w-4" />
      {label}
      <ChevronDown className="ml-auto h-4 w-4" />
    </Button>
  );
};

const MenuOptions = ({ children }: MenuOptionsProps) => {
  const { open } = useMenu();
  if (!open) return null;

  return (
    <div className="text-zinc-500 flex-1 text-nowrap text-ellipsis overflow-hidden pt-2 rounded pl-8 border-zinc-300 flex flex-col relative">
      {children}
    </div>
  );
};

const MenuOptionLink = ({ href, icon: Icon, label }: MenuOptionLinkProps) => (
  <Link
    href={href}
    className="gap-4 flex-1 font-semibold hover:bg-zinc-100 flex items-center text-sm p-2 rounded px-3"
  >
    <Icon />
    <span>{label}</span>
  </Link>
);

export const Menu = {
  Container: MenuContainer,
  Trigger: MenuTrigger,
  Options: MenuOptions,
  OptionLink: MenuOptionLink,
};
