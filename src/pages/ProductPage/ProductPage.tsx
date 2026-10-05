import PageStack from "@layouts/PageStack/PageStack";
import ViewedProducts from "@components/blocks/ViewedProducts/ViewedProducts.tsx";
import Product from "@components/blocks/Product/Product.tsx";
import Reviews from "@components/blocks/Reviews/Reviews";
import { useParams } from "react-router-dom";
import { useGetCatalogProductQuery } from "@store/api/catalog/catalogApi";
const ProductPage = () => {
    const { sectionSlug, productSlug } = useParams();
    const { currentData } = useGetCatalogProductQuery({ sectionSlug: sectionSlug ?? "", slug: productSlug ?? "" }, { skip: !sectionSlug || !productSlug });
    const productId = currentData?.product.id;
    return (<PageStack>
      <Product />
      <ViewedProducts />
      {productId && <Reviews key={productId} productId={productId}/>}
    </PageStack>);
};
export default ProductPage;
