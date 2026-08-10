import { useNavigate } from "react-router";

// styles
import styles from "./OrderCard.module.scss";

// types
import type { OrderDto } from "@store/api/orders/types";

// components
import Image from "@UI/media/Image/Image";

interface OrderCardProps {
  order: OrderDto;
}

const formatMoney = (value: number, currency: string): string => {
  try {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: currency || "RUB",
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `${new Intl.NumberFormat("ru-RU").format(value)} ${currency}`;
  }
};

const OrderCard = ({ order }: OrderCardProps) => {
  const navigate = useNavigate();

  return (
    <article className={styles.card}>
      <div className={styles.card__content}>
        <span
          className={`${styles.card__label} ${styles[`card__label_${order.status}`]}`}
          title={`Стадия CRM: ${order.stage.name}`}
        >
          {order.statusText}
        </span>

        <span className={styles.card__orderId}>Заказ №{order.number}</span>

        <span className={styles.card__date}>
          {order.date ? `от ${order.date}` : ""}
        </span>

        <div className={styles.card__information}>
          <p className={styles.card__information_text}>Сумма:</p>

          <h2 className={styles.card__information_sum}>
            {formatMoney(order.total, order.currency)}
          </h2>

          <span className={styles.card__information_counter}>
            / {order.productsCount} товаров
          </span>
        </div>

        {order.delivery?.name && (
          <span className={styles.card__delivery}>
            Доставка: {order.delivery.name}
          </span>
        )}

        <button
          type="button"
          className={styles.card__button}
          onClick={() => navigate(`/order/${order.id}`)}
        >
          Подробнее о заказе
        </button>
      </div>

      <div className={styles.card__list}>
        {order.products.slice(0, 4).map((item, index) => (
          <article className={styles.card__list_item} key={`${item.id}-${index}`}>
            {item.image ? (
              <Image src={item.image} className={styles.card__list_image} />
            ) : (
              <div className={styles.card__list_placeholder}>Фото скоро</div>
            )}
          </article>
        ))}

        {order.products.length > 4 && (
          <article className={styles.card__list_end}>
            {order.products.length - 4}+
          </article>
        )}
      </div>
    </article>
  );
};

export default OrderCard;
