import React from "react";
import Mascot from "@/components/mascot";
import RegistrationForm from "@/components/registration-form";

export const metadata = {
  title: "Cadastro de Usuário - Salva Zap",
  description:
    "Crie sua conta no Salva Zap e comece a usar nossa plataforma agora!",
};

const RegisterPage = () => {
  return (
    <main className="flex lg:flex-row gap-[3%] flex-col-reverse md:flex-row items-center flex-1 justify-center px-4">
      <Mascot />
      <RegistrationForm />
    </main>
  );
};

export default React.memo(RegisterPage);
