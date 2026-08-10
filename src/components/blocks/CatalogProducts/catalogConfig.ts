export type CatalogCategoryConfig = {
  slug: string;
  title: string;
  sectionIds: number[];
};

const ALL_CATEGORY: CatalogCategoryConfig = {
  slug: 'all',
  title: 'СМОТРЕТЬ ВСЁ',
  sectionIds: [],
};

export const CATALOG_CATEGORIES: CatalogCategoryConfig[] = [
  ALL_CATEGORY,
  { slug: 'costumes', title: 'КОМБИНЕЗОНЫ И КОСТЮМЫ', sectionIds: [179, 140] },
  { slug: 'outerwear', title: 'ВЕРХНЯЯ ОДЕЖДА', sectionIds: [132] },
  { slug: 'dresses', title: 'ПЛАТЬЯ И САРАФАНЫ', sectionIds: [180] },
  { slug: 'shoes', title: 'ОБУВЬ', sectionIds: [172] },
  { slug: 'shirts', title: 'БЛУЗЫ И РУБАШКИ', sectionIds: [153] },
  { slug: 'shorts', title: 'БРЮКИ И ШОРТЫ', sectionIds: [159, 163] },
  { slug: 'sets', title: 'КОМПЛЕКТЫ', sectionIds: [138] },
  { slug: 'tops', title: 'ТОПЫ И ФУТБОЛКИ', sectionIds: [137, 143] },
  { slug: 'skirts', title: 'ЮБКИ', sectionIds: [183] },
  { slug: 'sweaters', title: 'СВИТЕРЫ И КАРДИГАНЫ', sectionIds: [181] },
  { slug: 'hoodie', title: 'ТОЛСТОВКИ И ХУДИ', sectionIds: [182] },
  { slug: 'jeans', title: 'ДЖИНСЫ', sectionIds: [136] },
  { slug: 'jackets', title: 'ЖАКЕТЫ', sectionIds: [166] },
  { slug: 'accessories', title: 'АКСЕССУАРЫ', sectionIds: [129] },
];

export const getCatalogCategory = (slug?: string | null): CatalogCategoryConfig =>
  CATALOG_CATEGORIES.find((item) => item.slug === slug) ?? ALL_CATEGORY;
