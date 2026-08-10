import type { CategoryItem } from "@store/api/categories/types";

export const normalizeCatalogPath = (link: string): string => {
  if (!link) return "/catalog";

  const path = link
    .replace(/^https?:\/\/[^/]+/i, "")
    .split("?")[0]
    .split("#")[0]
    .replace(/\/+$/, "");

  return path || "/catalog";
};

export const getCatalogCategorySlug = (category: CategoryItem): string => {
  const path = normalizeCatalogPath(category.link);
  const parts = path.split("/").filter(Boolean);

  return parts.at(-1) ?? category.code;
};


export const normalizeCatalogTitle = (value: string): string =>
  value.replace(/#BR#/gi, " ").replace(/\s+/g, " ").trim();
