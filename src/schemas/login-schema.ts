import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .email({ message: "O email está inválido" })
    .min(1, "O email deve ser válido"),

  password: z.string().min(1, "A senha é um campo obrigatório"),
});

export type LoginSchemaProps = z.infer<typeof loginSchema>;
