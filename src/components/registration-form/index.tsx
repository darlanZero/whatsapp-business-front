"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { publicApi } from "@/utils/api";
import { fontOpenSans, fontSaira } from "@/utils/fonts";
import { validateCnpj } from "@/utils/validate-cnpj";
import { validateCpf } from "@/utils/validate-cpf";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaUser } from "react-icons/fa";
import { FaArrowLeftLong } from "react-icons/fa6";
import { RiShieldUserFill } from "react-icons/ri";
import { toast } from "react-toastify";
import * as z from "zod";
import FormInput from "../form-input";
import PhoneInput from "../input-number";

const formSchema = z.object({
  username: z.string().min(1, { message: "Username é obrigatório" }),
  phoneNumber: z
    .string()
    .min(1, { message: "Número de telefone é obrigatório" })
    .transform((value) => value.replace(/\D/g, "")) // Remove todos os caracteres não numéricos
    .refine((value) => value.length >= 10 && value.length <= 11, {
      message: "Número de telefone deve ter 10 ou 11 dígitos",
    }),
  name: z.string().min(1, { message: "Nome é obrigatório" }),
  email: z.string().email({ message: "Email inválido" }),
  document: z
    .string()
    .min(11, { message: "CPF deve ter pelo menos 11 caracteres" })
    .max(18, { message: "CNPJ deve ter no máximo 18 caracteres" })
    .refine(
      (value) => {
        const cleanValue = value.replace(/\D/g, "");
        return validateCpf(cleanValue) || validateCnpj(cleanValue);
      },
      { message: "Documento inválido. Deve ser um CPF ou CNPJ válido." }
    ),
  password: z
    .string()
    .min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
  terms: z.boolean().refine((val) => val === true, {
    message: "Você deve concordar com os termos de uso e políticas",
  }),
});

type FormValues = z.infer<typeof formSchema>;

const defaultValues = {
  username: "",
  phoneNumber: "",
  name: "",
  email: "",
  document: "",
  password: "",
  terms: false,
} satisfies FormValues;

const useRegistrationForm = () => {
  const router = useRouter();
  const [step, setStep] = useState(0);

  const nextStep = async () => {
    if (step === 0) {
      const isValid = await form.trigger(["username", "name", "phoneNumber"]);
      if (!isValid) return;
    }

    setStep((prev) => prev + 1);
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: defaultValues,
  });

  const onSubmit = async (data: FormValues) => {
    console.log(data);
    try {
      const created = await publicApi.post("/users", {
        name: data.name,
        username: data.username,
        cpfCnpj: data.document,
        phoneNumber: data.phoneNumber,
        email: data.email,
        password: data.password,
      });

      if (created?.status === 201) {
        toast.success("Usuário registrado com sucesso!");
        router.replace("/login");
        return;
      }
    } catch (err: unknown) {
      console.log(err);
      toast.error("Houve um erro ao tentar criar conta!");
    }
  };

  return {
    form,
    step,
    nextStep,
    onSubmit,
  };
};

const RegistrationForm = () => {
  const { form, onSubmit, step, nextStep } = useRegistrationForm();

  return (
    <div className="w-full max-w-md p-10 px-12 glassmorphism rounded-xl bg-white/20 backdrop-blur-lg shadow shadow-zinc-900 border border-zinc-100/20">
      <h2
        className={`${fontSaira} text-2xl font-semibold text-gray-200 text-center mb-6`}
      >
        Cadastro de Usuário
      </h2>

      <div className="flex items-center justify-between mb-5 relative">
        <div className="w-12 h-12 bg-blue-600 text-blue-200 rounded-full grid place-items-center z-10">
          <FaUser />
        </div>

        <div className="w-full h-4 bg-gray-300 rounded-full absolute">
          {step === 1 && (
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              className="bg-blue-600 h-full rounded-full"
            />
          )}
        </div>

        <div
          data-selected={step === 1}
          className="w-12 h-12 bg-gray-200 text-gray-500 data-[selected=true]:bg-blue-600 data-[selected=true]:text-blue-200 rounded-full grid place-items-center z-10"
        >
          <RiShieldUserFill size={20} />
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {step === 0 && (
            <div className="flex flex-col gap-2">
              <FormInput
                control={form.control}
                name="username"
                label="Username"
                placeholder="JonhDoe!"
              />

              <FormInput
                control={form.control}
                name="name"
                label="Nome"
                placeholder="Seu nome completo"
              />

              <label htmlFor="flex flex-col w-full">
                <span className="text-white text-sm font-medium">Telefone</span>
                <PhoneInput
                  className="bg-white text-zinc-500 w-full p-3 rounded placeholder:text-zinc-400 text-sm h-10 outline-none"
                  {...form.register("phoneNumber")}
                />
              </label>

              <Button
                onClick={nextStep}
                type="button"
                className="w-full mt-4 py-6 bg-blue-500 hover:bg-blue-700 text-white font-medium rounded-md transition-colors duration-200"
              >
                <span className={fontOpenSans}>Proximo</span>
              </Button>
            </div>
          )}

          {step === 1 && (
            <>
              <button className="w-10 h-10 bg-blue-100/80 rounded-full text-zinc-700 grid place-items-center">
                <FaArrowLeftLong />
              </button>

              <FormInput
                control={form.control}
                name="email"
                label="Email"
                placeholder="Seu email principal"
                type="email"
              />

              <FormInput
                control={form.control}
                name="document"
                label="CPF/CNPJ"
                placeholder="Insira seu CPF ou CNPJ"
              />

              <FormInput
                control={form.control}
                name="password"
                label="senha"
                placeholder="Insira uma senha"
                type="password"
              />

              <FormField
                control={form.control}
                name="terms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 py-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:bg-salvazap-light-blue"
                      />
                    </FormControl>
                    <div className="leading-none">
                      <label
                        htmlFor="terms"
                        className="text-xs text-white font-normal cursor-pointer"
                      >
                        Ao clicar aqui, concordo com os{" "}
                        <Link
                          href="/terms"
                          className="text-salvazap-lighter-blue hover:text-salvazap-hover-blue underline"
                        >
                          Termos de Uso
                        </Link>{" "}
                        e{" "}
                        <Link
                          href="/privacy"
                          className="text-salvazap-lighter-blue hover:text-salvazap-hover-blue underline"
                        >
                          Políticas da Salva Zap
                        </Link>
                      </label>
                      <FormMessage className="text-red-300 text-xs" />
                    </div>
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-700 text-white font-medium py-6 rounded-md transition-colors duration-200"
              >
                <span className={fontOpenSans}>Cadastre-se agora</span>
              </Button>
            </>
          )}

          <div className="text-center">
            <Link
              href="/login"
              className="text-white text-sm hover:text-gray-400 underline"
            >
              <span className="hover:cursor-pointer">Voltar para o Login</span>
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default RegistrationForm;
