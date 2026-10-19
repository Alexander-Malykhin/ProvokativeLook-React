import styles from './ReviewsItem.module.scss';
import { useState } from 'react';
import Image from '@UI/media/Image/Image';
import ProductGalleryModal from '@components/blocks/Product/components/ProductGalleryModal/ProductGalleryModal';
import type { ReviewsItemProps } from '@components/blocks/Reviews/types/types';
const ReviewsItem = ({ name, date, text, photos = [] }: ReviewsItemProps) => {
  const [activePhoto, setActivePhoto] = useState<number | null>(null);
  const images = photos.filter(Boolean).slice(0, 2);
  return (
    <>
      <article className={styles.item}>
        {images.length > 0 && (
          <div className={styles.item__photos}>
            {images.map((photo, index) => (
              <button
                type="button"
                key={`${photo}-${index}`}
                onClick={() => setActivePhoto(index)}
                aria-label={`Увеличить фото ${index + 1} из отзыва ${name}`}
              >
                <Image src={photo} alt={`Фото ${index + 1} к отзыву`} />
              </button>
            ))}
          </div>
        )}
        <div className={styles.item__head}>
          <span className={styles.item__name}>{name}</span>

          <span className={styles.item__date}>{date}</span>
        </div>

        <p className={styles.item__text}>{text}</p>
      </article>
      {activePhoto !== null && (
        <ProductGalleryModal
          images={images}
          activeIndex={activePhoto}
          title={`Фото из отзыва ${name}`}
          onChange={setActivePhoto}
          onClose={() => setActivePhoto(null)}
        />
      )}
    </>
  );
};
export default ReviewsItem;
