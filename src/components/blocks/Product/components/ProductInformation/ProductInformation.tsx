import styles from "./ProductInformation.module.scss";

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

interface ProductInformationProps {
  id: number;
  title: string;
  description: string;
  price: string;
  colors: string[];
  selectedColor: string | null;
  onColorChange: (color: string) => void;
  disabledColors?: string[];
  sizes: string[];
  selectedSize: string | null;
  onSizeChange: (size: string) => void;
  disabledSizes?: string[];
  selectedOfferId: number | null;
  selectedOfferAvailable: boolean;
}

const DEFAULT_DESCRIPTION =
  "Кардиган имеет элегантный силуэт, который подчеркивает фигуру, а его длина позволяет носить его как с джинсами, так и с платьями. Дизайнерские элементы, такие как оригинальные пуговицы и аккуратные швы, придают изделию уникальный шарм.";

const ProductInformation = ({
  id,
  title,
  description,
  price,
  colors,
  selectedColor,
  onColorChange,
  disabledColors = [],
  sizes,
  selectedSize,
  onSizeChange,
  disabledSizes = [],
  selectedOfferId,
  selectedOfferAvailable,
}: ProductInformationProps) => {
  const visibleDescription = description.trim() || DEFAULT_DESCRIPTION;

  return (
    <div className={styles.information}>
      <ProductBreadCrumbs title={title} />

      <ProductHeader id={id} title={title} />
      <ProductPrice price={price} />

      {colors.length > 0 && (
        <ProductColors
          colors={colors}
          selectedColor={selectedColor}
          onChange={onColorChange}
          disabledColors={disabledColors}
        />
      )}

      {sizes.length > 0 && (
        <ProductSizes
          sizes={sizes}
          selectedSize={selectedSize}
          onChange={onSizeChange}
          disabledSizes={disabledSizes}
        />
      )}

      <ProductParams />
      <ProductsComposition />

      <ProductsButtons
        cartProductId={selectedOfferId ?? id}
        favoriteProductId={id}
        disabled={!selectedOfferAvailable}
      />

      <ProductDescription text={visibleDescription} />
      <ProductDelivery />
    </div>
  );
};

export default ProductInformation;
