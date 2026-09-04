import type { CategoryItem } from "@store/api/categories/types";
import type { CatalogSection } from "@store/api/catalog/types";

const CYRILLIC_TO_LATIN: Record<string, string> = {
    а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z',
    и: 'i', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r',
    с: 's', т: 't', у: 'u', ф: 'f', х: 'h', ц: 'c', ч: 'ch', ш: 'sh',
    щ: 'sch', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya',
};

export const slugifyCatalogValue = (value: string): string => value
    .trim()
    .toLocaleLowerCase('ru-RU')
    .split('')
    .map((letter) => CYRILLIC_TO_LATIN[letter] ?? letter)
    .join('')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const flattenCatalogSections = (sections: CatalogSection[]): CatalogSection[] => sections.flatMap((section) => [
    section,
    ...flattenCatalogSections(section.children ?? []),
]);

const CANONICAL_CATALOG_SECTIONS: Array<{ slug: string; sectionIds: number[] }> = [
    { slug: 'costumes', sectionIds: [179, 140] },
    { slug: 'outerwear', sectionIds: [132] },
    { slug: 'dresses', sectionIds: [180] },
    { slug: 'shoes', sectionIds: [172] },
    { slug: 'shirts', sectionIds: [153] },
    { slug: 'shorts', sectionIds: [159, 163] },
    { slug: 'sets', sectionIds: [138] },
    { slug: 'tops', sectionIds: [137, 143] },
    { slug: 'skirts', sectionIds: [183] },
    { slug: 'sweaters', sectionIds: [181] },
    { slug: 'hoodie', sectionIds: [182] },
    { slug: 'jeans', sectionIds: [136] },
    { slug: 'jackets', sectionIds: [166] },
    { slug: 'accessories', sectionIds: [129] },
];

export const normalizeCatalogPath = (link: string): string => {
    if (!link)
        return "/catalog";

    const path = link
        .replace(/^https?:\/\/[^/]+/i, "")
        .split("?")[0]
        .split("#")[0]
        .replace(/\/+$/, "");

    return path || "/catalog";
};

export const getCatalogCategorySlug = (category: CategoryItem): string => {
    // sectionIds are the source of truth for the catalogue filter. Some Bitrix
    // category links currently point at another catalogue route, so relying on
    // category.link can open the wrong category (or the whole catalogue).
    const canonical = CANONICAL_CATALOG_SECTIONS.find((item) =>
        item.sectionIds.some((sectionId) => category.sectionIds.includes(sectionId)),
    );

    if (canonical) {
        return canonical.slug;
    }

    const path = normalizeCatalogPath(category.link);
    const parts = path.split("/").filter(Boolean);
    return parts.at(-1) ?? category.code;
};

export const normalizeCatalogTitle = (value: string): string => value
    .replace(/#BR#/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
