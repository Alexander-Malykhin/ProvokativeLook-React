import type {ReactNode} from 'react';
import type {Colors} from '@/types/color';
import type {ButtonMode, ButtonType} from "@/types/button.ts";

export interface MainButtonInterface {
    children: ReactNode;
    onClick?: () => void;
    icon?: string;
    alt?: string;
    className?: string;
    color?: Colors;
    mode?: ButtonMode;
    type?: ButtonType
}