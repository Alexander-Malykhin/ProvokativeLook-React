//components
import CatalogCategories from "@components/CatalogCategories/CatalogCategories.tsx";
//api
import {navigationCategoryCatalog} from "@api/static/navigationCategoryCatalog.ts";


const Category = () => {
    return (
        <CatalogCategories cards={navigationCategoryCatalog} variant={'grid'}/>
    );
};

export default Category;