import { Link } from 'react-router-dom';
import styles from './BannerCategoryItem.module.scss';
import Image from '@UI/media/Image/Image';
import type { BannerCategoryItemProps } from '@components/blocks/Banner/types/types.ts';
const BannerCategoryItem = ({ image, title, path }: BannerCategoryItemProps) => {
  return (
    <Link to={path} className={styles.item}>
      <Image src={image} alt={title} className={styles.item__image} />

      <p className={styles.item__title}>{title}</p>
    </Link>
  );
};
export default BannerCategoryItem;
