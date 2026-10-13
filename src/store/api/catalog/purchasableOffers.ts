import type { CatalogProductDetail, CatalogProductOffer } from './types';
export function purchasableOffers(product: CatalogProductDetail | undefined): CatalogProductOffer[] {
    if (!product) return [];
    if (product.offers.length) return product.offers.filter(offer => offer.available && offer.quantity >= 1 && Number.isFinite(offer.price) && (offer.price ?? 0) > 0);
    // Only an explicit server stock check permits buying a simple product. An
    // SKU parent with missing offers must never be purchased as its own variant.
    if (product.hasOffers === false && product.available && (product.quantity ?? 0) >= 1 && Number.isFinite(product.price) && (product.price ?? 0) > 0) {
        return [{id:product.id,name:product.name,size:null,color:null,price:product.price ?? null,currency:product.currency ?? null,available:true,quantity:product.quantity!}];
    }
    return [];
}
