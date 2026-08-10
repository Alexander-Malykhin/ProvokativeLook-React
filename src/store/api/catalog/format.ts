import type { CatalogProductItem } from './types';
import type { ProductListItem } from '@/types/product';

export const formatCatalogPrice = (
  price: number | null | undefined,
  currency: string | null | undefined,
): string => {
  if (price == null) return 'Цена не указана';
  const value = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 }).format(price);
  if (currency === 'RUB') return `${value} ₽`;
  return `${value} ${currency ?? ''}`.trim();
};

export const catalogProductToListItem = (product: CatalogProductItem): ProductListItem => ({
  id: product.id,
  title: product.name,
  image: product.image ?? '',
  price: formatCatalogPrice(product.price, product.currency),
  sizes: product.sizes ?? [],
});
