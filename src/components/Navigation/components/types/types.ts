import type {ReactNode} from "react";
import type {Colors} from "@/types/color.ts";

export interface NavigationItemInterface {
    children:ReactNode,
    color: Colors,
    path: string
}