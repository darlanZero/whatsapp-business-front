import { InputHTMLAttributes, ChangeEvent } from "react";

interface PhoneInputProps extends InputHTMLAttributes<HTMLInputElement> {
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  name: string;
  ref?: (instance: HTMLInputElement | null) => void;
}

export const formatPhoneNumber = (value: string): string => {
  // Remove todos os caracteres não numéricos
  const cleaned = value.replace(/\D/g, "");

  // Verifica se o número começa com 55 (código do Brasil)
  const startsWith55 = cleaned.startsWith("55");

  // Define a regex com base na presença do 55
  const regex = startsWith55
    ? /^(\d{2})?(\d{2})(\d{4,5})(\d{4})$/ // Com 55: +5583988032789 → +55 (83) 98803-2789, +551161801420 → +55 (11) 6180-1420
    : /^(\d{2})(\d{4,5})(\d{4})$/; // Sem 55: 83988032789 → (83) 98803-2789, 1161801420 → (11) 6180-1420

  const match = cleaned.match(regex);
  if (!match) return value; // Retorna o valor original se não houver correspondência

  if (startsWith55) {
    // Formata com +55: ex.: 5583988032789 → +55 (83) 98803-2789
    return [
      match[1] ? `+${match[1]}` : "", // Código do país (+55)
      match[2] ? ` (${match[2]})` : "", // DDD (ex.: 83)
      match[3] ? ` ${match[3]}` : "", // Número (ex.: 98803 ou 6180)
      match[4] ? `-${match[4]}` : "", // Últimos 4 dígitos (ex.: 2789)
    ].join("");
  } else {
    // Formata sem +55: ex.: 83988032789 → (83) 98803-2789
    return [
      match[1] ? `(${match[1]})` : "", // DDD (ex.: 83)
      match[2] ? ` ${match[2]}` : "", // Número (ex.: 98803 ou 6180)
      match[3] ? `-${match[3]}` : "", // Últimos 4 dígitos (ex.: 2789)
    ].join("");
  }
};

export default function PhoneInput(props: PhoneInputProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const inputValue = e.target.value;
    const formattedValue = formatPhoneNumber(inputValue);

    e.target.value = formattedValue;

    if (props.onChange) {
      props.onChange(e);
    }
  };

  return (
    <input
      id={props.name}
      type="text"
      placeholder="+55 (XX) XXXXX-XXXX"
      maxLength={19}
      {...props}
      onChange={handleChange} // Sobrescreve o onChange para aplicar a formatação
    />
  );
}
