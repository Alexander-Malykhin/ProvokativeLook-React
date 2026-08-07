import Image from "@UI/media/Image/Image";
import { Link } from "react-router-dom";
import styles from "./ReturnCard.module.scss";
import type { ReturnItemInterface } from "@components/blocks/Profile/types/types.ts";

interface ReturnCardProps {
  item: ReturnItemInterface;
}

const ReturnCard = ({ item }: ReturnCardProps) => (
  <article className={styles.card}>
    <div className={styles.card__information}>
      <div className={styles.card__row}>
        <span className={styles.card__status}>{item.status}</span>
        <h4 className={styles.card__title}>
          Заявка на возврат от {item.date} г.
        </h4>
      </div>

      <div className={styles.card__row}>
        <span className={styles.card__description}>
          Заказ № {item.orderNumber}
        </span>
        <span className={styles.card__description}>
          Сумма: {item.total.toLocaleString("ru-RU")} ₽ / {item.productsCount}{" "}
          товаров
        </span>
      </div>

      <Link to={`/profile/return/${item.id}`} className={styles.card__more}>
        Подробнее о возврате
      </Link>
    </div>

    <div className={styles.card__products}>
      {item.products.map((product) => (
        <Image
          key={product.id}
          src={product.image}
          alt={`Товар возврата № ${item.orderNumber}`}
          className={styles.card__image}
        />
      ))}
    </div>
  </article>
);

export default ReturnCard;
