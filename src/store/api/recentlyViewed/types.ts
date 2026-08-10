import type { CatalogProductItem } from '@store/api/catalog/types';

export interface RecentlyViewedResponse {
  success: boolean;
  items: CatalogProductItem[];
  count: number;
}

export interface GetRecentlyViewedRequest {
  limit?: number;
  excludeId?: number;
}
