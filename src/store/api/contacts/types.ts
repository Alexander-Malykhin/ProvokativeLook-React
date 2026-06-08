export interface ContactsLink {
    id: number;
    title: string;
    code: string;
    icon: string | null;
    link: string;
}

export interface ContactsResponse {
    id: number;
    code: string;
    title: string;
    phone: string;
    email: string;
    address: string;
    workTime: string;
    map: string | null;
    links: ContactsLink[];
}