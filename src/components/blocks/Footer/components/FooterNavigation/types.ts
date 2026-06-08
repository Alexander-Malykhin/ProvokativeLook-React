export interface FooterNavigationLinkInterface {
    title: string;
    link: string;
}

export interface FooterNavigationInterface {
    id: number;
    navigationTitle: string;
    navigationList: FooterNavigationLinkInterface[];
}

export interface FooterNavigationProps {
    items: FooterNavigationInterface[];
    opened: string | null;
    onToggle: (value: string | null) => void;
}