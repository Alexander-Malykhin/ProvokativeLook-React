import type { InputHTMLAttributes, ReactNode } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

export interface MainCheckboxInterface extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "children" | "type" | "onChange"
> {
  children: ReactNode;
  onChange?: (checked: boolean) => void;
  register?: UseFormRegisterReturn;
}
