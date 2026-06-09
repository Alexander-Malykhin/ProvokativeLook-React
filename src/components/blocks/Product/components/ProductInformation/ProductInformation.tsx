import styles from './ProductInformation.module.scss'

import ProductBreadCrumbs from "@components/blocks/Product/components/ProductBreadCrumbs/ProductBreadCrumbs.tsx";
import ProductHeader from "@components/blocks/Product/components/ProductHeader/ProductHeader.tsx";
import ProductPrice from "@components/blocks/Product/components/ProductPrice/ProductPrice.tsx";
import ProductColors from "@components/blocks/Product/components/ProductColors/ProductColors.tsx";
import ProductSizes from "@components/blocks/Product/components/ProductSizes/ProductSizes.tsx";
import ProductParams from "@components/blocks/Product/components/ProductParams/ProductParams.tsx";
import ProductsComposition from "@components/blocks/Product/components/ProductsComposition/ProductsComposition.tsx";
import ProductsButtons from "@components/blocks/Product/components/ProductsButtons/ProductsButtons.tsx";
import ProductDelivery from "@components/blocks/Product/components/ProductDelivery/ProductDelivery.tsx";
import ProductDescription from "@components/blocks/Product/components/ProductDescription/ProductDescription.tsx";


const ProductInformation = () => {
    return (
        <div className={styles.information}>
            <ProductBreadCrumbs/>

            <ProductHeader/>

            <ProductPrice/>
            <ProductColors/>

            <ProductSizes/>
            <ProductParams/>

            <ProductsComposition/>

            <ProductsButtons/>

            <ProductDescription/>
            <ProductDelivery/>
        </div>
    );
};

export default ProductInformation;