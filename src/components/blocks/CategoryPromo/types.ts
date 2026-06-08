export interface PromoCategoryItemInterface {
    id: number;
    iblockId: number;
    title: string;
    code: string;
    sort: number;
    properties: {
        CATEGORY_NAME_PROMO: string;
        CATEGORY_IMAGE_PROMO: string | null;
        CATEGORY_LINK: string;
        CATEGORY_SHOW_PROMO: string;
    };
}

export interface PromoCategoryInterface {
    items: PromoCategoryItemInterface[];
}