export interface CatalogPromoItemProps {
  index: number;
  title: string;
  image: string | null;
  link: string;
}

export interface CatalogPromoDotsProps {
  count: number;
  activeIndex: number;
  onDotClick: (index: number) => void;
}
