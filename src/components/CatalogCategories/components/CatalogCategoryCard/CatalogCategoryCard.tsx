import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './CatalogCategoryCard.module.scss';
import { convertAliasTitle } from '@helpers/convertAliasTitle.tsx';
import Image from '@UI/media/Image/Image';
import type { CategoryCardInterface } from '@components/CatalogCategories/types/types.ts';
const CatalogCategoryCard = ({
  id,
  image,
  imageScale,
  path,
  title,
  variant = 'promo',
  buttonText = 'Смотреть все',
}: CategoryCardInterface) => {
  const [failedImage, setFailedImage] = useState<string | null>(null);
  const cardClassName = `${styles.card} ${id ? styles[`card_${id}`] : ''}`;
  const safeImageScale = imageScale ?? 1;
  const cardContent = (
    <>
      <div className={styles.card__information}>
        <h2 className={styles.card__information_title}>{convertAliasTitle(title)}</h2>

        {variant === 'promo' && (
          <Link to={path} className={styles.card__information_button}>
            {buttonText}
          </Link>
        )}
      </div>

      {image && image !== failedImage && (
        <div className={styles.card__imageBox}>
          <Image
            src={image}
            alt=""
            onError={() => setFailedImage(image)}
            className={styles.card__image}
            style={{
              width: 'auto',
              height: '100%',
              maxWidth: 'none',
              maxHeight: '100%',
              objectFit: 'contain',
              objectPosition: 'right bottom',
              transform: `scale(${safeImageScale})`,
              transformOrigin: 'right bottom',
            }}
          />
        </div>
      )}
    </>
  );
  if (variant === 'grid') {
    return (
      <Link to={path} className={cardClassName}>
        {cardContent}
      </Link>
    );
  }
  return <article className={cardClassName}>{cardContent}</article>;
};
export default CatalogCategoryCard;
