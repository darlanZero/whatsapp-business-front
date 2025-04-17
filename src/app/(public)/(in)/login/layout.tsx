import { fontSaira } from "@/utils/fonts";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { IoMenu } from "react-icons/io5";

const pages = [
  { name: "Sobre a Plataforma", link: "#" },
  { name: "Recursos", link: "#" },
  { name: "Blog", link: "#" },
  { name: "Contato", link: "#" },
] as const;

const Icon = () => {
  return (
    <div className="w-[20rem] h-[40rem] relative -mt-[12rem] lg:mt-0 z-20">
      <Image
        src="/message_mascote.png"
        alt="mascote_message"
        width={250}
        height={250}
        className="absolute top-[30%] left-[-50%]"
      />
      <Image
        src="/mascote.png"
        alt="mascote"
        className="z-20"
        fill
        style={{ objectFit: "cover" }}
      />
      
      <div className="flex w-[12rem] h-[2rem] bg-black rounded-full blur-2xl absolute bottom-14 right-5" />
    </div>
  );
};
const Menu = () => {
  return (
    <header className="w-full p-5 flex lg:hidden">
      <IoMenu size={50} />
    </header>
  );
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="w-full p-7 hidden lg:flex">
        <div className="mx-auto flex gap-10 items-center w-full max-w-[60rem]">
          {pages.map((page, index: number) => {
            return (
              <Link
                href="#"
                key={index}
                className={`${fontSaira} opacity-80 hover:opacity-100 text-zinc-200 text-lg`}
              >
                {page.name}
              </Link>
            );
          })}
        </div>
      </header>

      <Menu />

      <section className="flex lg:mt-0 gap-20 mx-auto px-5 w-full py-5 max-w-[60rem] items-center flex-col-reverse lg:flex-row justify-center lg:justify-between ">
        <Icon />
        {children}
      </section>
    </>
  );
}
