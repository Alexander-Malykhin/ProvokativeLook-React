import type { InputHTMLAttributes } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

export interface MainInputInterface extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "className"
> {
  className?: string;
  register?: UseFormRegisterReturn;
  error?: string;
}
