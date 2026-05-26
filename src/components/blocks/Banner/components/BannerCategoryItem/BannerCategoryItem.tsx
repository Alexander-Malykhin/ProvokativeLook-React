import {Link} from "react-router-dom";
//styles
import styles from './BannerCategoryItem.module.scss'
//UI
import Image from "@UI/buttons/Image/Image.tsx";
//types
import type {BannerCategoryItemInterface} from "@components/blocks/Banner/components/BannerCategoryItem/types/types.ts";

const BannerCategoryItem = ({image, title, path}: BannerCategoryItemInterface) => {
    return (
        <Link to={path} className={styles.item}>
            <Image src={image} alt={title} className={styles.item__image}/>
            <p className={styles.item__title}>{title}</p>
        </Link>
    );
};

export default BannerCategoryItem;