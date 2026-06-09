import styles from './ProductsComposition.module.scss'
import Image from "@UI/buttons/Image/Image.tsx";
import LaundryImage from "@assets/params/laundry.svg";
import IroningImage from "@assets/params/ironing.svg";
import WashingImage from "@assets/params/washing.svg";

const ProductsComposition = () => {
    return (
        <div className={styles.composition}>
            <p className={styles.composition__description}>
                <span className={styles.composition__accent}>Состав:</span> 100% хлопок
            </p>

            <div className={styles.composition__list}>
                <Image src={LaundryImage} className={styles.information_item}/>
                <Image src={IroningImage} className={styles.information__item}/>
                <Image src={WashingImage} className={styles.information__item}/>
            </div>
        </div>
    );
};

export default ProductsComposition;