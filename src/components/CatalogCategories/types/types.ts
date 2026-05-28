export interface CategoryCardInterface {
    id?: number;
    title: string;
    image: string;
    path: string;
    buttonText?: string;
    variant?: 'grid' | 'promo';
}

export interface CatalogCategoriesInterface {
    cards: readonly CategoryCardInterface[];
    variant?: 'grid' | 'promo';
}