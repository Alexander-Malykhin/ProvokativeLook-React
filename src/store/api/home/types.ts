export interface HomeAnswerItem {
    id: number;
    iblockId: number;
    title: string;
    code: string;
    sort: number;
    properties: {
        ANSWERS_TITLE: string;
        ANSWERS_TEXT: string;
    };
}
export interface FooterInformationItem {
    id: number;
    key: string;
    text: string;
}
export interface FooterNavigationItem {
    id: number;
    navigationTitle: string;
    navigationList: Array<{
        title: string;
        link: string;
    }>;
}
export interface FooterSocialItem {
    id: number;
    title: string;
    properties: {
        MESSENGERS_ICON: string | null;
        MESSENGERS_LINK: string;
    };
}
export interface HomeResponse {
    id: number;
    code: string;
    bannerText: string[];
    bannerImageLeft: string | null;
    bannerImageRight: string | null;
    answers: HomeAnswerItem[];
    footerInformation: FooterInformationItem[];
    footerNavigation: FooterNavigationItem[];
    footerSocials: FooterSocialItem[];
}
