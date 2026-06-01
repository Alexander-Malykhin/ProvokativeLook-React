import type {ElementType, ReactNode} from "react";

export interface TitleInterface {
    tag?: ElementType;
    children: ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'inherit';
    weight?: 'extraLight' | 'light' | 'regular' | 'medium';
    color?: 'black' | 'white' | 'gray';
    className?: string;
}