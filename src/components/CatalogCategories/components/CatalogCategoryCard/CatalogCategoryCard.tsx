import { Link } from 'react-router-dom';

import styles from './CatalogCategoryCard.module.scss';

import Image from '@UI/buttons/Image/Image.tsx';
import type { CategoryCardInterface } from '@components/CatalogCategories/types/types.ts';
import { convertAliasTitle } from '@helpers/convertAliasTitle.tsx';
import Title from "@UI/typography/Title/Title.tsx";

const CatalogCategoryCard = ({id, image, path, title, variant = 'promo', buttonText = 'Смотреть все',}: CategoryCardInterface) => {
    const cardClassName = `${styles.card} ${id ? styles[`card_${id}`] : ''}`;

    const cardContent = (
        <>
            <div className={styles.card__information}>
                <Title className={styles.card__information_title} size="xl">
                    {convertAliasTitle(title)}
                </Title>

                {variant === 'promo' && (
                    <Link to={path} className={styles.card__information_button}>
                        {buttonText}
                    </Link>
                )}
            </div>

            <div className={styles.card__imageBox}>
                <Image src={image} className={styles.card__image} />
            </div>
        </>
    );

    if (variant === 'grid') {
        return (
            <Link to={path} className={cardClassName}>
                {cardContent}
            </Link>
        );
    }

    return (
        <article className={cardClassName}>
            {cardContent}
        </article>
    );
};

export default CatalogCategoryCard;