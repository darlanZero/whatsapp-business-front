import { z } from "zod";

export const LoginEvolutionSchema = z.object({
  email: z
    .string()
    .email({ message: "O email está inválido" })
    .min(1, "O email deve ser válido"),

  password: z.string().min(1, "A senha é um campo obrigatório"),
});

export const loginMetaSchema = z.object({
  email: z
    .string()
    .optional(),
  password: z.string().optional(),
})

export const loginSchema = z.union([LoginEvolutionSchema, loginMetaSchema]);

export type LoginEvolutionSchemaProps = z.infer<typeof LoginEvolutionSchema>;
export type LoginMetaSchemaProps = z.infer<typeof loginMetaSchema>;
export type LoginSchemaProps = LoginEvolutionSchemaProps | LoginMetaSchemaProps;