import { safeSessionStorage } from '@helpers/browserStorage';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePayDeliveryMutation } from '@store/api/orders/ordersApi';
import type { OrderDto } from '@store/api/orders/types';
import { getRequestErrorMessage } from '@store/api/getRequestErrorMessage';
import styles from './OrderDetails.module.scss';

export default function DeliveryPayment({ order }: { order: OrderDto }) {
  const navigate = useNavigate();
  const [pay, { isLoading }] = usePayDeliveryMutation();
  const [error, setError] = useState('');
  const shipping = order.shipping;
  if (!shipping) return null;
  const awaitingManager =
    shipping.workflow === 'manager' && (!order.isPaid || !['awaiting_payment', 'ready'].includes(shipping.status));
  const cancelled = order.status === 'cancelled' || shipping.status === 'cancelled';
  const payShipping = async () => {
    if (!order.orderId || cancelled || shipping.paid) return;
    setError('');
    try {
      const response = await pay({ orderId: order.orderId }).unwrap();
      if (response.payment.url) {
        safeSessionStorage.setItem('provokativelook.payment.url', response.payment.url);
        safeSessionStorage.setItem('provokativelook.payment.order', String(order.orderId));
        safeSessionStorage.setItem('provokativelook.payment.purpose', 'delivery');
        navigate('/payment/redirect');
      }
    } catch (err) {
      setError(getRequestErrorMessage(err, 'Не удалось получить счёт на доставку'));
    }
  };
  const description =
    shipping.status === 'manual_review'
      ? 'Магазин уточняет оформление отправления.'
      : awaitingManager
        ? 'Предварительный расчёт. Счёт появится после оплаты товаров и подтверждения доставки менеджером.'
        : shipping.trackingNumber
          ? `Трек-номер: ${shipping.trackingNumber}`
          : shipping.paid
            ? 'Доставка оплачена. Отправление оформляется после оплаты товаров.'
            : 'Отдельный платёж магазину. Стоимость не включена в оплату товаров.';
  return (
    <div className={styles.details__paymentNotice}>
      <div>
        <strong>{shipping.provider === 'cdek' ? 'СДЭК' : 'Почта России'} · Доставка</strong>
        <strong>
          {shipping.amount > 0
            ? `${awaitingManager ? 'Ориентировочно ' : ''}${shipping.amount.toLocaleString('ru-RU', { style: 'currency', currency: shipping.currency })}`
            : 'Стоимость уточняется'}
        </strong>
        <span>{cancelled ? 'Заказ отменён' : description}</span>
        {error && (
          <span role="alert" style={{ color: '#c3170a' }}>
            {error}
          </span>
        )}
      </div>
      {!shipping.paid && !cancelled && !awaitingManager && (
        <button type="button" disabled={isLoading} onClick={() => void payShipping()}>
          {isLoading ? 'Получаем счёт…' : 'Оплатить доставку'}
        </button>
      )}
    </div>
  );
}
