export type CatalogSort = 'popular' | 'new' | 'priceAsc' | 'priceDesc';

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
  previewText: string;
  image: string | null;
  price: number | null;
  currency: string | null;
  sizes: string[];
  colors: string[];
  hasOffers: boolean;
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
  previewText?: string;
  description?: string;
  image?: string | null;
  images?: string[];
  price?: number | null;
  currency?: string | null;
  offers: CatalogProductOffer[];
}

export interface CatalogProductResponse {
  success: boolean;
  product: CatalogProductDetail;
}

export interface GetCatalogProductRequest {
  id: number;
}

export interface CatalogSearchResponse {
  success: boolean;
  query: string;
  products: CatalogProductItem[];
  sections: Array<{ id: number; name: string; code: string }>;
}

export interface CatalogSearchRequest {
  q: string;
  limit?: number;
}
