//components
import CatalogCategories from '@components/CatalogCategories/CatalogCategories.tsx';
//store
import { useGetCategoriesQuery } from '@store/api/categories/categoriesApi.ts';
//data
import {catalogOrder} from "@pages/CatalogPage/data.ts";

const Category = () => {
    const { data, isLoading, isError } = useGetCategoriesQuery();

    if (isLoading) return null;
    if (isError) return null;

    const cards = catalogOrder
        .map((id) => data?.items.find((item) => item.id === id))
        .filter(Boolean)
        .filter((item) => item?.catalog.image)
        .map((item) => ({
            id: item!.id,
            title: item!.catalog.title || item!.name,
            path: item!.link,
            image: item!.catalog.image,
        }));

    return <CatalogCategories cards={cards} variant="grid" />;
};

export default Category;