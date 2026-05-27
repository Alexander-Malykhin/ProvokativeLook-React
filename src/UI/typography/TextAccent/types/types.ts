import type {ReactNode} from "react";

export interface TextAccentInterface {
    children: ReactNode,
    mode: 'main' | 'link',
    path?: string
}