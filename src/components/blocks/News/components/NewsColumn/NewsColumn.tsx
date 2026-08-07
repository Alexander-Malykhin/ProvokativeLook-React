// styles
import styles from "./NewsColumn.module.scss";
// images
import ArrowLeftImage from "@assets/arrows/arrow-left-gray.svg";
import ArrowRightImage from "@assets/arrows/arrow-right-gray.svg";
// UI
import Image from "@UI/buttons/Image/Image";
// types
import type {NewsColumnProps} from "@components/blocks/News/components/types/types.ts";


const NewsColumn = ({onPrev, onNext,}: NewsColumnProps) => {
    return (
        <div className={styles.column}>
            <h2 className={styles.column__title}>
                Новинки
            </h2>

            <div className={styles.column__buttons}>
                <button
                    type="button"
                    className={styles.column__arrow}
                    onClick={onPrev}
                >
                    <Image
                        src={ArrowLeftImage}
                        alt="Стрелка влево"
                        className={styles.column__arrow_image}
                    />
                </button>

                <button
                    type="button"
                    className={styles.column__arrow}
                    onClick={onNext}
                >
                    <Image
                        src={ArrowRightImage}
                        alt="Стрелка вправо"
                        className={styles.column__arrow_image}
                    />
                </button>
            </div>
        </div>
    );
};

export default NewsColumn;