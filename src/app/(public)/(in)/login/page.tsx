"use client";

import { Logo } from "@/components/logo";
import { SimpleLoader } from "@/components/simple-loader";
import { handleLogin } from "@/hooks/use-login";
import { LoginEvolutionSchema, loginMetaSchema, LoginSchemaProps } from "@/schemas/login-schema";
import { fontOpenSans, fontSaira } from "@/utils/fonts";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { IoAlertCircleSharp } from "react-icons/io5";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa6";
import { API_TYPE_KEY, TOKEN_KEY } from "@/utils/cookies-keys";
import { useUser } from "@/hooks/use-user";

const useLoginPage = () => {
  const router = useRouter();
  const { isMeta, isEvolution} = useUser();
  const [isRedirecting, setIsRedirecting] = useState<boolean>(false);

  const form = useForm<LoginSchemaProps>({
    resolver: zodResolver(isEvolution ? LoginEvolutionSchema : loginMetaSchema),
  });

  const loginEvolution = async (data: LoginSchemaProps) => {
    try {
      if (!("email" in data) || !("password" in data)) {
        toast.error("Dados de login inválidos.");
        return;
      }

      const {email, password} = data;
      const token = await handleLogin(email, password);

      const apiTypeCookie = Cookies.get(API_TYPE_KEY);
      Object.keys(Cookies.get()).forEach(function (cookieName) {
        Cookies.remove(cookieName);
      })

      if (apiTypeCookie) {
        Cookies.set(API_TYPE_KEY, apiTypeCookie);
      }

      if (!token) {
        toast.error("Erro ao fazer login. Verifique suas credenciais.");
        return;
      }

      Cookies.set(TOKEN_KEY, token);
      toast.success("Login realizado com sucesso!");
      router.replace("/session-whatsapp")
    } catch {
      toast.error("Erro ao fazer login.");
    }
  }

  const loginMeta = async () => {
    try {
      setIsRedirecting(true);
      const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
      const metaAuthUrl = `${backendUrl}/api/whatsapp/auth/facebook`;

      console.log("Redirecionando para o Meta Auth URL:", metaAuthUrl);
      window.location.href = metaAuthUrl; 
    } catch(error) {
      toast.error("Erro ao redirecionar para o Meta.");
      console.error(error);
    }
  }

  const login = async (data: LoginSchemaProps) => {
    if (isEvolution) {
      loginEvolution(data);
    } else if (isMeta) {
      loginMeta();
    } else {
      toast.error("Tipo de API não suportado.");
    }
  }

  return { form, login, isMeta, isEvolution, isRedirecting };
};

export default function Login() {
  const { form, login, isMeta, isEvolution, isRedirecting } = useLoginPage();
  const { register, handleSubmit, formState } = form;
  const { errors, isSubmitting } = formState;
  const [continueLogged, setContinueLogged] = useState<boolean>(false);
  const { apiType, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !apiType) {
      console.log('Contexto carregado mas sem apiType, redirecionando...');
      router.push("/api-selection");
    }
  }, [apiType, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <SimpleLoader className="w-8 h-8 " />
      </div>
    )
  }

  if (isMeta) {
    return (
      <div className="bg-zinc-200/20 text-zinc-100 backdrop-blur-2xl p-3 flex flex-col py-10 
      rounded-lg h-auto w-full max-w-[30rem] pb-[5rem] shadow shadow-zinc-900">
        <header className="flex p-4 items-center justify-center gap-10">
          <Logo />
          <h1 className={`text-3xl font-semibold text-zinc-200 ${fontSaira}`}>
            Salvazap!
          </h1>
        </header>

        <section className="flex flex-col gap-4 p-4 px-10">
          <div className="text-center">
            <h2 className={`${fontOpenSans} text-xl font-semibold`}>
              Você será redirecionado para o Meta para fazer login.
            </h2>
          </div>

          <button
            disabled={isSubmitting || isRedirecting}
            onClick={() => login({})}
            className="bg-blue-500 p-3 flex-1 flex items-center justify-center gap-4 rounded-full 
            font-semibold opacity-90 hover:opacity-100 data-[isloading=true]:opacity-60"
          >
            {(isSubmitting || isRedirecting) && <SimpleLoader className="w-4 h-4" />}
            Continuar com Meta
          </button>

          <div className="text-center mt-4">
            <Link href="/api-selection" className="text-blue-300 text-sm">
              Escolher outro tipo de API
            </Link>
          </div>
        </section>
      </div>
    )
  }

  if (isEvolution) {
    return (
      <form
        onSubmit={handleSubmit(login)}
        className="bg-zinc-200/20 text-zinc-100 backdrop-blur-2xl p-3 flex flex-col py-10 rounded-lg h-auto w-full max-w-[30rem] pb-[5rem] shadow shadow-zinc-900"
      >
        <header className="flex p-4 items-center justify-center gap-10">
          <Logo />
          <h1 className={`text-3xl font-semibold text-zinc-200 ${fontSaira}`}>
            Salva Zap!
          </h1>
        </header>

        <section className="flex flex-col gap-2 p-4 px-10">
          <label htmlFor="email" className="flex flex-col gap-2">
            <span className={`${fontOpenSans} font-semibold text-base`}>
              Email
            </span>
            <input
              type="text"
              {...register("email")}
              className="bg-zinc-100 rounded p-2 outline-none placeholder:text-zinc-400 text-zinc-600"
              placeholder="joeDoe@gmail.com"
            />

            {errors?.email && (
              <div className="flex gap-2 items-center text-red-400 opacity-80">
                <IoAlertCircleSharp />
                <span className={fontSaira}>{errors?.email.message} </span>
              </div>
            )}
          </label>

          <label htmlFor="password" className="flex flex-col gap-1 mt-3">
            <div className="flex gap-2 items-center justify-between">
              <span className={`${fontOpenSans} font-semibold text-base`}>
                Password
              </span>

              <Link href="#" className="text-blue-300">
                Esqueceu a senha?
              </Link>
            </div>
            <input
              type="password"
              {...register("password")}
              className="bg-zinc-100 rounded p-2 outline-none placeholder:text-zinc-400 text-zinc-600"
              placeholder="•••••••••••"
            />

            {errors?.password && (
              <div className="flex gap-2 items-center text-red-400 opacity-80">
                <IoAlertCircleSharp />
                <span className={fontSaira}>{errors?.password.message} </span>
              </div>
            )}
          </label>

          <div className="flex mt-1 gap-2 items-center">
            <button
              type="button"
              onClick={() => setContinueLogged((prev) => !prev)}
              className="grid place-items-center w-5 h-5 bg-transparent border border-zinc-400 rounded"
            >
              {continueLogged && <FaCheck />}
            </button>
            <span className="text-sm">Lembre-me de mim</span>
          </div>
        </section>

        <footer className="flex px-10 mt-2 w-full">
          <button
            disabled={isSubmitting}
            data-isloading={isSubmitting}
            className="bg-blue-500 p-3 flex-1 flex items-center justify-center gap-4 rounded-full font-semibold opacity-90 hover:opacity-100 data-[isloading=true]:opacity-60"
          >
            {isSubmitting && <SimpleLoader className="w-4 h-4" />}
            Entrar
          </button>
        </footer>
      </form>
    );
  }

  return null
}
