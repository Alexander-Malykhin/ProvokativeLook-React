import styles from './ProductDelivery.module.scss'
import Image from "@UI/buttons/Image/Image.tsx";
import BoxImage from "@assets/params/box.svg";
import InfoImage from "@assets/params/info.svg";
import ShopImage from "@assets/params/shop.svg";
import CarImage from "@assets/params/car.svg";

const ProductDelivery = () => {
    return (
        <div className={styles.delivery}>
            <article className={styles.delivery__item}>
                <div className={styles.delivery__content}>
                    <Image src={BoxImage} className={styles.delivery__icon}/>
                    <span className={styles.delivery__text}>Доставка курьером</span>
                </div>
                <Image src={InfoImage} className={styles.delivery__info}/>
            </article>

            <article className={styles.delivery__item}>
                <div className={styles.delivery__content}>
                    <Image src={ShopImage} className={styles.delivery__icon}/>
                    <span className={styles.delivery__text}>В пункты выдачи Почты России, СДЭК, Boxberry</span>
                </div>
                <Image src={InfoImage} className={styles.delivery__info}/>
            </article>

            <article className={styles.delivery__item}>
                <div className={styles.delivery__content}>
                    <Image src={CarImage} className={styles.delivery__icon}/>
                    <span className={styles.delivery__text}>По России 300 ₽, в страны СНГ 500 ₽</span>
                </div>
                <Image src={InfoImage} className={styles.delivery__info}/>
            </article>
        </div>
    );
};

export default ProductDelivery;