import type { RefObject } from "react";
import type { ProductListItem } from "@/types/product";

export interface ViewedSliderProps {
  sliderRef: RefObject<HTMLDivElement | null>;
  products: ProductListItem[];
  visibleProducts: ProductListItem[];
}
