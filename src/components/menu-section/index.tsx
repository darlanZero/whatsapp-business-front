"use client";

import { fontSaira } from "@/utils/fonts";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  createContext,
  ElementType,
  HTMLAttributes,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { twMerge } from "tailwind-merge";
import { Button } from "../ui/button";

interface MenuContextType {
  open: boolean;
  toggle: () => void;
  set: (value: boolean) => void;
}

interface MenuContainerProps {
  children: ReactNode;
}

interface MenuTriggerProps {
  icon: ElementType;
  label: string;
  className?: string;
  isTri?: boolean;
  selected?: boolean;
  onPress?: () => void;
}

interface MenuOptionsProps extends HTMLAttributes<HTMLDivElement> {
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
    <MenuContext.Provider value={{ open, toggle, set: setOpen }}>
      <motion.div
        data-open={open}
        initial={{ height: "2.5rem" }}
        animate={{ height: open ? "auto" : "2.5rem" }}
        className={`${fontSaira} flex flex-col relative rounded-lg
        data-[open=true]:bg-blue-900/5 border border-transparent data-[open=true]:border-zinc-200`}
      >
        {children}
      </motion.div>
    </MenuContext.Provider>
  );
};

const MenuTrigger = (props: MenuTriggerProps) => {
  const { icon: Icon, label, className, isTri = true } = props;
  const { selected, onPress } = props;
  const { open, toggle } = useMenu();

  return (
    <Button
      data-open={open}
      onClick={() => {
        if (onPress) onPress();
        else toggle();
      }}
      variant="ghost"
      data-selected={selected}
      className={twMerge(
        "w-auto justify-start hover:cursor-pointer data-[open=true]:bg-white border border-transparent data-[open=true]:border-zinc-200",
        "transition-all z-20 text-blue-950 text-md m-1 overflow-hidden",
        "data-[selected=true]:bg-blue-600 data-[selected=true]:text-blue-100",
        className
      )}
    >
      <Icon className="mr-2 h-4 w-4" />
      {label}

      {isTri && <ChevronDown className="ml-auto h-4 w-10" />}
    </Button>
  );
};

const MenuOptions = ({ children }: MenuOptionsProps) => {
  const { open } = useMenu();

  return (
    <motion.div
      data-open={open}
      className="text-zinc-500 flex-1 text-nowrap text-ellipsis overflow-hidden p-1 rounded border-zinc-300 flex flex-col relative"
    >
      {children}
    </motion.div>
  );
};

const MenuOptionLink = ({ href, icon: Icon, label }: MenuOptionLinkProps) => {
  const path = usePathname();
  const { set, open } = useMenu();

  useEffect(() => {
    const isActive = path.startsWith(href);
    set(isActive);
  }, [path, href, set]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: open ? 1 : 0 }}
      transition={{ duration: 0.3 }}
    >
      <Link
        href={href}
        style={{ cursor: !path.startsWith(href) ? "pointer" : "default" }}
        data-selected={path.startsWith(href)}
        className="gap-4 flex-1 hover:text-black transition-all flex items-center text-sm p-1 px-3 data-[selected=true]:border-blue-700
        data-[selected=true]:bg-indigo-500 rounded data-[selected=true]:text-blue-50 data-[selected=true]:shadow-md data-[selected=true]:shadow-indigo-500/40"
      >
        <Icon size={16}/>
        <span className="text-base">{label}</span>
      </Link>
    </motion.div>
  );
};

export const Menu = {
  Container: MenuContainer,
  Trigger: MenuTrigger,
  Options: MenuOptions,
  OptionLink: MenuOptionLink,
};
