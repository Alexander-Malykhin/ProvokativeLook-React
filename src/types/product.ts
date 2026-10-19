export interface ProductListItem {
  id: number;
  slug?: string;
  sectionSlug?: string;
  sectionName?: string;
  title: string;
  image: string;
  price: string;
  sizes: string[];
  canBuy?: boolean;
}
