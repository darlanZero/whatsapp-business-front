export const validateCnpj = (cnpj: string) => {
  const cleanCnpj = cnpj.replace(/\D/g, "");
  if (cleanCnpj.length !== 14 || /^(\d)\1+$/.test(cleanCnpj)) return false;
  const calc = (x: number) => {
    const slice = cleanCnpj.slice(0, x);
    let factor = x - 7;
    let sum = 0;
    for (let i = x; i >= 1; i--) {
      const n = parseInt(slice[x - i]);
      sum += n * factor--;
      if (factor < 2) factor = 9;
    }
    const result = 11 - (sum % 11);
    return result > 9 ? 0 : result;
  };
  return (
    calc(12) === parseInt(cleanCnpj[12]) && calc(13) === parseInt(cleanCnpj[13])
  );
};
