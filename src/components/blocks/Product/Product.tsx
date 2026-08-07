import styles from "./Product.module.scss";

import { useParams } from "react-router-dom";

import SectionLayout from "@layouts/SectionLayout/SectionLayout.tsx";
import ProductImages from "@components/blocks/Product/components/ProductImages/ProductImages.tsx";
import ProductInformation from "@components/blocks/Product/components/ProductInformation/ProductInformation.tsx";

import CardImage from "@assets/products/card.png";
import CardImage1 from "@assets/products/card-1.png";
import CardImage2 from "@assets/products/card-2.png";
import { products } from "@api/static/products";

const productImages = [CardImage, CardImage1, CardImage2];

const Product = () => {
  const { id } = useParams<{ id: string }>();
  const product =
    products.find((item) => item.id === Number(id)) ?? products[0];
  const isSticky = productImages.length > 3;

  return (
    <SectionLayout>
      <div className={styles.product}>
        <ProductImages productImages={productImages} />

        <div
          className={`${styles.product__information} ${
            isSticky ? styles.product__information_sticky : ""
          }`}
        >
          <ProductInformation
            id={product.id}
            title={product.title}
            price={product.price}
          />
        </div>
      </div>
    </SectionLayout>
  );
};

export default Product;
