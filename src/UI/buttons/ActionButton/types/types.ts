import type {ReactNode} from "react";

export interface ActionButtonInterface {
    children:ReactNode,
    onClick?: () => void,
    className?: string;
}