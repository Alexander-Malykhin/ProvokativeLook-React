import type { ReactNode, MouseEvent } from "react";

export interface ActionButtonInterface {
    children: ReactNode;
    onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
    className?: string;
}