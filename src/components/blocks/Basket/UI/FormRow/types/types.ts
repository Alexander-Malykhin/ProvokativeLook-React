import type {ReactNode} from "react";

export interface FormRowInterface {
    mode?: 'description' | 'price';
    label?: string;
    value?: string;
    children?: ReactNode;
}