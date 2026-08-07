// styles
import styles from "./ProfileOrders.module.scss";
// types
import type { ProfilePageProps } from "@components/blocks/Profile/types/types.ts";
// data
import { PROFILE_ORDERS } from "./data";
// components
import OrderCard from "./components/OrderCard/OrderCard";
import NotOrder from "./components/NotOrder/NotOrder";

const ProfileOrders = ({ title }: ProfilePageProps) => {
    return (
        <div className={styles.content}>
            <h2 className={styles.content__title}>
                {title}
            </h2>

            {PROFILE_ORDERS.length === 0 ? (
                <NotOrder />
            ) : (
                <div className={styles.content__list}>
                    {PROFILE_ORDERS.map((order) => (
                        <OrderCard
                            key={order.id}
                            order={order}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProfileOrders;