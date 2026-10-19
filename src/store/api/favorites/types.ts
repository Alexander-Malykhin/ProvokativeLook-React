import type { CatalogProductItem } from '@store/api/catalog/types';
export interface FavoritesResponse {
  success: boolean;
  items: CatalogProductItem[];
  ids: number[];
  count: number;
}
export interface FavoriteMutationRequest {
  productId: number;
}
export interface FavoriteMutationResponse {
  success: boolean;
  productId: number;
  ids: number[];
  count: number;
}
