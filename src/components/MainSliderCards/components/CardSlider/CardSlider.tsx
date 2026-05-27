//styles
import styles from './CardSlider.module.scss'
//components
import CardSizes from "@components/MainSliderCards/components/CardSizes/CardSizes.tsx";
//UI
import Image from "@UI/buttons/Image/Image.tsx";
//types
import type {CardSliderInterface} from "@components/MainSliderCards/components/CardSlider/types/type.ts";

const CardSlider = ({image, title, price, sizes} : CardSliderInterface) => {
    return (
        <article className={styles.card}>
            <div className={styles.card__header}>
                <Image src={image} alt={'card-image'} className={styles.card__image}/>
            </div>

            <div className={styles.card__body}>
                <div className={styles.card__information}>
                    <h2 className={styles.card__information_title}>
                        {title}
                    </h2>

                    <CardSizes sizes={sizes}/>
                </div>

                <span className={styles.card__price}>
                    {price}
                </span>
            </div>
        </article>
    );
};

export default CardSlider;