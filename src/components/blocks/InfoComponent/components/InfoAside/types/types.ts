import type {ReactNode} from "react";

export interface InfoAsideItemInterface {
    id: number;
    url: string;
    title: string;
    content: ReactNode;
}

export interface InfoAsideInterface {
    pages: InfoAsideItemInterface[];
}
