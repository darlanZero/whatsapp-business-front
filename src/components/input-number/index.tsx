import { InputHTMLAttributes, ChangeEvent } from "react";

interface PhoneInputProps extends InputHTMLAttributes<HTMLInputElement> {
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  name: string;
  ref?: (instance: HTMLInputElement | null) => void;
}

export default function PhoneInput(props: PhoneInputProps) {
  const formatPhoneNumber = (value: string): string => {
    const cleaned = value.replace(/\D/g, "");

    const match = cleaned.match(/^(\d{0,2})(\d{0,5})(\d{0,4})$/);
    if (!match) return value;

    const formatted = [
      match[1] ? `(${match[1]}` : "",
      match[2] ? `) ${match[2]}` : "",
      match[3] ? `-${match[3]}` : "",
    ].join("");

    return formatted;
  };

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
      placeholder="(XX) XXXXX-XXXX"
      maxLength={15} // Limita o tamanho do input
      {...props}
      onChange={handleChange} // Sobrescreve o onChange para aplicar a formatação
    />
  );
}
