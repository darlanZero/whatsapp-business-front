"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import Link from "next/link";

const NavBar = () => {
  return (
    <div className="w-full bg-salvazap-dark-blue/90 backdrop-blur-sm border-b border-white/10 py-3 px-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="text-white hover:text-gray-400 font-bold text-xl">
            SalvaZap
          </Link>
        </div>

        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink
                href="/"
                className={cn(
                  "group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-white transition-colors hover:text-gray-400  focus:bg-salvazap-hover-blue focus:outline-none"
                )}
              >
                Início
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                href="/about"
                className={cn(
                  "group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-white transition-colors hover:text-gray-400"
                )}
              >
                Sobre
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                href="/services"
                className={cn(
                  "group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-white transition-colors hover:text-gray-400"
                )}
              >
                Serviços
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                href="/contact"
                className={cn(
                  "group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-white transition-colors hover:text-gray-400"
                )}
              >
                Contato
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center space-x-3">
          <Link href="/login">
            <Button variant="ghost" className="text-white hover:text-gray-400">
              <span className="hover:cursor-pointer">Login</span>
            </Button>
          </Link>
          <Link href="/">
            <Button className="bg-salvazap-light-blue hover:text-gray-400 hover:cursor:pointer text-white">
            <span className="hover:cursor-pointer">Cadastre-se</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NavBar;