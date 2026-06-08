import { Link } from 'react-router-dom';
//styles
import styles from './CatalogPromoItem.module.scss';
//UI
import Image from '@UI/buttons/Image/Image.tsx';
import {convertAliasTitle} from "@helpers/convertAliasTitle.tsx";
//types
import type {CatalogPromoItemInterface} from "@components/blocks/CatalogPromo/components/CatalogPromoItem/types.ts";


const CatalogPromoItem = ({ index, title, image, link }: CatalogPromoItemInterface) => {
    return (
        <article className={`${styles.item} ${styles[`item_${index}`]}`}>
            <div className={styles.item__information}>
                <h2 className={styles.item__information_title}>
                    {convertAliasTitle(title)}
                </h2>

                <Link
                    to={link}
                    className={styles.item__information_button}
                >
                    Смотреть все
                </Link>
            </div>

            {image && (
                <div className={styles.item__imageBox}>
                    <Image
                        src={image}
                        className={styles.item__image}
                    />
                </div>
            )}
        </article>
    );
};

export default CatalogPromoItem;