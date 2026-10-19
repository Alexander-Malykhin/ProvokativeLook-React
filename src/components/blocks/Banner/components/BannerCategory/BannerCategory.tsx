import styles from './BannerCategory.module.scss';
import BannerCategoryItem from '@components/blocks/Banner/components/BannerCategoryItem/BannerCategoryItem.tsx';
import type { BannerItem } from '@store/api/banners/types';
interface BannerCategoryProps {
  items: BannerItem[];
}
const BannerCategory = ({ items }: BannerCategoryProps) => {
  if (items.length === 0) return null;
  return (
    <div className={styles.category}>
      <div className={styles.category__list}>
        {items.map((item) => (
          <BannerCategoryItem key={item.id} image={item.image} title={item.title || item.name} path={item.link} />
        ))}
      </div>
    </div>
  );
};
export default BannerCategory;
