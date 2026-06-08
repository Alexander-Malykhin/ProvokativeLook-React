export interface NavigationItemInterface {
    id: number;
    code: string;
    title: string;
    link: string;
}

export interface NavigationMobileMainInterface {
    items: NavigationItemInterface[];
    onOpenCatalog: () => void;
    onClose: () => void;
}