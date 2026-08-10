// styles
import styles from "./ProfileOrders.module.scss";

// types
import type { ProfilePageProps } from "@components/blocks/Profile/types/types.ts";

// api
import { useGetOrdersQuery } from "@store/api/orders/ordersApi";

// components
import OrderCard from "./components/OrderCard/OrderCard";
import NotOrder from "./components/NotOrder/NotOrder";

const ProfileOrders = ({ title }: ProfilePageProps) => {
  const { data, isLoading, isError, refetch } = useGetOrdersQuery({
    limit: 50,
    offset: 0,
  });

  const orders = data?.data.items ?? [];

  return (
    <div className={styles.content}>
      <h2 className={styles.content__title}>{title}</h2>

      {isLoading ? (
        <div className={styles.content__skeleton} aria-label="Загрузка заказов">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className={styles.content__skeletonItem} />
          ))}
        </div>
      ) : isError ? (
        <div className={styles.content__error}>
          <span>Не удалось загрузить заказы.</span>
          <button type="button" onClick={() => void refetch()}>
            Повторить
          </button>
        </div>
      ) : orders.length === 0 ? (
        <NotOrder />
      ) : (
        <div className={styles.content__list}>
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfileOrders;
