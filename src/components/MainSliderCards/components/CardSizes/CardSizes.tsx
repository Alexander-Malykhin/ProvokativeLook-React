//styles
import styles from './CardSizes.module.scss'
//types
import type {CardSizesInterface} from "@components/MainSliderCards/components/CardSizes/types/types.ts";

const CardSizes = ({sizes}: CardSizesInterface) => {
    return (
        <div className={styles.sizes}>
            {sizes.map(item => <span className={styles.sizes__item} key={item}>{item}</span>)}
        </div>
    );
};

export default CardSizes;