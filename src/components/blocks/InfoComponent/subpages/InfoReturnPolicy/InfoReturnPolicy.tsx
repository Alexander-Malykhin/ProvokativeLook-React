//styles
import styles from './InfoReturnPolicy.module.scss'

const InfoReturnPolicy = () => {
    return (
        <div className={styles.content}>
            <div className={styles.content__column}>
                <p className={styles.content__item}>
                    Возврат и обмен в online магазине осуществляется в течении 7-ми дней после получения посылки:
                </p>

                <ul className={styles.content__list}>
                    <li className={styles.content__list_item}>
                        Возврат товара надлежащего качества возможен, если сохранены его товарный вид,
                        потребительские свойства, ярлыки, бирки и этикетки;
                    </li>
                    <li className={styles.content__list_item}>
                        Доставка товара при возврате / обмене осуществляется силами и за счет покупателя;
                    </li>
                    <li className={styles.content__list_item}>
                        Для возврата / обмена покупки свяжитесь с нами в мессенджере в котором делали заказ:{' '}
                        <a href="#" className={styles.content__list_link}>WhatsAPP</a>,{' '}
                        <a href="#" className={styles.content__list_link}>Вконтакте</a>,{' '}
                        <a href="#" className={styles.content__list_link}>Одноклассники</a>,{' '}
                        <a href="#" className={styles.content__list_link}>Telegram</a>,{' '}
                        <a href="#" className={styles.content__list_link}>Instagram</a>;
                    </li>
                    <li className={styles.content__list_item}>
                        Обмен товара / Возврат денежных средств осуществляется после получения продавцом
                        возвратного отправления в течение 24 часов после приёмки товара на склад магазина;
                    </li>
                    <li className={styles.content__list_item}>
                        День получения возвратной посылки продавцом считать день принятия товара на склад магазина.
                    </li>
                </ul>
            </div>

            <div className={styles.content__column}>
                <p className={styles.content__item}>
                    <b>
                        Не соблюдение данных условий является основанием для отказа обмена/возврата товара.
                    </b>
                </p>
            </div>
        </div>
    );
};


export default InfoReturnPolicy;