export interface NavigationItemInterface {
    id: number;
    code: string;
    title: string;
    link: string;
}

export interface NavigationInterface {
    items: NavigationItemInterface[];
}