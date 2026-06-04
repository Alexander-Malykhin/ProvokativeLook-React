import {Link} from "react-router-dom";
//styles
import styles from './ProfileOrders.module.scss'
//images
import ProductImage from '@assets/products/product-1.png';
import Image from "@UI/buttons/Image/Image.tsx";

interface ProfileOrdersInterface {
    title: string
}

export type OrderStatus = 'delivery' | 'completed' | 'return' | 'cancelled';

export interface OrderProductInterface {
    id: number;
    image: string;
}

export interface OrderInterface {
    id: number;
    number: string;
    date: string;
    status: OrderStatus;
    statusText: string;
    total: number;
    productsCount: number;
    products: OrderProductInterface[];
}

export const orders: OrderInterface[] = [
    {
        id: 1,
        number: '123111',
        date: '15.02.2025',
        status: 'delivery',
        statusText: 'В пути',
        total: 150675,
        productsCount: 7,
        products: [
            {id: 1, image: ProductImage},
            {id: 2, image: ProductImage},
            {id: 3, image: ProductImage},
            {id: 4, image: ProductImage},
            {id: 5, image: ProductImage},
            {id: 6, image: ProductImage},
            {id: 7, image: ProductImage},
        ],
    },
    {
        id: 2,
        number: '123111',
        date: '15.02.2025',
        status: 'completed',
        statusText: 'Выполнен',
        total: 150675,
        productsCount: 7,
        products: [
            {id: 1, image: ProductImage},
        ],
    },
    {
        id: 3,
        number: '123111',
        date: '15.02.2025',
        status: 'return',
        statusText: 'Возврат',
        total: 150675,
        productsCount: 7,
        products: [
            {id: 1, image: ProductImage},
        ],
    },
    {
        id: 4,
        number: '123111',
        date: '15.02.2025',
        status: 'cancelled',
        statusText: 'Отменен',
        total: 150675,
        productsCount: 7,
        products: [
            {id: 1, image: ProductImage},
            {id: 2, image: ProductImage},
        ],
    },
];

const ProfileOrders = ({title}: ProfileOrdersInterface) => {

    const statusClasses = {
        delivery: styles.item__status_delivery,
        completed: styles.item__status_completed,
        return: styles.item__status_return,
        cancelled: styles.item__status_cancelled,
    };

    return (
        <div className={styles.content}>
            <h2 className={styles.content__title}>
                {title}
            </h2>

            <div className={styles.content__list}>
                {orders.map(order => {

                    const visibleLimit = 4;
                    const hiddenCount = Math.max(order.products.length - visibleLimit, 0);
                    const visibleProducts = order.products.slice(-visibleLimit);


                    return (
                        <article className={styles.item} key={order.id}>
                            <div className={styles.item__column}>
                                <div className={styles.item__row}>
                               <span className={`${styles.item__status} ${statusClasses[order.status]}`}>
                                  {order.statusText}
                               </span>

                                    <h4 className={styles.item__title}>
                                        Заказ № {order.number}
                                    </h4>

                                    <span className={styles.item__date}>от {order.date}</span>
                                </div>

                                <div className={styles.item__row}>
                                <span className={styles.item__sum}>
                                   Сумма:
                                </span>

                                    <h4 className={styles.item__title}>
                                        {order.total} ₽
                                    </h4>

                                    <span className={styles.item__count}>
                                   / {order.productsCount} товаров
                                </span>
                                </div>

                                <Link to={'#'} className={styles.item__more}>
                                    Подробнее о заказе
                                </Link>
                            </div>

                            <div className={styles.item__slider}>
                                {visibleProducts.map(item => (
                                    <Image
                                        key={item.id}
                                        src={item.image}
                                        className={styles.item__slider_image}
                                    />
                                ))}

                                {hiddenCount > 0 && (
                                    <div className={styles.item__slider_more}>
                                        {hiddenCount}+
                                    </div>
                                )}
                            </div>
                        </article>
                    )
                })}
            </div>
        </div>
    );
};

export default ProfileOrders;