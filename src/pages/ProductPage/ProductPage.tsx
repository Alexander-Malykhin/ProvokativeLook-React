//styles
import styles from './ProductPage.module.scss'
//components
import ViewedProducts from "@components/blocks/ViewedProducts/ViewedProducts.tsx";
import Product from "@components/blocks/Product/Product.tsx";

const ProductPage = () => {
    return (
        <main className={styles.page__main}>
            <Product/>
            <ViewedProducts/>
        </main>
    );
};

export default ProductPage;