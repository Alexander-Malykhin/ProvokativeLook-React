import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import styles from "./ProfileOrders.module.scss";
import type { ProfilePageProps } from "@components/blocks/Profile/types/types.ts";
import { useGetOrdersQuery } from "@store/api/orders/ordersApi";
import OrderCard from "./components/OrderCard/OrderCard";
import OrderDetails from "./components/OrderDetails/OrderDetails";
import NotOrder from "./components/NotOrder/NotOrder";
const ProfileOrders = ({ title }: ProfilePageProps) => {
    const [limit, setLimit] = useState(5);
    const navigate = useNavigate();
    const { id } = useParams<{
        id?: string;
    }>();
    const [searchParams] = useSearchParams();
    const paidOrder = searchParams.get("paid");
    const paymentSuccess = searchParams.get("payment") === "success";
    const [returnedOrder, setReturnedOrder] = useState<string | null>(() => typeof window !== "undefined" ? sessionStorage.getItem("provokativelook.payment.returnedOrder") : null);
    const [pendingUntil] = useState(() => typeof window !== "undefined" ? Number(sessionStorage.getItem("provokativelook.payment.pendingUntil") ?? 0) : 0);
    const shouldPollPayment = Boolean(returnedOrder) && Date.now() < pendingUntil;
    const { data, isLoading, isFetching, isError, refetch } = useGetOrdersQuery(
        { limit, offset: 0 },
        {
            refetchOnMountOrArgChange: true,
            // Обычный список заказов обновляется через SSE (orders.changed).
            // Polling нужен только кратковременно после возврата с оплаты,
            // чтобы не дёргать пагинацию и hasMore каждые 3 секунды.
            pollingInterval: shouldPollPayment ? 3000 : 0,
            skipPollingIfUnfocused: false,
        }
    );
    const orders = data?.data.items ?? [];
    const pagination = data?.data.pagination;
    const selected = useMemo(() => id ? orders.find((order) => String(order.id) === id) : undefined, [id, orders]);
    useEffect(() => {
        if (!returnedOrder)
            return;
        const found = orders.find((order) => String(order.orderId ?? "") === returnedOrder || String(order.number) === returnedOrder);
        if (found?.isPaid || found?.paymentState === "pending" || Date.now() >= pendingUntil) {
            if (found?.isPaid) {
                sessionStorage.removeItem("provokativelook.payment.order");
            }
            if (found?.isPaid || Date.now() >= pendingUntil) {
                sessionStorage.removeItem("provokativelook.payment.returnedOrder");
                sessionStorage.removeItem("provokativelook.payment.pendingUntil");
                setReturnedOrder(null);
            }
        }
    }, [orders, pendingUntil, returnedOrder]);
    useEffect(() => {
        if (!paidOrder || id)
            return;
        const found = orders.find((order) => String(order.orderId ?? "") === paidOrder || String(order.number) === paidOrder);
        if (found) {
            navigate(`/profile/orders/${found.id}${paymentSuccess ? '?payment=success' : ''}`, { replace: true });
        }
    }, [id, navigate, orders, paidOrder, paymentSuccess]);
    return <div className={styles.content}>
    <h2 className={styles.content__title}>{title}</h2>
    {isLoading ? <div className={styles.content__skeleton} aria-label="Загрузка заказов">{Array.from({ length: 3 }).map((_, i) => <div key={i} className={styles.content__skeletonItem}/>)}</div>
            : isError ? <div className={styles.content__error}><span>Не удалось загрузить заказы.</span><button type="button" onClick={() => void refetch()}>Повторить</button></div>
                : id && !selected ? <div className={styles.content__error}><span>Заказ не найден.</span><button type="button" onClick={() => navigate('/profile/orders')}>К заказам</button></div>
                    : selected ? <OrderDetails order={selected}/>
                        : orders.length === 0 ? <NotOrder /> : <>
                            <div className={styles.content__list}>{orders.map((order) => <OrderCard key={order.id} order={order}/>)}</div>
                            {pagination?.hasMore && <button type="button" className={styles.content__loadMore} disabled={isFetching} onClick={() => setLimit((current) => current + 5)}>
                                {isFetching ? "Загружаем..." : "Загрузить ещё"}
                              </button>}
                          </>}
  </div>;
};
export default ProfileOrders;
