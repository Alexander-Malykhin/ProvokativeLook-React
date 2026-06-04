import {type ReactNode} from "react";
import type { UseFormRegisterReturn } from 'react-hook-form';
//styles
import styles from './OrderFieldRadio.module.scss'

interface OrderRadioInterface {
    name: string;
    value: string;
    checked?: boolean;
    onChange?: (value: string) => void;
    register?: UseFormRegisterReturn;
    children?: ReactNode;
    mode?: 'static' | 'dynamic';
    description?: string;
}

const OrderFieldRadio = ({ name, value, checked, onChange, register, children, mode = 'static'}: OrderRadioInterface) => {
    return (
        <div className={styles.radio}>
            <input
                type="radio"
                name={name}
                value={value}
                checked={checked}
                onChange={() => onChange?.(value)}
                className={styles.radio__input}
                {...register}
            />

            <span className={styles.radio__dot}/>

            {mode === 'static' ? (
                <span className={styles.radio__text}>
                    {children}
                </span>
            ) : (
                <div className={styles.radio__content}>
                    {children}
                </div>
            )}
        </div>
    );
};

export default OrderFieldRadio;