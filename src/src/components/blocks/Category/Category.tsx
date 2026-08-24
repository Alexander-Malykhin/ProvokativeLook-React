import CatalogCategories from "@components/CatalogCategories/CatalogCategories.tsx";
import { useGetCategoriesQuery } from "@store/api/categories/categoriesApi.ts";
import { getCatalogCategorySlug } from "@/helpers/catalog";
const catalogPresentationOrder: Record<string, number> = {
    costumes: 1,
    outerwear: 2,
    dresses_and_sundresses: 3,
    shoes: 4,
    blouses_and_shirts: 5,
    pants_and_shorts: 6,
    sets: 7,
    tops_and_shirts: 8,
    skirts: 9,
    sweaters_and_cardigans: 10,
    sweatshirts_and_hoodies: 11,
    jeans: 12,
    jackets: 13,
    accessories: 14,
};
const Category = () => {
    const { data, isLoading, isError } = useGetCategoriesQuery();
    if (isLoading)
        return null;
    if (isError)
        return null;
    const cards = (data?.items ?? [])
        .filter((item) => item.catalogPage.show)
        .filter((item) => item.catalog.image)
        .filter((item) => item.sectionIds.length > 0)
        .filter((item) => catalogPresentationOrder[item.code] !== undefined)
        .sort((a, b) => catalogPresentationOrder[a.code] - catalogPresentationOrder[b.code])
        .map((item) => ({
        id: catalogPresentationOrder[item.code],
        title: item.catalog.title || item.name,
        path: `/catalog/${getCatalogCategorySlug(item)}`,
        image: item.catalog.image!,
    }));
    return <CatalogCategories cards={cards} variant="grid"/>;
};
export default Category;

