import { Link } from 'react-router-dom';
import styles from './CategoryPromoItem.module.scss';
import Image from '@UI/media/Image/Image';
import Title from '@UI/typography/Title/Title';
import { convertAliasTitle } from '@helpers/convertAliasTitle';
import type { CategoryPromoItemProps } from '@components/blocks/CategoryPromo/types/types';
const CategoryPromoItem = ({ item }: CategoryPromoItemProps) => {
  return (
    <Link to={item.link} className={styles.item}>
      {item.image && <Image src={item.image} alt={item.title.replace(/#br#/g, ' ')} className={styles.item__image} />}

      <div className={styles.item__information}>
        <Title className={styles.item__title} size="xl">
          {convertAliasTitle(item.title)}
        </Title>
      </div>
    </Link>
  );
};
export default CategoryPromoItem;
