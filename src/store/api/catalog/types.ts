export type CatalogSort = 'popular' | 'new' | 'priceAsc' | 'priceDesc';
export interface CatalogSection {
    id: number;
    name: string;
    code: string;
    parentId: number | null;
    depthLevel: number;
    image: string | null;
    imageScale: number | null;
    imagePositionX: number | null;
    imagePositionY: number | null;
    sort: number | null;
    children: CatalogSection[];
}
export interface CatalogSectionsResponse {
    success: boolean;
    sections: CatalogSection[];
}
export interface CatalogFilters {
    sizes: string[];
    colors: string[];
    minPrice: number | null;
    maxPrice: number | null;
}
export interface CatalogFilterOptions {
    sizes: string[];
    colors: string[];
    price: {
        min: number | null;
        max: number | null;
    };
}
export interface CatalogProductItem {
    id: number;
    sectionId: number | null;
    name: string;
    code: string;
    slug: string;
    sectionSlug: string;
    sectionName: string;
    previewText: string;
    image: string | null;
    price: number | null;
    currency: string | null;
    sizes: string[];
    colors: string[];
    hasOffers: boolean;
    isNew?: boolean;
    isBestseller?: boolean;
}
export interface CatalogPagination {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
}
export interface CatalogProductsResponse {
    success: boolean;
    products: CatalogProductItem[];
    pagination: CatalogPagination;
    filterOptions?: CatalogFilterOptions;
}
export interface GetCatalogProductsRequest {
    sectionIds?: number[];
    sizes?: string[];
    colors?: string[];
    minPrice?: number | null;
    maxPrice?: number | null;
    sort?: CatalogSort;
    limit?: number;
    offset?: number;
}
export interface CatalogProductOffer {
    id: number;
    name?: string;
    size: string | null;
    color: string | null;
    price: number | null;
    currency: string | null;
    quantity: number;
    available: boolean;
}
export interface CatalogProductDetail {
    id: number;
    sectionId?: number | null;
    name: string;
    code?: string;
    slug: string;
    sectionSlug: string;
    sectionName: string;
    previewText?: string;
    description?: string;
    article?: string | null;
    sizeTable?: string[][];
    image?: string | null;
    images?: string[];
    price?: number | null;
    currency?: string | null;
    offers: CatalogProductOffer[];
}
export type FeaturedProductType = 'new' | 'bestsellers';
export interface FeaturedProductsResponse { success: boolean; products: CatalogProductItem[]; }
export interface CatalogProductResponse {
    success: boolean;
    product: CatalogProductDetail;
}
export interface GetCatalogProductRequest {
    slug: string;
    sectionSlug: string;
}
export interface CatalogSearchResponse {
    success: boolean;
    query: string;
    products: CatalogProductItem[];
    sections: Array<{
        id: number;
        name: string;
        code: string;
    }>;
}
export interface CatalogSearchRequest {
    q: string;
    limit?: number;
}
