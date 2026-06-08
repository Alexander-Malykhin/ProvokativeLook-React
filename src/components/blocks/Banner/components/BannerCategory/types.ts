export interface BannerCategoryItemInterface {
    id: number;
    iblockId: number;
    title: string;
    code: string;
    sort: number;
    properties: {
        CATEGORY_NAME_BANNER: string;
        CATEGORY_IMAGE_BANNER: string | null;
        CATEGORY_LINK: string;
        CATEGORY_SHOW_BANNER: string;
    };
}

export interface BannerCategoryInterface {
    items: BannerCategoryItemInterface[];
}