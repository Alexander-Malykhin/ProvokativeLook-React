import { useEffect, useMemo } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import styles from "./ProfileOrders.module.scss";
import type { ProfilePageProps } from "@components/blocks/Profile/types/types.ts";
import { useGetOrdersQuery } from "@store/api/orders/ordersApi";
import OrderCard from "./components/OrderCard/OrderCard";
import OrderDetails from "./components/OrderDetails/OrderDetails";
import NotOrder from "./components/NotOrder/NotOrder";

const ProfileOrders = ({ title }: ProfilePageProps) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const [searchParams] = useSearchParams();
  const paidOrder = searchParams.get("paid");
  const paymentSuccess = searchParams.get("payment") === "success";
  const { data, isLoading, isError, refetch } = useGetOrdersQuery({ limit:50, offset:0 }, { refetchOnMountOrArgChange:true });
  const orders = data?.data.items ?? [];
  const selected = useMemo(() => id ? orders.find((order) => String(order.id) === id) : undefined, [id,orders]);

  useEffect(() => {
    if (!paidOrder || id) return;
    const found = orders.find((order) => String(order.orderId ?? "") === paidOrder || String(order.number) === paidOrder);
    if (found) { navigate(`/profile/orders/${found.id}${paymentSuccess ? '?payment=success' : ''}`, { replace:true }); }
  },[id,navigate,orders,paidOrder,paymentSuccess]);

  return <div className={styles.content}>
    <h2 className={styles.content__title}>Мои заказы</h2>
    {isLoading ? <div className={styles.content__skeleton} aria-label="Загрузка заказов">{Array.from({length:3}).map((_,i)=><div key={i} className={styles.content__skeletonItem}/>)}</div>
    : isError ? <div className={styles.content__error}><span>Не удалось загрузить заказы.</span><button type="button" onClick={()=>void refetch()}>Повторить</button></div>
    : id && !selected ? <div className={styles.content__error}><span>Заказ не найден.</span><button type="button" onClick={()=>navigate('/profile/orders')}>К заказам</button></div>
    : selected ? <OrderDetails order={selected}/>
    : orders.length===0 ? <NotOrder/> : <div className={styles.content__list}>{orders.map((order)=><OrderCard key={order.id} order={order}/>)}</div>}
  </div>;
};
export default ProfileOrders;
