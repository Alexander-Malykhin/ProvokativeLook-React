import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./Product.module.scss";
import SectionLayout from "@layouts/SectionLayout/SectionLayout.tsx";
import ProductImages from "@components/blocks/Product/components/ProductImages/ProductImages.tsx";
import ProductInformation from "@components/blocks/Product/components/ProductInformation/ProductInformation.tsx";
import { useGetCatalogProductQuery } from "@store/api/catalog/catalogApi";
import { useAddRecentlyViewedMutation } from "@store/api/recentlyViewed/recentlyViewedApi";
import type { CatalogProductOffer } from "@store/api/catalog/types";
import { purchasableOffers } from '@store/api/catalog/purchasableOffers';
const formatPrice = (price?: number | null, currency?: string | null): string => {
    if (price == null)
        return "Цена не указана";
    const formatted = new Intl.NumberFormat("ru-RU", {
        maximumFractionDigits: 0,
    }).format(price);
    if (currency === "RUB")
        return `${formatted} ₽`;
    return `${formatted} ${currency ?? ""}`.trim();
};
const ProductSkeleton = () => (<SectionLayout>
    <div className={`${styles.product} ${styles.product_skeleton}`}>
      <div className={styles.product__skeletonGallery}/>
      <div className={styles.product__skeletonInfo}>
        <span />
        <span />
        <span />
        <span />
      </div>
    </div>
  </SectionLayout>);
const Product = () => {
    const { sectionSlug, productSlug } = useParams<{
        sectionSlug: string;
        productSlug: string;
    }>();
    const canRequest = Boolean(sectionSlug && productSlug);
    const { currentData: data, error, isLoading, isFetching, refetch } = useGetCatalogProductQuery({ sectionSlug: sectionSlug ?? "", slug: productSlug ?? "" }, { skip: !canRequest, refetchOnReconnect: true });
    const product = data?.product;
    const [addRecentlyViewed] = useAddRecentlyViewedMutation();
    const recordedViewedIdRef = useRef<number | null>(null);
    const allOffers = useMemo(() => product?.offers ?? [], [product?.offers]);
    const availableOffers = useMemo(() => purchasableOffers(product), [product]);
    const [selectedOfferId, setSelectedOfferId] = useState<number | null>(null);
    useEffect(() => {
        if (!product?.id || recordedViewedIdRef.current === product.id)
            return;
        recordedViewedIdRef.current = product.id;
        void addRecentlyViewed({ productId: product.id })
            .unwrap()
            .catch(() => {
            recordedViewedIdRef.current = null;
        });
    }, [product?.id, addRecentlyViewed]);
    const selectedOffer = useMemo<CatalogProductOffer | null>(() => {
        if (!selectedOfferId)
            return availableOffers[0] ?? null;
        return availableOffers.find((offer) => offer.id === selectedOfferId) ?? availableOffers[0] ?? null;
    }, [availableOffers, selectedOfferId]);
    const colors = useMemo(() => Array.from(new Set(allOffers.map((offer) => offer.color).filter(Boolean))) as string[], [allOffers]);
    const disabledColors = useMemo(() => colors.filter((color) => !availableOffers.some((offer) => offer.color === color)), [availableOffers, colors]);
    const sizes = useMemo(() => Array.from(new Set(allOffers
        .map((offer) => offer.size)
        .filter(Boolean))) as string[], [allOffers]);
    const disabledSizes = useMemo(() => {
        const selectedColor = selectedOffer?.color ?? null;
        return sizes.filter((size) => !availableOffers.some((offer) => offer.size === size &&
            (!selectedColor || offer.color === selectedColor) &&
            offer.available));
    }, [availableOffers, selectedOffer?.color, sizes]);
    const handleColorChange = (color: string) => {
        const currentSize = selectedOffer?.size ?? null;
        const exact = availableOffers.find((offer) => offer.color === color && (!currentSize || offer.size === currentSize));
        const fallback = availableOffers.find((offer) => offer.color === color);
        setSelectedOfferId((exact ?? fallback)?.id ?? null);
    };
    const handleSizeChange = (size: string) => {
        const currentColor = selectedOffer?.color ?? null;
        const exact = availableOffers.find((offer) => offer.size === size && (!currentColor || offer.color === currentColor));
        const fallback = availableOffers.find((offer) => offer.size === size);
        setSelectedOfferId((exact ?? fallback)?.id ?? null);
    };
    if (!canRequest) {
        return <SectionLayout>Некорректная ссылка на товар</SectionLayout>;
    }
    if (isLoading || (isFetching && !product)) {
        return <ProductSkeleton />;
    }
    if (!product) {
        const notFound = error && 'status' in error && error.status === 404;
        return <SectionLayout><div className={styles.product__error} role="status">
          <h2>{notFound ? 'Товар не найден' : 'Не удалось загрузить товар'}</h2>
          {!notFound && <><p>Проверьте подключение и попробуйте ещё раз.</p><button type="button" onClick={() => refetch()}>Повторить загрузку</button></>}
        </div></SectionLayout>;
    }
    const productImages = product.images?.length
        ? product.images
        : product.image
            ? [product.image]
            : [];
    const currentPrice = selectedOffer?.price ?? product.price ?? null;
    const currentCurrency = selectedOffer?.currency ?? product.currency ?? null;
    return (<SectionLayout>
      <div className={styles.product}>
        <ProductImages productImages={productImages} title={product.name}/>

        <div className={`${styles.product__information} ${styles.product__information_sticky}`}>
          <ProductInformation id={product.id} title={product.name} article={product.article ?? null} sectionTitle={product.sectionName} sectionSlug={product.sectionSlug} description={product.description ?? ""} sizeTable={product.sizeTable ?? []} price={formatPrice(currentPrice, currentCurrency)} colors={colors} selectedColor={selectedOffer?.color ?? null} onColorChange={handleColorChange} disabledColors={disabledColors} sizes={sizes} selectedSize={selectedOffer?.size ?? null} onSizeChange={handleSizeChange} disabledSizes={disabledSizes} selectedOfferId={selectedOffer?.id ?? null} selectedOfferAvailable={Boolean(selectedOffer?.available)} availableQuantity={selectedOffer?.quantity ?? 0}/>
        </div>
      </div>
    </SectionLayout>);
};
export default Product;

