import MiniSearch from 'minisearch';
import type { CatalogProductItem } from '@store/api/catalog/types';

type SearchDocument = {
  id: number;
  name: string;
  code: string;
  previewText: string;
  sizes: string;
  colors: string;
};

export const createProductSearch = (products: CatalogProductItem[]) => {
  const search = new MiniSearch<SearchDocument>({
    fields: ['name', 'code', 'previewText', 'sizes', 'colors'],
    storeFields: ['id'],
    searchOptions: {
      prefix: true,
      fuzzy: 0.2,
      boost: {
        name: 5,
        code: 4,
        previewText: 1.5,
        sizes: 1,
        colors: 1,
      },
    },
  });

  search.addAll(
    products.map((product) => ({
      id: product.id,
      name: product.name ?? '',
      code: product.code ?? '',
      previewText: product.previewText ?? '',
      sizes: product.sizes.join(' '),
      colors: product.colors.join(' '),
    })),
  );

  return search;
};

export const searchProducts = (
  search: MiniSearch<SearchDocument>,
  products: CatalogProductItem[],
  query: string,
  limit = 12,
) => {
  const byId = new Map(products.map((product) => [product.id, product]));

  return search
    .search(query, {
      prefix: true,
      fuzzy: 0.25,
      combineWith: 'AND',
    })
    .map((result) => byId.get(Number(result.id)))
    .filter((product): product is CatalogProductItem => Boolean(product))
    .slice(0, limit);
};
