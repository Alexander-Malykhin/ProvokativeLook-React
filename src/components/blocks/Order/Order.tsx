import {useState} from "react";
//styles
import styles from './Order.module.scss'
//layouts
import SectionLayout from "@layouts/SectionLayout/SectionLayout.tsx";
import MainLayoutContainer from "@layouts/MainLayoutContainer/MainLayoutContainer.tsx";
//components
import OrderSummary from "@components/blocks/Basket/components/OrderSummary/OrderSummary.tsx";
import MainButton from "@UI/buttons/MainButton/MainButton.tsx";


const Order = () => {

    const [payment, setPayment] = useState('cash');

    return (
        <SectionLayout>
            <MainLayoutContainer className={styles.order}>
                <div className={styles.list}>
                    <div className={styles.list__container}>
                        <h2 className={styles.list__title}>
                            1. Данные получателя
                        </h2>

                        <div className={styles.list__fields}>
                            <div className={styles.field}>
                                <label className={styles.field__label}>
                                    Имя*
                                </label>
                                <input type="text" className={styles.field__input} placeholder={'Алиса'}/>
                            </div>

                            <div className={styles.field}>
                                <label className={styles.field__label}>
                                    Фамилия*
                                </label>

                                <input type="text" className={styles.field__input} placeholder={'Иванова'}/>
                            </div>

                            <div className={styles.field}>
                                <label className={styles.field__label}>
                                    Электронная почта*
                                </label>

                                <input type="email" className={styles.field__input}
                                       placeholder={'__________@yandex.ru'}/>
                            </div>

                            <div className={styles.field}>
                                <label className={styles.field__label}>
                                    Телефон*
                                </label>

                                <input type="phone" className={styles.field__input} placeholder={'+7 (999) 999-99-99'}/>
                            </div>
                        </div>
                    </div>

                    <div className={styles.list__container}>
                        <h2 className={styles.list__title}>
                            2. Доставка
                        </h2>

                        <div className={styles.list__dots}>
                            <label className={styles.deliveryRadio}>
                                <input
                                    type="radio"
                                    name="payment"
                                    checked={payment === 'cdek'}
                                    onChange={() => setPayment('cdek')}
                                    className={styles.deliveryRadio__input}
                                />

                                <span className={styles.deliveryRadio__dot}/>

                                <div className={styles.deliveryRadio__content}>
                                    <span className={styles.deliveryRadio__title}>
                                       В пункт выдачи CDEK
                                    </span>
                                    <span className={styles.deliveryRadio__address}>
                                      Ростов-на-Дону, переулок Халтуринский, 159/63 #SRND55
                                    </span>

                                    <div className={styles.deliveryRadio__information}>
                                        <span className={styles.deliveryRadio__description}>
                                            14 марта
                                        </span>
                                        <span className={styles.deliveryRadio__description}>
                                            560 рублей
                                        </span>
                                    </div>
                                </div>
                            </label>

                            <label className={styles.deliveryRadio}>
                                <input
                                    type="radio"
                                    name="payment"
                                    checked={payment === 'cdek'}
                                    onChange={() => setPayment('cdek')}
                                    className={styles.deliveryRadio__input}
                                />

                                <span className={styles.deliveryRadio__dot}/>

                                <div className={styles.deliveryRadio__content}>
                                    <span className={styles.deliveryRadio__title}>
                                       В отделение Почты России
                                    </span>
                                    <span className={styles.deliveryRadio__address}>
                                        Ростов-на-Дону, пер. Братский, 55 #SRND201
                                    </span>

                                    <div className={styles.deliveryRadio__information}>
                                        <span className={styles.deliveryRadio__description}>
                                            14 марта
                                        </span>
                                        <span className={styles.deliveryRadio__description}>
                                            560 рублей
                                        </span>
                                    </div>
                                </div>
                            </label>
                        </div>
                    </div>

                    <div className={styles.list__container}>
                        <h2 className={styles.list__title}>
                            3. Оплата
                        </h2>

                        <div className={styles.list__dots}>
                            <label className={styles.deliveryRadio}>
                                <input
                                    type="radio"
                                    name="payment"
                                    checked={payment === 'cdek'}
                                    onChange={() => setPayment('cdek')}
                                    className={styles.deliveryRadio__input}
                                />

                                <span className={styles.deliveryRadio__dot}/>

                                <span className={styles.deliveryRadio__text}>
                                    Оплата при получении. Картой или наличными
                                </span>
                            </label>

                            <label className={styles.deliveryRadio}>
                                <input
                                    type="radio"
                                    name="payment"
                                    checked={payment === 'cdek'}
                                    onChange={() => setPayment('cdek')}
                                    className={styles.deliveryRadio__input}
                                />

                                <span className={styles.deliveryRadio__dot}/>

                                <span className={styles.deliveryRadio__text}>
                                    Оплата банковской картой
                                </span>
                            </label>
                        </div>

                        <div className={styles.order__footer}>
                            <MainButton type={'submit'}>
                                Оформить заказ
                            </MainButton>
                        </div>
                    </div>
                </div>
                <OrderSummary/>
            </MainLayoutContainer>
        </SectionLayout>
    );
};

export default Order;