//styles
import styles from './MainCheckbox.module.scss';
//types
import type {MainCheckboxInterface} from "@UI/inputs/MainCheckbox/types/types.ts";

const MainCheckbox = ({ children, checked, onChange, register }: MainCheckboxInterface) => {
    return (
        <label className={styles.checkbox}>
            <input
                type="checkbox"
                checked={checked}
                onChange={(event) => onChange?.(event.target.checked)}
                className={styles.checkbox__input}
                {...register}
            />

            <span className={styles.checkbox__box} />

            <span className={styles.checkbox__text}>
                {children}
            </span>
        </label>
    );
};

export default MainCheckbox;