import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {  fontInter, fontOpenSans } from "@/utils/fonts";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id?: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  type?: string;
  error?: string;
}

export function FormInput({
  id,
  label,
  placeholder,
  required = false,
  type = "text",
  error,
  ...rest
}: FormInputProps) {
  return (
    <div className="space-y-2 w-full">
      <Label htmlFor={id} className={`${fontInter} text-sm font-medium text-black`}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        required={required}
        className={`${fontOpenSans} w-full border border-gray-300 text-black rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${error ? "border-red-500" : ""}`}
        {...rest}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}
