export interface BannerItem {
    id: number;
    name: string;
    title: string;
    sort: number;
    image: string;
    link: string;
}
export interface BannersResponse {
    success: boolean;
    iblockId: number;
    iblockName: string;
    items: BannerItem[];
}
export type BannerRoute = 'miniBanners' | 'banners1x2' | 'banners1x3';
