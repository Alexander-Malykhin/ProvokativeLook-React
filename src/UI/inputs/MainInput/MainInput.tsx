//styles
import styles from './MainInput.module.scss'
//types
import type {MainInputInterface} from "@UI/inputs/MainInput/types/types.ts";

const MainInput = ({className, placeholder, onChange, type, register, error}: MainInputInterface) => {
    return (
        <label className={styles.field}>
            <input
                className={`${styles.field__input} ${error ? styles.field__input_error : ''} ${className}`}
                placeholder={placeholder}
                onChange={onChange}
                type={type}
                {...register}
            />

            {error && (
                <span className={styles.field__error}>
                    {error}
                </span>
            )}
        </label>
    );
};

export default MainInput;