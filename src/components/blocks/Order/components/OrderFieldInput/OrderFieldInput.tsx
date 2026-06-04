import type {UseFormRegisterReturn} from "react-hook-form";
//styles
import styles from './OrderFieldInput.module.scss'

interface OrderFieldInputInterface {
    label: string;
    type?: string;
    placeholder?: string;
    register?: UseFormRegisterReturn;
    error?: string;
}

const OrderFieldInput = ({label, type = 'text', placeholder, error, register}: OrderFieldInputInterface) => {
    return (
        <div className={styles.field}>
            <label className={styles.field__label}>
                {label}
            </label>

            <input
                type={type}
                className={styles.field__input}
                placeholder={placeholder}
                {...register}
            />

            {error && (
                <span className={styles.field__error}>
                    {error}
                </span>
            )}
        </div>
    );
};

export default OrderFieldInput;