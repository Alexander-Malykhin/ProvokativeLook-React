export interface CategoryPromoInterface {
    id: number;
    iblockId: number;
    title: string;
    code: string;
    sort: number;
    properties: {
        CATEGORY_NAME_BANNER: string;
        CATEGORY_IMAGE_BANNER: string | null;
        CATEGORY_NAME_PROMO: string;
        CATEGORY_IMAGE_PROMO: string | null;
        CATEGORY_NAME_CATALOG: string;
        CATEGORY_IMAGE_CATALOG: string | null;
        CATEGORY_LINK: string;
        CATEGORY_SHOW_BANNER: string;
        CATEGORY_SHOW_PROMO: string;
        CATEGORY_SHOW_CATALOG: string;
    };
}
