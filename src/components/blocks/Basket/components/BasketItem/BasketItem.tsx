import { useState } from 'react';
//styles
import styles from './BasketItem.module.scss';
//components
import BasketActions from "@components/blocks/Basket/components/BasketItem/components/BasketActions/BasketActions.tsx";
import BasketCounter from "@components/blocks/Basket/components/BasketCounter/BasketCounter.tsx";
//UI
import Image from '@UI/buttons/Image/Image.tsx';
import InputCheck from '@components/blocks/Basket/UI/InputCheck/InputCheck.tsx';

interface BasketProduct {
    id: number;
    image: string;
    title: string;
    article: string;
    size: string;
    color: string;
    count: number;
    price: string;
}

interface BasketItemProps {
    item: BasketProduct;
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
}

const BasketItem = ({ item, checked, onCheckedChange }: BasketItemProps) => {
    const [count, setCount] = useState(item.count);

    const description = `Арт. ${item.article} / Размер: ${item.size} / Цвет: ${item.color}`;

    return (
        <article className={styles.item}>
            <InputCheck
                checked={checked}
                onChange={(event) => onCheckedChange(event.target.checked)}
            />

            <div className={styles.item__body}>
                <div className={styles.item__top}>
                    <Image
                        src={item.image}
                        alt="image-icon"
                        className={styles.item__image}
                    />

                    <div className={styles.item__content}>
                        <div className={styles.item__main}>
                            <div className={styles.item__header}>
                                <h2 className={styles.item__header_title}>{item.title}</h2>

                                <div className={styles.item__header_buttons}>
                                    <BasketActions />
                                </div>
                            </div>

                            <div className={styles.item__body}>
                                <p className={styles.item__body_description}>{description}</p>
                            </div>

                            <div className={styles.item__mobile_body}>
                                <p className={styles.item__mobile_body_description}>
                                    Арт. {item.article}
                                </p>
                                <p className={styles.item__mobile_body_description}>
                                    Размер: {item.size}
                                </p>
                                <p className={styles.item__mobile_body_description}>
                                    Цвет: {item.color}
                                </p>
                            </div>
                        </div>

                        <div className={styles.item__footer}>
                            <div className={styles.item__footer_counter}>
                                <BasketCounter
                                    count={count}
                                    onDecrease={() => setCount((prev) => Math.max(1, prev - 1))}
                                    onIncrease={() => setCount((prev) => prev + 1)}
                                />
                            </div>

                            <span className={styles.item__footer_price}>{item.price}</span>
                        </div>
                    </div>
                </div>

                <div className={styles.item__bottom}>
                    <BasketCounter
                        count={count}
                        onDecrease={() => setCount((prev) => Math.max(1, prev - 1))}
                        onIncrease={() => setCount((prev) => prev + 1)}
                    />

                    <BasketActions />
                </div>
            </div>
        </article>
    );
};

export default BasketItem;