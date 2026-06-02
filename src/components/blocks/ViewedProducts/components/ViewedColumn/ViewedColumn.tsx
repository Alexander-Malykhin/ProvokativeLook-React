//styles
import styles from './ViewedColumn.module.scss'
//images
import ArrowRightImage from "@assets/arrows/arrow-right-gray.svg";
import ArrowLeftImage from "@assets/arrows/arrow-left-gray.svg";
//UI
import Image from "@UI/buttons/Image/Image.tsx";

interface ViewedColumnInterface {
    onPrev: () => void;
    onNext: () => void;
}

const ViewedColumn = ({ onPrev, onNext }: ViewedColumnInterface) => {
    return (
        <div className={styles.column}>
            <h2 className={styles.column__title}>
                Вы смотрели
            </h2>

            <div className={styles.column__buttons}>
                <button type="button" className={styles.column__arrow} onClick={onPrev}>
                    <Image src={ArrowLeftImage} alt="arrow-icon" className={styles.column__arrow_image} />
                </button>

                <button type="button" className={styles.column__arrow} onClick={onNext}>
                    <Image src={ArrowRightImage} alt="arrow-icon" className={styles.column__arrow_image} />
                </button>
            </div>
        </div>
    );
};
export default ViewedColumn;