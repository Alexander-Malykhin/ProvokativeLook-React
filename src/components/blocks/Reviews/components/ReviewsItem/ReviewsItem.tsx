// styles
import styles from "./ReviewsItem.module.scss";
// types
import type { ReviewsItemProps } from "@components/blocks/Reviews/types/types";

const ReviewsItem = ({ name, date, text }: ReviewsItemProps) => {
  return (
    <article className={styles.item}>
      <div className={styles.item__head}>
        <span className={styles.item__name}>{name}</span>

        <span className={styles.item__date}>{date}</span>
      </div>

      <p className={styles.item__text}>{text}</p>
    </article>
  );
};

export default ReviewsItem;
