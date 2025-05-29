import { z } from "zod";


const AddressCreateSchema = z.object({
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z
    .string()
    .optional()
    .refine((val) => !val || val.trim() === "" || /^\d{5}-?\d{3}$/.test(val), {
      message: "CEP inválido. Use 12345-678 ou 12345678.",
    }),
  country: z.string().optional(),
});

export const createUserSchema = z.object({
  name: z
    .string()
    .min(3, { message: "O nome deve ter pelo menos 3 caracteres." }),
  email: z.string().email({ message: "Email inválido." }),
  password: z
    .string()
    .min(6, { message: "A senha deve ter pelo menos 6 caracteres." }),
  cpfCnpj: z
    .string()
    .min(11, { message: "CPF/CNPJ deve ter pelo menos 11 dígitos." })
    .regex(/^\d{11}$|^\d{14}$/, {
      message: "CPF/CNPJ inválido. Deve conter apenas números.",
    }), // Valida CPF (11 dígitos) ou CNPJ (14 dígitos)
  username: z
    .string()
    .min(3, { message: "O nome de usuário deve ter pelo menos 3 caracteres." }),
  phoneNumber: z
    .string()
    .min(10, {
      message: "O número de telefone deve ter pelo menos 10 dígitos.",
    })
    .regex(
      /^(?:(?:\+|00)?(55)\s?)?(?:\(?([1-9][0-9])\)?\s?)?(?:((?:9\d|[2-9])\d{3})-?(\d{4}))$/,
      { message: "Número de telefone inválido." }
    ),
  role: z.enum(["CLIENTE", "GESTOR_TRAFEGO", "ADMIN"], {
    errorMap: () => ({ message: "Cargo inválido." }),
  }),
  address: AddressCreateSchema.optional(),
});

export type CreateUserSchema = z.infer<typeof createUserSchema>;
