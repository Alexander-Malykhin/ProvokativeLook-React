import styles from './SwitchInput.module.scss';
//types
import type {SwitchInputInterface} from "@UI/inputs/SwitchInput/types/types.ts";

const SwitchInput = ({ checked, onChange }: SwitchInputInterface) => {
    return (
        <div className={styles.switch}>
            <input
                type="checkbox"
                className={styles.switch__input}
                checked={checked}
                onChange={(event) => onChange?.(event.target.checked)}
            />
            <span className={styles.switch__slider}></span>
        </div>
    );
};

export default SwitchInput;