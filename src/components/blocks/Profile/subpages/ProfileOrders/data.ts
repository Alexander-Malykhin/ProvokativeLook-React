import ProductImage from "@assets/products/product-1.png";
import type { OrderInterface } from "../../types/types";

export const PROFILE_ORDERS: OrderInterface[] = [
  {
    id: 1,
    number: "123111",
    date: "15.02.2025",
    status: "delivery",
    statusText: "В пути",
    total: 150675,
    productsCount: 7,
    products: Array.from({ length: 7 }, (_, index) => ({
      id: index + 1,
      image: ProductImage,
    })),
  },
  {
    id: 2,
    number: "123112",
    date: "15.02.2025",
    status: "completed",
    statusText: "Выполнен",
    total: 150675,
    productsCount: 1,
    products: [{ id: 1, image: ProductImage }],
  },
  {
    id: 3,
    number: "123113",
    date: "15.02.2025",
    status: "return",
    statusText: "Возврат",
    total: 150675,
    productsCount: 1,
    products: [{ id: 1, image: ProductImage }],
  },
  {
    id: 4,
    number: "123114",
    date: "15.02.2025",
    status: "cancelled",
    statusText: "Отменён",
    total: 150675,
    productsCount: 2,
    products: [
      { id: 1, image: ProductImage },
      { id: 2, image: ProductImage },
    ],
  },
];
