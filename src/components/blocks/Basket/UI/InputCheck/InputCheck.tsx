//styles
import styles from './InputCheck.module.scss';
//types
import type { InputCheckInterface } from '@components/blocks/Basket/UI/InputCheck/types/types.ts';

const InputCheck = ({ checked, onChange }: InputCheckInterface) => {
    return (
        <label className={styles.check}>
            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
                className={styles.check__input}
                readOnly
            />

            <span className={styles.check__box}></span>
        </label>
    );
};

export default InputCheck;