import type { RefObject } from "react";
import type { ProductListItem } from "@/types/product";

export interface NewsSliderProps {
  sliderRef: RefObject<HTMLDivElement | null>;
  products: ProductListItem[];
}
