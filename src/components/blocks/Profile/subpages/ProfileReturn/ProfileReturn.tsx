//styles
import styles from './ProfileReturn.module.scss';
import { Link } from 'react-router-dom';
//images
import ProductImage from '@assets/products/product-1.png';
import Image from '@UI/buttons/Image/Image.tsx';

interface ProfileReturnInterface {
    title: string;
}

interface ReturnProductInterface {
    id: number;
    image: string;
}

interface ReturnItemInterface {
    id: number;
    status: string;
    date: string;
    orderNumber: string;
    total: number;
    productsCount: number;
    products: ReturnProductInterface[];
}

const returns: ReturnItemInterface[] = [
    {
        id: 1,
        status: 'Деньги отправлены',
        date: '21.02.2024',
        orderNumber: '123111',
        total: 20530,
        productsCount: 2,
        products: [
            { id: 1, image: ProductImage },
            { id: 2, image: ProductImage },
        ],
    },
];

const ProfileReturn = ({ title }: ProfileReturnInterface) => {
    return (
        <div className={styles.content}>
            <h2 className={styles.content__title}>{title}</h2>

            <div className={styles.content__list}>
                {returns.map(item => (
                    <article className={styles.item} key={item.id}>
                        <div className={styles.item__information}>
                            <div className={styles.item__row}>
                                <span className={styles.item__status}>
                                    {item.status}
                                </span>

                                <h4 className={styles.item__title}>
                                    Заявка на возврат от {item.date} г.
                                </h4>
                            </div>

                            <div className={styles.item__row}>
                                <span className={styles.item__description}>
                                    Заказ № {item.orderNumber}
                                </span>

                                <span className={styles.item__description}>
                                    Сумма: {item.total.toLocaleString('ru-RU')} ₽ / {item.productsCount} товаров
                                </span>
                            </div>

                            <Link to="#" className={styles.item__more}>
                                Подробнее о заказе
                            </Link>
                        </div>

                        <div className={styles.item__slider}>
                            {item.products.map(product => (
                                <Image
                                    key={product.id}
                                    src={product.image}
                                    className={styles.item__slider_image}
                                />
                            ))}
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
};

export default ProfileReturn;