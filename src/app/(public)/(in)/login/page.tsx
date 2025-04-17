"use client";

import { Logo } from "@/components/logo";
import { SimpleLoader } from "@/components/simple-loader";
import { handleLogin } from "@/hooks/use-login";
import { loginSchema, LoginSchemaProps } from "@/schemas/login-schema";
import { fontOpenSans, fontSaira } from "@/utils/fonts";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { IoAlertCircleSharp } from "react-icons/io5";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

const useLoginPage = () => {
  const router = useRouter();

  const form = useForm<LoginSchemaProps>({
    resolver: zodResolver(loginSchema),
  });

  const login = async (data: LoginSchemaProps) => {
    const { email, password } = data;
    const token = await handleLogin(email, password);

    if (token) {
      Cookies.set("token", token);
      toast.success("Login efetuado");
      router.replace("/dashboard")
    } else {
      toast.error("credenciais erradas");
    }
  };

  return {
    form,
    login,
  };
};

export default function Login() {
  const { form, login } = useLoginPage();
  const { register, handleSubmit, formState } = form;
  const { errors, isSubmitting } = formState;

  return (
    <form
      onSubmit={handleSubmit(login)}
      className="bg-zinc-200/20 backdrop-blur-2xl p-3 flex flex-col py-10 rounded-lg h-auto w-full max-w-[30rem] pb-[5rem] shadow shadow-zinc-900"
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
          <button className="w-5 h-5 bg-transparent border border-zinc-400 rounded"></button>
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

      <div className="flex gap-2 items-center mt-3 px-11">
        <span>
          Novo na plataforma?{" "}
          <Link href="/registration" className="text-blue-400">
            Clique aqui e cadastra-se
          </Link>
        </span>
      </div>
    </form>
  );
}
