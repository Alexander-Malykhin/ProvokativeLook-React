import styles from "./BannerCategory.module.scss";
import BannerCategoryItem from "@components/blocks/Banner/components/BannerCategoryItem/BannerCategoryItem.tsx";
import type { CategoryItem } from "@store/api/categories/types";
interface BannerCategoryProps {
    items: CategoryItem[];
}
const BannerCategory = ({ items }: BannerCategoryProps) => {
    if (items.length === 0)
        return null;
    return (<div className={styles.category}>
      <div className={styles.category__list}>
        {items.map((item) => (<BannerCategoryItem key={item.id} image={item.banner.image} title={item.banner.title || item.name} path={item.link}/>))}
      </div>
    </div>);
};
export default BannerCategory;

