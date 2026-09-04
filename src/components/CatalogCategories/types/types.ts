export interface CategoryCardInterface {
    id?: number;
    title: string;
    image: string | null;
    imageScale?: number | null;
    imagePositionX?: number | null;
    imagePositionY?: number | null;
    path: string;
    buttonText?: string;
    variant?: "grid" | "promo";
}
export interface CatalogCategoriesInterface {
    cards: CategoryCardInterface[];
    variant?: "grid" | "promo";
    isLoading?: boolean;
}

