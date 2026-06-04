//components
import CatalogCategories from "@components/CatalogCategories/CatalogCategories.tsx";
//api
import {navigationCatalogHomePromo} from "@api/static/navigationCatalogHomePromo.ts";

const CatalogPromo = () => {
    return (
        <CatalogCategories cards={navigationCatalogHomePromo} variant={'promo'}/>
    );
};

export default CatalogPromo;