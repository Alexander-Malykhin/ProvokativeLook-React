//styles
import styles from './InfoDeliveryPayment.module.scss'

const InfoDeliveryPayment = () => {
    return (
        <div className={styles.content}>
            <div className={styles.content__column}>
                <p className={styles.content__item}>
                    Посылки мы отправляем с помощью Почты России, транспортной компании CDEK, Вохberry:
                </p>

                <ul className={styles.content__list}>
                    <li className={styles.content__list_item}>300 рублей каждое отправление по России;</li>
                    <li className={styles.content__list_item}>500 рублей Казахстан, Киргизия, Армения, Беларусь;</li>
                    <li className={styles.content__list_item}>Стоимость ускоренной доставки высчитывается индивидуально
                        из расчета веса Вашей посылки;
                    </li>
                    <li className={styles.content__list_item}>Доставка курьером до двери на сумму до 50.000 RUB
                        оплачивается клиентом.
                    </li>
                </ul>
            </div>

            <div className={styles.content__column}>
                <p className={styles.content__item}>
                    <b>
                        На сумму выше 50.000 RUB доставка фиксируется стоимостью 300 RUB по России, в страны СНГ 500
                        RUB:
                    </b>
                </p>

                <ul className={styles.content__list}>
                    <li className={styles.content__list_item}>Скорость доставки зависит от города, в котором Вам было бы
                        удобно забрать посылку;
                    </li>
                    <li className={styles.content__list_item}>100% предоплата;</li>
                    <li className={styles.content__list_item}>Не в каждом регионе можно получить посылки с помощью всех
                        транспортных компаний. Поэтому наш
                        менеджер с радостью Вам подскажет, как и где Вы сможете забрать свою покупку;
                    </li>
                    <li className={styles.content__list_item}>Трек-номер приходит сразу после отправки;</li>
                    <li className={styles.content__list_item}>Срок оформления посылки 1-2 дня.</li>
                </ul>
            </div>
        </div>
    );
};

export default InfoDeliveryPayment;