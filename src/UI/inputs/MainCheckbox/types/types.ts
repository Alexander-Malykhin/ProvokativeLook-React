import type {ReactNode} from "react";
import type {UseFormRegisterReturn} from "react-hook-form";

export interface MainCheckboxInterface {
    children: ReactNode;
    checked?: boolean;
    onChange?: (checked: boolean) => void;
    register?: UseFormRegisterReturn;
}