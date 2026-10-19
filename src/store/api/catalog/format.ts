import type { CatalogProductItem } from './types';
import type { ProductListItem } from '@/types/product';
export const formatCatalogPrice = (price: number | null | undefined, currency: string | null | undefined): string => {
  if (price == null || !Number.isFinite(price) || price <= 0) return 'Цена не указана';
  const value = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 }).format(price);
  if (currency === 'RUB') return `${value} ₽`;
  return `${value} ${currency ?? ''}`.trim();
};
export const catalogProductToListItem = (product: CatalogProductItem): ProductListItem => ({
  id: product.id,
  slug: product.slug,
  sectionSlug: product.sectionSlug,
  sectionName: product.sectionName,
  title: product.name,
  image: product.image ?? '',
  price: formatCatalogPrice(product.price, product.currency),
  sizes: product.sizes ?? [],
  canBuy: product.available && Number.isFinite(product.price) && (product.price ?? 0) > 0,
});
