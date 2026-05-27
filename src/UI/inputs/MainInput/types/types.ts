import type {UseFormRegisterReturn} from "react-hook-form";

export interface MainInputInterface {
    className?: string,
    placeholder?: string,
    onChange?: () => void,
    type?: 'email' | 'text' | 'tel',
    register?: UseFormRegisterReturn,
    error?: string;
}