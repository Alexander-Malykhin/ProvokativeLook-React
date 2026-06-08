export interface NavigationItemResponse {
    id: number;
    code: string;
    sort: number;
    title: string;
    link: string;
}

export type NavigationResponse = NavigationItemResponse[];