import styles from './ProductInformation.module.scss';
import ProductBreadCrumbs from '@components/blocks/Product/components/ProductBreadCrumbs/ProductBreadCrumbs.tsx';
import ProductHeader from '@components/blocks/Product/components/ProductHeader/ProductHeader.tsx';
import ProductPrice from '@components/blocks/Product/components/ProductPrice/ProductPrice.tsx';
import ProductColors from '@components/blocks/Product/components/ProductColors/ProductColors.tsx';
import ProductSizes from '@components/blocks/Product/components/ProductSizes/ProductSizes.tsx';
import ProductsButtons from '@components/blocks/Product/components/ProductsButtons/ProductsButtons.tsx';
import ProductDelivery from '@components/blocks/Product/components/ProductDelivery/ProductDelivery.tsx';
import ProductDescription from '@components/blocks/Product/components/ProductDescription/ProductDescription.tsx';
interface ProductInformationProps {
  id: number;
  title: string;
  article: string | null;
  sectionTitle: string;
  sectionSlug: string;
  description: string;
  sizeTable: string[][];
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
  availableQuantity: number;
}
const ProductInformation = ({
  id,
  title,
  article,
  sectionTitle,
  sectionSlug,
  description,
  sizeTable,
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
  availableQuantity,
}: ProductInformationProps) => {
  return (
    <div className={styles.information}>
      <ProductBreadCrumbs title={title} sectionTitle={sectionTitle} sectionSlug={sectionSlug} />

      <ProductHeader article={article} title={title} />
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
          sizeTable={sizeTable}
          selectedSize={selectedSize}
          onChange={onSizeChange}
          disabledSizes={disabledSizes}
        />
      )}

      <ProductsButtons
        key={selectedOfferId ?? id}
        cartProductId={selectedOfferId ?? id}
        favoriteProductId={id}
        disabled={!selectedOfferAvailable}
        availableQuantity={availableQuantity}
      />
      <ProductDescription text={description} />
      <ProductDelivery />
    </div>
  );
};
export default ProductInformation;
