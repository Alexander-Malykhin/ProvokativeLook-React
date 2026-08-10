import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

import styles from "./ProductGalleryModal.module.scss";
import Image from "@UI/media/Image/Image";

interface ProductGalleryModalProps {
  images: string[];
  activeIndex: number;
  title: string;
  onChange: (index: number) => void;
  onClose: () => void;
}

const ProductGalleryModal = ({
  images,
  activeIndex,
  title,
  onChange,
  onClose,
}: ProductGalleryModalProps) => {
  const touchStartX = useRef<number | null>(null);

  const previous = () => {
    if (!images.length) return;
    onChange((activeIndex - 1 + images.length) % images.length);
  };

  const next = () => {
    if (!images.length) return;
    onChange((activeIndex + 1) % images.length);
  };

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") previous();
      if (event.key === "ArrowRight") next();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeIndex, images.length, onClose, onChange]);

  if (!images.length) return null;

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null) return;

    const endX = event.changedTouches[0]?.clientX ?? touchStartX.current;
    const delta = endX - touchStartX.current;
    touchStartX.current = null;

    if (Math.abs(delta) < 45) return;
    if (delta > 0) previous();
    else next();
  };

  return createPortal(
    <div
      className={styles.gallery}
      role="dialog"
      aria-modal="true"
      aria-label={`Галерея ${title}`}
    >
      <button
        type="button"
        className={styles.gallery__overlay}
        onClick={onClose}
        aria-label="Закрыть галерею"
      />

      <div className={styles.gallery__content}>
        <button
          type="button"
          className={styles.gallery__close}
          onClick={onClose}
          aria-label="Закрыть"
        >
          ×
        </button>

        <div
          className={styles.gallery__stage}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {images.length > 1 && (
            <button
              type="button"
              className={`${styles.gallery__arrow} ${styles.gallery__arrow_left}`}
              onClick={previous}
              aria-label="Предыдущее фото"
            >
              ←
            </button>
          )}

          <div className={styles.gallery__main}>
            <Image
              src={images[activeIndex]}
              alt={`${title}, фото ${activeIndex + 1}`}
              className={styles.gallery__mainImage}
              loading="eager"
            />
          </div>

          {images.length > 1 && (
            <button
              type="button"
              className={`${styles.gallery__arrow} ${styles.gallery__arrow_right}`}
              onClick={next}
              aria-label="Следующее фото"
            >
              →
            </button>
          )}
        </div>

        {images.length > 1 && (
          <div className={styles.gallery__thumbs}>
            {images.map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                className={`${styles.gallery__thumb} ${
                  activeIndex === index ? styles.gallery__thumb_active : ""
                }`}
                onClick={() => onChange(index)}
                aria-label={`Открыть фото ${index + 1}`}
              >
                <Image
                  src={image}
                  alt=""
                  className={styles.gallery__thumbImage}
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
};

export default ProductGalleryModal;
