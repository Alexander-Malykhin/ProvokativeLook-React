import type {ReactNode} from "react";

export interface SectionLayoutInterface {
    id?:string,
    children: ReactNode,
    className?: string
}