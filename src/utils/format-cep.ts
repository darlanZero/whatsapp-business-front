export default function formatCep(cep: string | undefined | null): string {
    if (!cep) return "Não informado";
  
    const onlyNumbers = cep.replace(/\D/g, "");
    return onlyNumbers.replace(/(\d{5})(\d{3})/, "$1-$2");
  }