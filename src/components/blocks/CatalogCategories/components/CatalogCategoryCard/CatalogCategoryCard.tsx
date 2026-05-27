import {Link} from "react-router-dom";
//styles
import styles from './CatalogCategoryCard.module.scss'
//UI
import Image from "@UI/buttons/Image/Image.tsx";
//types
import type {
    CatalogCategoryCardInterface
} from "@components/blocks/CatalogCategories/components/CatalogCategoryCard/types/types.ts";
//helper
import {convertAliasTitle} from "@helpers/convertAliasTitle.tsx";

const CatalogCategoryCard = ({image, path, title, position}: CatalogCategoryCardInterface) => {

    return (
        <article className={styles.card}>
            <div className={styles.card__information}>
                <h2 className={styles.card__information_title}>
                    {convertAliasTitle(title)}
                </h2>

                <Link to={path} className={styles.card__information_button}>
                    Смотреть все
                </Link>
            </div>

            <Image src={image} className={`${styles.card__image} ${styles[`card__image_${position}`]}`}/>
        </article>
    );
};

export default CatalogCategoryCard;