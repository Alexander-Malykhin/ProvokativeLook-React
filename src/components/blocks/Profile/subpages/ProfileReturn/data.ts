import ProductImage from "@assets/products/product-1.png";
import type { ReturnItemInterface } from "../../types/types";

export const PROFILE_RETURNS: ReturnItemInterface[] = [
  {
    id: 1,
    status: "Деньги отправлены",
    date: "21.02.2024",
    orderNumber: "123111",
    total: 20530,
    productsCount: 2,
    products: [
      { id: 1, image: ProductImage },
      { id: 2, image: ProductImage },
    ],
  },
];
