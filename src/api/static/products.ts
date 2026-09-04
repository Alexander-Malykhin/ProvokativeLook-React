import productIMage from "@assets/products/product-1.png";
import type { ProductListItem } from "@/types/product";
import { slugifyCatalogValue } from "@/helpers/catalog";
const productItems: ProductListItem[] = [
    {
        id: 1,
        title: "Шуба",
        image: productIMage,
        price: "17 700 ₽",
        sizes: ["48", "50", "52", "54"],
    },
    {
        id: 2,
        title: "Босоножки",
        image: productIMage,
        price: "7 700 ₽",
        sizes: ["48", "50", "52", "54"],
    },
    {
        id: 3,
        title: "Комбинезон с накидкой",
        image: productIMage,
        price: "11 700 ₽",
        sizes: ["48", "50", "52", "54"],
    },
    {
        id: 4,
        title: "Свитшот",
        image: productIMage,
        price: "17 700 ₽",
        sizes: ["48", "50", "52"],
    },
    {
        id: 5,
        title: "Шуба",
        image: productIMage,
        price: "17 700 ₽",
        sizes: ["48", "50", "52", "54"],
    },
    {
        id: 6,
        title: "Босоножки",
        image: productIMage,
        price: "7 700 ₽",
        sizes: ["48", "50", "52", "54"],
    },
    {
        id: 7,
        title: "Шуба",
        image: productIMage,
        price: "17 700 ₽",
        sizes: ["48", "50", "52", "54"],
    },
    {
        id: 8,
        title: "Босоножки",
        image: productIMage,
        price: "7 700 ₽",
        sizes: ["48", "50", "52", "54"],
    },
    {
        id: 9,
        title: "Комбинезон с накидкой",
        image: productIMage,
        price: "11 700 ₽",
        sizes: ["48", "50", "52", "54"],
    },
    {
        id: 10,
        title: "Свитшот",
        image: productIMage,
        price: "17 700 ₽",
        sizes: ["48", "50", "52"],
    },
    {
        id: 11,
        title: "Шуба",
        image: productIMage,
        price: "17 700 ₽",
        sizes: ["48", "50", "52", "54"],
    },
    {
        id: 12,
        title: "Босоножки",
        image: productIMage,
        price: "7 700 ₽",
        sizes: ["48", "50", "52", "54"],
    },
];

const SECTION_BY_TITLE: Record<string, string> = {
    "Шуба": "outerwear",
    "Босоножки": "shoes",
    "Комбинезон с накидкой": "costumes",
    "Свитшот": "hoodie",
};

export const products: ProductListItem[] = productItems.map((product) => ({
    ...product,
    slug: slugifyCatalogValue(product.title),
    sectionSlug: SECTION_BY_TITLE[product.title] ?? "catalog",
}));
