import type { CatalogProductItem } from '@store/api/catalog/types';

export interface FavoritesResponse {
  success: boolean;
  items: CatalogProductItem[];
  count: number;
}

export interface FavoriteMutationRequest {
  productId: number;
}
