// layouts
import PageStack from "@layouts/PageStack/PageStack";
//components
import ViewedProducts from "@components/blocks/ViewedProducts/ViewedProducts.tsx";
import Product from "@components/blocks/Product/Product.tsx";

const ProductPage = () => {
  return (
    <PageStack>
      <Product />
      <ViewedProducts />
    </PageStack>
  );
};

export default ProductPage;
