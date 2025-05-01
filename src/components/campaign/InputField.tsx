import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { fontInter } from "@/utils/fonts";

interface InputFieldProps {
  label: string;
  placeholder?: string;
  name: string;
  ariaLabel?: string;
  as?: "input" | "select";
  options?: { label: string; value: string }[];
}

const InputField = ({
  label,
  placeholder,
  name,
  ariaLabel,
  as = "input",
  options,
}: InputFieldProps) => {
  return (
    <div className="flex flex-col w-full">
      <Label htmlFor={name} className="mb-1  text-gray-900">
        {label}
      </Label>
      {as === "input" ? (
        <Input
          id={name}
          name={name}
          placeholder={placeholder}
          aria-label={ariaLabel || label}
          className={`${fontInter} bg-white border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 text-gray-800 placeholder-gray-400 rounded-md`}
        />
      ) : (
        <select
          id={name}
          name={name}
          aria-label={ariaLabel || label}
          className="border border-gray-300 rounded-md px-3 py-2 text-gray-800 focus:border-indigo-500 focus:ring-indigo-500"
        >
          {options?.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export  {InputField};