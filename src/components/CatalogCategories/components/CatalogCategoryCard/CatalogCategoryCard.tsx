import { Link } from 'react-router-dom';

import styles from './CatalogCategoryCard.module.scss';

import Image from '@UI/buttons/Image/Image.tsx';
import type { CategoryCardInterface } from '@components/CatalogCategories/types/types.ts';
import { convertAliasTitle } from '@helpers/convertAliasTitle.tsx';

const CatalogCategoryCard = ({id, image, path, title, variant = 'promo', buttonText = 'Смотреть все',}: CategoryCardInterface) => {
    return (
        <article className={`${styles.card} ${id ? styles[`card_${id}`] : ''}`}>
            <div className={styles.card__information}>
                <h2 className={styles.card__information_title}>
                    {convertAliasTitle(title)}
                </h2>

                {variant === 'promo' && (
                    <Link to={path} className={styles.card__information_button}>
                        {buttonText}
                    </Link>
                )}
            </div>

            <div className={styles.card__imageBox}>
                <Image src={image} className={styles.card__image} />
            </div>
        </article>
    );
};

export default CatalogCategoryCard;