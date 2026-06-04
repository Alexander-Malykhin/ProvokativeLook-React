//styles
import styles from './BannerCategory.module.scss'
//components
import BannerCategoryItem from "@components/blocks/Banner/components/BannerCategoryItem/BannerCategoryItem.tsx";
//api
import {navigationHomeCategory} from "@api/static/navigationHomeCategory.ts";

const BannerCategory = () => {
    return (
        <div className={styles.category}>
            <div className={styles.category__list}>
                {navigationHomeCategory.map((item) => (
                    <BannerCategoryItem key={item.id} image={item.image} title={item.title} path={item.path}/>
                ))}
            </div>
        </div>
    );
};

export default BannerCategory;