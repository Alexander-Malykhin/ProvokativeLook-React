import {useNavigate} from "react-router";
//styles
import styles from "./OrderCard.module.scss";
//types
import type {OrderInterface} from "@components/blocks/Profile/types/types.ts";
//components
import Image from "@UI/media/Image/Image";

interface OrderCardProps {
    order: OrderInterface;
}

const OrderCard = ({order}: OrderCardProps) => {

    const navigate = useNavigate();

    return (
        <article className={styles.card}>
            <div className={styles.card__content}>
                <span className={`${styles.card__label} ${styles[`card__label_${order.status}`]}`}>
                    {order.statusText}
                </span>

                <span className={styles.card__orderId}>
                    Заказ №{order.number}
                </span>

                <span className={styles.card__date}>
                    от {order.date}
                </span>

                <div className={styles.card__information}>
                    <p className={styles.card__information_text}>
                        Сумма:
                    </p>

                    <h2 className={styles.card__information_sum}>
                        {order.total}
                    </h2>

                    <span className={styles.card__information_counter}>
                        / {order.productsCount} товаров
                    </span>
                </div>

                <button
                    className={styles.card__button}
                    onClick={() => navigate(`/order/${order.id}`)}
                >
                    Подробнее о заказе
                </button>
            </div>
            <div className={styles.card__list}>
                {
                    order.products.slice(0,4).map(item => (
                        <article
                            className={styles.card__list_item}
                            key={item.id}
                        >
                            <Image src={item.image} className={styles.card__list_image}/>
                        </article>
                    ))
                }
                {order.products.length > 4 && (
                    <article className={styles.card__list_end}>
                        {order.products.slice(4).length}+
                    </article>
                )}
            </div>
        </article>
    );
};

export default OrderCard;
