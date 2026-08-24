export interface CategoryBanner {
    show: boolean;
    title: string;
    image: string | null;
}
export interface CategoryPromo {
    show: boolean;
    title: string;
    image: string | null;
}
export interface CategoryCatalog {
    show: boolean;
    title: string;
    image: string | null;
}
export interface CategoryCatalogPage {
    show: boolean;
}
export interface CategoryItem {
    id: number;
    code: string;
    name: string;
    sort: number;
    sectionIds: number[];
    link: string;
    banner: CategoryBanner;
    promo: CategoryPromo;
    catalog: CategoryCatalog;
    catalogPage: CategoryCatalogPage;
}
export interface CategoriesResponse {
    items: CategoryItem[];
}

