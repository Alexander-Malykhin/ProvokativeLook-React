import { useNavigate } from "react-router-dom";
import Image from "@UI/media/Image/Image";
import type { OrderDto } from "@store/api/orders/types";
import { usePayOrderMutation } from "@store/api/orders/ordersApi";
import styles from "./OrderDetails.module.scss";

interface OrderDetailsProps { order: OrderDto; }

const money = (value: number, currency: string) => {
  try {
    return new Intl.NumberFormat("ru-RU", { style: "currency", currency: currency || "RUB", maximumFractionDigits: 2 }).format(value);
  } catch { return `${value.toLocaleString("ru-RU")} ${currency}`; }
};

const OrderDetails = ({ order }: OrderDetailsProps) => {
  const navigate = useNavigate();
  const [payOrder, { isLoading: isPaying }] = usePayOrderMutation();
  const handlePay = async () => {
    if (!order.orderId || isPaying) return;
    const response = await payOrder({ orderId: order.orderId }).unwrap();
    if (response.payment.paid) return;
    if (response.payment.url) {
      sessionStorage.setItem("provokativelook.payment.url", response.payment.url);
      sessionStorage.setItem("provokativelook.payment.order", String(order.orderId));
      navigate("/payment/redirect");
    }
  };
  const productsTotal = order.products.reduce((sum, product) => sum + (product.lineTotal ?? ((product.price ?? 0) * product.quantity)), 0);
  return (
    <div className={styles.details}>
      <button type="button" className={styles.details__back} onClick={() => navigate("/profile/orders")}>← <span>Заказ №{order.number}</span></button>
      <div className={styles.details__heading}>
        <span className={`${styles.details__status} ${styles[`details__status_${order.status}`]}`}>{order.statusText}</span>
        <span className={styles.details__date}>{order.date ? `от ${order.date}` : ""}</span>
      </div>
      {order.paymentState === "pending" && !order.isPaid ? (
        <div className={`${styles.details__paymentNotice} ${styles.details__paymentNotice_pending}`}>
          <div>
            <strong>Подтверждаем оплату</strong>
            <span>Платёж получен и сейчас подтверждается. Обычно это занимает несколько секунд.</span>
          </div>
          <span className={styles.details__paymentLoader} aria-hidden="true" />
        </div>
      ) : order.canPay ? (
        <div className={styles.details__paymentNotice}>
          <div><strong>Заказ не оплачен</strong><span>Счёт можно оплатить в любое время.</span></div>
          <button type="button" onClick={() => void handlePay()} disabled={isPaying}>{isPaying ? "Переходим..." : "Оплатить счёт"}</button>
        </div>
      ) : null}
      <div className={styles.details__sectionTitle}>Состав заказа / {order.productsCount} товара</div>
      <div className={styles.details__products}>
        {order.products.map((product, index) => (
          <article className={styles.product} key={`${product.offerId ?? product.id}-${index}`}>
            <div className={styles.product__media}>{product.image ? <Image src={product.image} className={styles.product__image} /> : <div className={styles.product__placeholder}>Фото скоро</div>}</div>
            <div className={styles.product__info}>
              <h3>{product.name}</h3>
              {product.size && <p>Размер: {product.size}</p>}
              {product.color && <p>Цвет: {product.color}</p>}
              <p>Количество: {product.quantity} шт.</p>
            </div>
            <div className={styles.product__price}>
              {product.oldPrice && product.oldPrice > (product.price ?? 0) && <span className={styles.product__oldPrice}>{money(product.oldPrice, order.currency)}</span>}
              <strong>{money(product.lineTotal ?? ((product.price ?? 0) * product.quantity), order.currency)}</strong>
            </div>
          </article>
        ))}
      </div>
      <div className={styles.details__summary}>
        <div><span>Товары:</span><strong>{money(order.productsTotal ?? productsTotal, order.currency)}</strong></div>
        {typeof order.discountTotal === "number" && order.discountTotal > 0 && <div><span>Скидка:</span><strong>− {money(order.discountTotal, order.currency)}</strong></div>}
        {typeof order.deliveryPrice === "number" && order.deliveryPrice > 0 && <div><span>Доставка:</span><strong>{money(order.deliveryPrice, order.currency)}</strong></div>}
        <div className={styles.details__summaryTotal}><span>{order.paid && order.paid > 0 ? "Оплачено:" : "Итого:"}</span><strong>{money(order.paid && order.paid > 0 ? order.paid : order.total, order.currency)}</strong></div>
      </div>
      {order.delivery?.name && <div className={styles.details__delivery}><div><span>Доставка</span><strong>{order.delivery.name}</strong></div>{order.delivery.formattedAddress && <p>{order.delivery.formattedAddress}</p>}{order.delivery.trackingNumber && <p>Трек-номер: {order.delivery.trackingNumber}</p>}</div>}
    </div>
  );
};
export default OrderDetails;
