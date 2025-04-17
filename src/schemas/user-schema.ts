import { z } from "zod";

export const addressSchema = z.object({
  zipCode: z.string().min(1, "O código postal é obrigatório"),
  city: z.string().min(1, "A cidade é obrigatória"),
  state: z.string().min(1, "O estado é obrigatório"),
  country: z.string().min(1, "O país é obrigatório"),
  street: z.string().min(1, "A rua é obrigatório"),
});

export const userSchema = z.object({
  cpf: z.string().min(1, "O CPF é obrigatório").regex(/^\d{11}$/, "CPF inválido").optional(),
  cnpj: z.string().min(1, "O CNPJ é obrigatório").regex(/^\d{14}$/, "CNPJ inválido").optional(),
  name: z.string().min(1, "O nome é obrigatório"),
  email: z.string().email("O email está inválido"),
  phoneNumber: z.string().min(1, "O número de telefone é obrigatório"),
  address: addressSchema, 
});


export type User = z.infer<typeof userSchema>;
export type Address = z.infer<typeof addressSchema>;
