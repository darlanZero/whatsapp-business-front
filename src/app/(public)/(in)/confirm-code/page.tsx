"use client"

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Logo } from '@/components/logo';
import Link from 'next/link';
import { IoAlertCircleSharp } from 'react-icons/io5';
import { toast } from 'react-toastify';

// Schema de validação simplificado
const recoverySchema = z.object({
  code: z.string()
    .min(6, "O código deve ter exatamente 6 dígitos")
    .max(6, "O código deve ter exatamente 6 dígitos")
    .regex(/^\d+$/, "O código deve conter apenas números")
});

type RecoveryFormData = z.infer<typeof recoverySchema>;

export default function Recovery() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RecoveryFormData>({
    resolver: zodResolver(recoverySchema)
  });

  const onSubmit = (data: RecoveryFormData) => {
    // Simulação de envio com loading
    return new Promise(resolve => {
      setTimeout(() => {
        console.log(data)
        toast.success("Código verificado com sucesso!");
        resolve(null);
      }, 1500);
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="bg-zinc-200/20 backdrop-blur-2xl p-6 flex flex-col rounded-lg w-full max-w-md shadow-lg shadow-zinc-900">
        <header className="flex flex-col items-center gap-4 mb-6">
          <div className="flex items-center gap-4">
            <Logo />
            <h1 className="text-3xl font-semibold text-zinc-200">
              Salva Zap!
            </h1>
          </div>

          <div className="flex flex-col gap-2 text-center">
            <h2 className="text-xl text-zinc-100 font-bold">
              Recuperação de senha
            </h2>
            <p className="text-zinc-200">
                {/*TODO: Implementar mascara para o Email quando o SMTP estiver pronto */}
              O Código para redefinição da senha foi enviado para <strong>Fa******@gmail.com</strong>.
              Verifque se você recebeu um E-mail contendo seu código de verificação.

            </p>
          </div>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <label htmlFor="code" className="flex flex-col gap-1">
            <span className="font-semibold text-zinc-300">
              Código de verificação
            </span>
            <input
              type="text"
              inputMode="numeric"
              {...register("code")}
              className="bg-zinc-100 rounded p-3 outline-none placeholder:text-zinc-400 text-zinc-800 focus:ring-2 focus:ring-blue-500 p-1.5"
              placeholder="123456"
              maxLength={6}
            />
            
            {errors?.code && (
              <div className="flex gap-2 items-center text-red-400">
                <IoAlertCircleSharp className="flex-shrink-0" />
                <span className="text-sm">
                  {errors.code.message}
                </span>
              </div>
            )}
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Verificando...' : 'Verificar Código'}
          </button>
        </form>

        <div className="flex gap-1 justify-center items-center mt-4 text-sm">
          <span className="text-zinc-300">
            Não recebeu o código?
          </span>
          <Link href="#" className="text-blue-400 hover:text-blue-300">
            Reenviar código
          </Link>
        </div>
      </div>
    </div>
  );
}