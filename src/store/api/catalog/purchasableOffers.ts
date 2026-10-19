import type { CatalogProductDetail, CatalogProductOffer } from './types';
export function purchasableOffers(product: CatalogProductDetail | undefined): CatalogProductOffer[] {
  if (!product) return [];
  if (product.offers.length)
    return product.offers.filter(
      (offer) => offer.available && offer.quantity >= 1 && Number.isFinite(offer.price) && (offer.price ?? 0) > 0,
    );

  if (
    product.hasOffers === false &&
    product.available &&
    (product.quantity ?? 0) >= 1 &&
    Number.isFinite(product.price) &&
    (product.price ?? 0) > 0
  ) {
    return [
      {
        id: product.id,
        name: product.name,
        size: null,
        color: null,
        price: product.price ?? null,
        currency: product.currency ?? null,
        available: true,
        quantity: product.quantity!,
      },
    ];
  }
  return [];
}
