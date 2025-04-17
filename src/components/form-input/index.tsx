"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Control, FieldValues, Path } from "react-hook-form";

interface FormInputProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder: string;
  type?: "text" | "password" | "email" | "number";
  className?: string;
  inputClassName?: string;
  buttonClassName?: string;
}

const FormInput = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  type = "text",
  className,
  inputClassName,
  buttonClassName,
}: FormInputProps<T>) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const isPassword = type === "password";

  useEffect(() => {
    setShowPassword(false);
  }, [name]);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("w-full", className)}>
          <FormLabel className="text-white text-sm font-medium">
            {label}
          </FormLabel>
          <div className="relative">
            <FormControl>
              <Input
                {...field}
                placeholder={placeholder}
                type={isPassword ? (showPassword ? "text" : "password") : type}
                className={cn(
                  "bg-white text-gray-900 h-10 px-3 rounded-md",
                  inputClassName
                )}
              />
            </FormControl>

            {isPassword && (
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className={cn(
                  "absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700",
                  buttonClassName
                )}
                aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <Eye className="h-5 w-5" aria-hidden="true" />
                )}
              </button>
            )}
          </div>
          <FormMessage className="text-red-300 text-xs" />
        </FormItem>
      )}
    />
  );
};

export default FormInput;
