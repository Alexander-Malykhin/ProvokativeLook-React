import type {ReactNode} from 'react';
import type {Colors, ButtonMode} from '@/types/color';

export interface MainButtonInterface {
    children: ReactNode;
    onClick?: () => void;
    icon?: string;
    alt?: string;
    className?: string;
    color?: Colors;
    mode?: ButtonMode;
}