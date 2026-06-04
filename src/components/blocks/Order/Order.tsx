//styles
import styles from './Order.module.scss'
//layouts
import SectionLayout from "@layouts/SectionLayout/SectionLayout.tsx";
import MainLayoutContainer from "@layouts/MainLayoutContainer/MainLayoutContainer.tsx";
//components
import OrderSummary from "@components/blocks/Basket/components/OrderSummary/OrderSummary.tsx";
import OrderStepContainer from "@components/blocks/Order/components/OrderStepContainer/OrderStepContainer.tsx";
//UI
import MainButton from "@UI/buttons/MainButton/MainButton.tsx";
import OrderCheckBox from "@components/blocks/Order/components/OrderCheckBox/OrderCheckBox.tsx";
import OrderFieldRadio from "@components/blocks/Order/components/OrderFieldRadio/OrderFieldRadio.tsx";
import OrderFieldInput from "@components/blocks/Order/components/OrderFieldInput/OrderFieldInput.tsx";


const Order = () => {
    return (
        <SectionLayout>
            <MainLayoutContainer className={styles.order}>
                <div className={styles.order__list}>
                    <OrderStepContainer title={'1. Данные получателя'} mode={'fields'}>
                        <OrderFieldInput
                            label={'Имя*'}
                            placeholder={'Алиса'}
                        />
                        <OrderFieldInput
                            label={' Фамилия*'}
                            placeholder={'Иванова'}
                        />
                        <OrderFieldInput
                            label={' Электронная почта*'}
                            placeholder={'__________@yandex.ru'}
                            type={'email'}
                        />
                        <OrderFieldInput
                            label={' Телефон*'}
                            placeholder={'+7 (999) 999-99-99'}
                            type={'phone'}
                        />
                    </OrderStepContainer>

                    <OrderStepContainer title={' 2. Доставка'} mode={'radio'}>
                        <OrderFieldRadio
                            name={'delivery'}
                            value={'cdek'}
                            mode={'dynamic'}
                        >
                            <span className={styles.order__title}>В пункт выдачи CDEK</span>
                            <span className={styles.order__address}>Ростов-на-Дону, переулок Халтуринский, 159/63 #SRND55</span>
                            <span className={styles.order__description}>14 марта</span>
                            <span className={styles.order__description}>560 рублей</span>
                        </OrderFieldRadio>
                        <OrderFieldRadio
                            name={'delivery'}
                            value={'mail'}
                            mode={'dynamic'}
                        >
                            <span className={styles.order__title}>В отделение Почты России</span>
                            <span className={styles.order__address}>Ростов-на-Дону, пер. Братский, 55 #SRND201</span>
                            <span className={styles.order__description}>14 марта</span>
                            <span className={styles.order__description}>560 рублей</span>
                        </OrderFieldRadio>

                        <div className={styles.order__information}>
                            <button className={styles.button}>
                                <div className={styles.button__icon}>
                                    <span className={styles.button__icon_line}></span>
                                    <span className={styles.button__icon_line}></span>
                                </div>
                                Добавить новый адрес
                            </button>

                            <div className={styles.price}>
                                <div className={styles.price__item}>
                                    <h2 className={styles.price__item_title}>
                                        Дата доставки
                                    </h2>
                                    <span className={styles.price__item_text}>
                                         14 марта
                                    </span>
                                </div>
                                <div className={styles.price__item}>
                                    <h2 className={styles.price__item_title}>
                                        Стоимость
                                    </h2>
                                    <span className={styles.price__item_text}>
                                         560 рублей
                                    </span>
                                </div>
                            </div>
                        </div>

                    </OrderStepContainer>

                    <OrderStepContainer title={'3. Оплата'} mode={'radio'}>
                        <OrderFieldRadio
                            name={'payment'}
                            value={'cash'}
                        >
                            Оплата при получении. Картой или наличными
                        </OrderFieldRadio>

                        <OrderFieldRadio
                            name={'payment'}
                            value={'card'}
                        >
                            Оплата банковской картой
                        </OrderFieldRadio>

                        <div className={styles.order__footer}>
                            <MainButton type={'submit'}>
                                Оформить заказ
                            </MainButton>
                            <OrderCheckBox/>
                        </div>
                    </OrderStepContainer>
                </div>
                <OrderSummary/>
            </MainLayoutContainer>
        </SectionLayout>
    );
};

export default Order;