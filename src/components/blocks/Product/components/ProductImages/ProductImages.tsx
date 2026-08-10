import { useRef, useState } from "react";
import styles from "./ProductImages.module.scss";

import Image from "@UI/media/Image/Image";
import ProductGalleryModal from "@components/blocks/Product/components/ProductGalleryModal/ProductGalleryModal";

interface ProductImagesProps {
  productImages: string[];
  title: string;
}

const ProductImages = ({ productImages, title }: ProductImagesProps) => {
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [modalIndex, setModalIndex] = useState<number | null>(null);

  const handleScroll = () => {
    const slider = sliderRef.current;
    if (!slider) return;

    const index = Math.round(slider.scrollLeft / slider.clientWidth);
    setActiveIndex(index);
  };

  const scrollToSlide = (index: number) => {
    const slider = sliderRef.current;
    if (!slider) return;

    slider.scrollTo({
      left: slider.clientWidth * index,
      behavior: "smooth",
    });
  };

  if (!productImages.length) {
    return <div className={styles.slider__empty}>Изображения пока не добавлены</div>;
  }

  return (
    <>
      <div className={styles.slider}>
        <button
          type="button"
          className={styles.slider__mainButton}
          onClick={() => setModalIndex(0)}
        >
          <Image
            src={productImages[0]}
            alt={title}
            className={styles.slider__main}
            loading="eager"
          />
        </button>

        <div
          ref={sliderRef}
          onScroll={handleScroll}
          className={styles.slider__list}
        >
          {productImages.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              className={`${styles.slider__itemButton} ${
                index === 0 ? styles.slider__itemButton_first : ""
              }`}
              onClick={() => setModalIndex(index)}
            >
              <Image
                src={image}
                alt={`${title}, фото ${index + 1}`}
                className={styles.slider__item}
                loading={index < 3 ? "eager" : "lazy"}
              />
            </button>
          ))}
        </div>

        {productImages.length > 1 && (
          <div className={styles.slider__dots}>
            {productImages.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => scrollToSlide(index)}
                className={`${styles.slider__dot} ${
                  activeIndex === index ? styles.slider__dot_active : ""
                }`}
                aria-label={`Фото ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {modalIndex !== null && (
        <ProductGalleryModal
          images={productImages}
          activeIndex={modalIndex}
          title={title}
          onChange={setModalIndex}
          onClose={() => setModalIndex(null)}
        />
      )}
    </>
  );
};

export default ProductImages;
