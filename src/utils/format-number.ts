export function formatNumber(phoneNumber: string): string {
  try {
    // Remove caracteres não numéricos
    const cleaned = phoneNumber?.toString().replace(/\D/g, "");

    // Regex para validar números com ou sem código do país
    const regexWithCountryCode = /^(?:\+?55)?(\d{2})(\d{1})?(\d{4})(\d{4})$/;
    const regexWithoutCountryCode = /^(\d{2})(\d{1})?(\d{4})(\d{4})$/;

    let match;

    if (cleaned?.startsWith("55") || cleaned?.startsWith("+55")) {
      match = cleaned?.match(regexWithCountryCode);
    } else {
      match = cleaned?.match(regexWithoutCountryCode);
    }

    if (match) {
      const areaCode = match[1]; // DDD
      const hasNine = match[2]; // Dígito 9 (opcional)
      const firstPart = match[3]; // Primeira parte do número
      const secondPart = match[4]; // Segunda parte do número

      // Formata com ou sem o 9
      const formattedNumber = hasNine
        ? `+55 (${areaCode}) ${hasNine}${firstPart}-${secondPart}`
        : `+55 (${areaCode}) ${firstPart}-${secondPart}`;

      return formattedNumber;
    }

    // Retorna o número original se não for válido
    return phoneNumber;
  } catch {
    return "";
  }
}
