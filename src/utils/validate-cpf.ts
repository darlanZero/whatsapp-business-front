export const validateCpf = (cpf: string) => {
  const cleanCpf = cpf.replace(/\D/g, "");
  if (cleanCpf.length !== 11 || /^(\d)\1+$/.test(cleanCpf)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(cleanCpf[i]) * (10 - i);
  let rest = (sum * 10) % 11;
  if (rest === 10 || rest === 11) rest = 0;
  if (rest !== parseInt(cleanCpf[9])) return false;
  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(cleanCpf[i]) * (11 - i);
  rest = (sum * 10) % 11;
  if (rest === 10 || rest === 11) rest = 0;
  return rest === parseInt(cleanCpf[10]);
};
