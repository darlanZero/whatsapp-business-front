import { z } from "zod";

const partialAddressSchema = z
  .object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z
      .string()
      .optional()
      .refine(
        (val) => !val || val.trim() === "" || /^\d{5}-?\d{3}$/.test(val),
        { message: "CEP inválido. Use 12345-678 ou 12345678." }
      ),
    country: z.string().optional(),
  })
  .partial();

export const updateUserSchema = z.object({
  name: z
    .string()
    .min(2, "O nome deve ter pelo menos 2 caracteres.")
    .optional(),
  email: z.string().email("Formato de e-mail inválido.").optional(),
  password: z
    .string()
    .min(8, "A senha deve ter pelo menos 8 caracteres.")
    .optional(),
  cpfCnpj: z.string().optional(),
  phoneNumber: z
    .string()
    .regex(
      /^\+?[1-9]\d{1,14}$/,
      "Número de telefone inválido. Formato internacional ou nacional com DDD."
    )
    .optional(),
  username: z
    .string()
    .min(3, "O nome de usuário deve ter pelo menos 3 caracteres.")
    .optional(),
  role: z
    .enum(["CLIENTE", "GESTOR_TRAFEGO", "ADMINISTRADOR"], {
      errorMap: () => ({ message: "Cargo inválido." }),
    })
    .optional(),
  address: partialAddressSchema.optional(),
  isActive: z.boolean().optional(),
});

export type UpdateUserSchema = z.infer<typeof updateUserSchema>;
