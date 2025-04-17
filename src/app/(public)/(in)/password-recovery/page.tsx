"use client"

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { fontOpenSans, fontSaira } from "@/utils/fonts";
import { IoAlertCircleSharp } from 'react-icons/io5';
import { Logo } from '@/components/logo';
import Link from 'next/link';

const validateEmailOrCpfCnpj = (value: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailRegex.test(value)) return true;
  
  const cleanValue = value.replace(/\D/g, '');
  
  if (cleanValue.length === 11) return true;
  
  if (cleanValue.length === 14) return true;
  
  return false;
};

const recoverySchema = z.object({
  identifier: z.string()
    .min(1, "Campo obrigatório")
    .refine(validateEmailOrCpfCnpj, {
      message: "Por favor, insira um Email, CPF ou CNPJ válido"
    })
    .transform(val => val.replace(/\D/g, '')) 
});

type RecoveryFormData = z.infer<typeof recoverySchema>;

export default function Recovery() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RecoveryFormData>({
    resolver: zodResolver(recoverySchema)
  });

  const onSubmit = (data: RecoveryFormData) => {
    console.log(data);
    
  };

  return (
    <div className="flex items-center justify-center  p-8 overflow-hidden">
      <div className="flex flex-col md:flex-row items-center justify-center  gap-8 w-full max-w-6xl min-h-screen ">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-zinc-200/20 backdrop-blur-2xl p-6 flex flex-col items-center justify-center  w-full max-w-[25rem] shadow-lg shadow-zinc-900"
        >
          <header className="flex flex-col items-center gap-4 mb-6">
            <div className="flex items-center gap-4">
              <Logo />
              <h1 className={`text-3xl font-bold text-zinc-200 ${fontSaira}`}>
                Salva Zap!
              </h1>
            </div>

            <div className="flex flex-col gap-2 text-center">
              <h2 className="text-xl text-zinc-100 font-bold">
                Recuperação de senha
              </h2>
              <p className="text-zinc-200">
                Para iniciar o processo de recuperação de senha de acesso
                ao SalvaZap, digite seu e-mail de cadastro ou CPF/CNPJ
                do titular da conta
              </p>
            </div>
          </header>

          <section className="flex flex-col gap-4">
            <label htmlFor="identifier" className="flex flex-col ga">
              <span className={`${fontOpenSans} font-semibold text-zinc-300`}>
                Email, CPF ou CNPJ
              </span>
              <input
                type="text"
                {...register("identifier")}
                className="bg-zinc-100 rounded p-3 outline-none placeholder:text-zinc-400 text-zinc-800 focus:ring-2 focus:ring-blue-500"
                placeholder="email@exemplo.com ou 123.456.789-00"
              />
              
              {errors?.identifier && (
                <div className="flex gap-2 items-center text-red-400">
                  <IoAlertCircleSharp className="flex-shrink-0" />
                  <span className={`text-sm ${fontSaira}`}>
                    {errors.identifier.message}
                  </span>
                </div>
              )}
            </label>

            <button
              type="submit"
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded transition-colors duration-200 hover:cursor-pointer"
            >
              Enviar Código
            </button>
          </section>

          <div className="flex gap-1 items-center mt-3 px-11">
            <span>
              Não recebeu o código?{" "}
              <Link href="#" className="text-blue-400">
                Clique aqui para reenviar
              </Link>
            </span>
          </div>
        </form>

      </div>
      </div>
  );
}




