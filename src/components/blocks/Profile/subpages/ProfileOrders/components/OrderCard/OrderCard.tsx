import { useNavigate } from "react-router";

// styles
import styles from "./OrderCard.module.scss";

// types
import type { OrderDto } from "@store/api/orders/types";
import { usePayOrderMutation } from "@store/api/orders/ordersApi";

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
  const [payOrder, { isLoading: isPaying }] = usePayOrderMutation();

  const handlePay = async () => {
    if (!order.orderId || isPaying) return;
    const response = await payOrder({ orderId: order.orderId }).unwrap();
    if (response.payment.paid) {
      navigate(`/profile/orders/${order.id}`);
      return;
    }
    if (response.payment.url) {
      sessionStorage.setItem("provokativelook.payment.url", response.payment.url);
      sessionStorage.setItem("provokativelook.payment.order", String(order.orderId));
      navigate("/payment/redirect");
    }
  };

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
          <div className={styles.card__delivery}>
            <span>Доставка: {order.delivery.name}</span>

            {order.delivery.trackingNumber && (
              <div className={styles.card__tracking}>
                <span>Трек-номер: {order.delivery.trackingNumber}</span>

              </div>
            )}
          </div>
        )}

        <div className={styles.card__actions}>
          <button
            type="button"
            className={styles.card__button}
            onClick={() => navigate(`/profile/orders/${order.id}`)}
          >
            Подробнее о заказе
          </button>
          {order.paymentState === "pending" ? (
            <span className={styles.card__paymentPending}>Подтверждаем оплату…</span>
          ) : order.canPay ? (
            <button type="button" className={styles.card__payButton} onClick={() => void handlePay()} disabled={isPaying}>
              {isPaying ? "Переходим к оплате..." : "Оплатить счёт"}
            </button>
          ) : null}
        </div>
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
