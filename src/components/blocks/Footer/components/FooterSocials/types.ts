export interface FooterSocialInterface {
    id: number;
    title: string;
    properties: {
        MESSENGERS_ICON: string | null;
        MESSENGERS_LINK: string;
    };
}

export interface FooterSocialsProps {
    items: FooterSocialInterface[];
}