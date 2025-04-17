"use client";

import { UserContext } from "@/contexts/user-context";
import { fontSaira } from "@/utils/fonts";
import { ArrowRight } from "lucide-react";
import { useContext } from "react";

export const WelcomeBanner = () => {
  const { informations } = useContext(UserContext);

  return (
    <div className="bg-[#F68701] text-white rounded-lg p-5  mb-6 flex items-center justify-between">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col">
          <p className="flex items-center mb-2 font-bold">
            Bem vindo de volta <span className="ml-2 inline-block">👋</span>
          </p>
          {informations?.nome && (
            <h2 className={`${fontSaira} text-3xl font-bold mb-2`}>
              {informations?.nome}
            </h2>
          )}

          {!informations?.nome && (
            <div className="w-[16rem] h-7 bg-white/50 rounded-full"/>
          )}
        </div>
        <p className="flex items-center font-bold">
          Confira as novidades <ArrowRight className="ml-2 h-4 w-4" />
        </p>
      </div>
    </div>
  );
};
