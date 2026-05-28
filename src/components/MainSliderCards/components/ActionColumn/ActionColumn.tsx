//styles
import styles from './ActionColumn.module.scss'
//images
import SliderArrowRightImage from "@assets/arrows/arrow-right-gray.svg";
import SliderArrowLeftImage from "@assets/arrows/arrow-left-gray.svg";
//UI
import Image from "@UI/buttons/Image/Image.tsx";
//types
import type {ActionColumnInterface} from "@components/MainSliderCards/components/ActionColumn/types/types.ts";
//hooks
import {convertAliasTitle} from "@helpers/convertAliasTitle.tsx";

const ActionColumn = ({title, scrollSlider, withControls = true} : ActionColumnInterface) => {

    return (
        <div className={styles.column}>
            <h2 className={styles.column__title}>{convertAliasTitle(title)}</h2>
            {withControls && (
                <div className={styles.column__buttons}>
                    <button
                        type="button"
                        className={styles.column__arrow}
                        onClick={() => scrollSlider('left')}
                    >
                        <Image
                            src={SliderArrowLeftImage}
                            className={styles.column__arrow_image}
                        />
                    </button>

                    <button
                        type="button"
                        className={styles.column__arrow}
                        onClick={() => scrollSlider('right')}
                    >
                        <Image
                            src={SliderArrowRightImage}
                            className={styles.column__arrow_image}
                        />
                    </button>
                </div>
            )}
        </div>
    );
};

export default ActionColumn;