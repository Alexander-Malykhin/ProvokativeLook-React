//styles
import styles from './ProfileAddresses.module.scss'
import OrderFieldRadio from "@components/blocks/Order/components/OrderFieldRadio/OrderFieldRadio.tsx";

interface ProfileAddressesInterface {
    title: string
}

const ProfileAddresses = ({title}: ProfileAddressesInterface) => {
    return (
        <div className={styles.content}>
            <h2 className={styles.content__title}>
                {title}
            </h2>

            <div className={styles.content__list}>
                <OrderFieldRadio
                    name={'delivery'}
                    value={'cdek'}
                    mode={'dynamic'}
                >
                    <span className={styles.content__description}>В пункт выдачи CDEK, Ростов-на-Дону, переулок Халтуринский, 159/63 #SRND55</span>
                </OrderFieldRadio>

                <OrderFieldRadio
                    name={'delivery'}
                    value={'mail'}
                    mode={'dynamic'}
                >
                    <span className={styles.content__description}>В отделение Почты России, Ростов-на-Дону, пер. Братский, 55 #SRND201</span>
                </OrderFieldRadio>
            </div>
            <button className={styles.button}>
                <div className={styles.button__icon}>
                    <span className={styles.button__icon_line}></span>
                    <span className={styles.button__icon_line}></span>
                </div>
                Добавить новый адрес
            </button>
        </div>
    );
};

export default ProfileAddresses;